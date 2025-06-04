package wallet

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var CreateWalletTable = `CREATE TABLE IF NOT EXISTS wallets(
id UUID PRIMARY KEY,
owner_type VARCHAR(30) CHECK (owner_type IN ('user', 'campaign', 'platform'))
owner_id UUID,
balance NUMERIC(12,2) DEFAULT 0,
currency VARCHAR(6) DEFAULT 'NGN',
created_at TIMESTAMP DEFAULT NOW()
)`

var TransactionTable = `CREATE TABLE IF NOT EXISTS transactions (
id UUID PRIMARY KEY,
transaction_type VARCHAR(30) CHECK (
	transaction_type IN ('donation', 'platform_fee', 'withdrawal', 'reversal'
	)
	),
camapaign_id UUID REFERENCES campaign(id),
wallet_id UUID REFERENCE wallets(id),
amount NUMERIC(12,2),
payer_name VARCHAR(150),
reference_id VARCHAR(150),
metadata JSONB,
created_at TIMESTAMP DEFAULT NOW()
)`

var WithdrawalTable = `CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id),
    amount NUMERIC(12,2),
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'paid', 'failed')) DEFAULT 'pending',
    destination_account VARCHAR(20),
    bank_code VARCHAR(15),
    requested_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
)
`
var WebHookLog = `CREATE TABLE IF NOT EXISTS webhook_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    payload JSONB,
    received_at TIMESTAMP DEFAULT NOW()
)`

const transactionTableQuery = `
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    reference_id TEXT UNIQUE NOT NULL,
    donor_name TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

const (
	ErcasSecretKey = "ECRS-TEST-SK11jU5xRkSzVCt9dckli3AlzkQIXwezH1FMfgDy5f"
	ErcasApiKey    = "ECRS-TEST-AKRJjS3IyHEeC29BqvjrWPlD6aQNQS0Dfun98Yus0w"
)

type Transaction struct {
	CampaignID      string  `db:"campaign_id"`
	TransactionType string  `db:"transaction_type"`
	Amount          float64 `db:"amount"`
	ReferenceID     string  `db:"reference_id"`

	Metadata map[string]interface{} `db:"metadata"`
}

type ErcasWebhookPayload struct {
	Event      string                 `json:"event"`          // e.g., "payment.success"
	Reference  string                 `json:"reference"`      // Unique transaction ID
	Amount     float64                `json:"amount"`         // Amount paid
	Currency   string                 `json:"currency"`       // e.g., "NGN"
	Status     string                 `json:"status"`         // e.g., "success"
	Channel    string                 `json:"channel"`        // e.g., "bank_transfer"
	Metadata   map[string]interface{} `json:"metadata"`       // Custom fields like campaign_id
	PaidAt     time.Time              `json:"paid_at"`        // Timestamp of payment
	PayerName  string                 `json:"payer_name"`     // (if available)
	AccountNum string                 `json:"account_number"` // (optional, for trace)
}

type PaymentInitiationRequest struct {
	Amount           float64 `json:"amount" binding:"required"`
	PaymentReference string  `json:"paymentReference" binding:"required"`
	PaymentMethods   string  `json:"paymentMethods" binding:"required"`
	CustomerEmail    string  `json:"customerEmail" binding:"required,email"`
	CustomerName     string  `json:"customerName" binding:"required"`
	Currency         string  `json:"currency" binding:"required"`
	Description      string  `json:"description,omitempty"`
	CampaignID       string  `json:"campaign_id" binding:"required"`
}

type PaymentInitiationResponse struct {
	RequestSuccessful bool        `json:"requestSuccessful"`
	ResponseMessage   string      `json:"responseMessage"`
	ResponseCode      string      `json:"responseCode"`
	ResponseBody      interface{} `json:"responseBody"`
}

func ErcasWebhook(ctx *gin.Context) {
	// Verify Authorization header
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
		return
	}

	// Check if the token matches our secret key
	expectedToken := "Bearer " + ErcasSecretKey
	if authHeader != expectedToken {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization token"})
		return
	}

	var payload ErcasWebhookPayload
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload format"})
		return
	}

	// Log the webhook for debugging
	log.Printf("Received Ercas webhook: %+v", payload)

	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection not found"})
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid database connection type"})
		return
	}

	// Initialize table if needed
	if err := initTransactionTable(sqlDB); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize transaction table"})
		return
	}

	// Only process successful transactions
	if payload.Status != "success" {
		ctx.JSON(http.StatusOK, gin.H{
			"requestSuccessful": true,
			"responseMessage":   "Ignored non-success transaction",
			"responseCode":      "success",
			"responseBody":      []interface{}{},
		})
		return
	}

	// Get campaign ID from metadata
	campaignIDRaw, ok := payload.Metadata["campaign_id"]
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "campaign_id missing in metadata"})
		return
	}
	campaignID := fmt.Sprintf("%v", campaignIDRaw)

	// Process the donation
	if err := processDonation(sqlDB, campaignID, payload); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Processing failed: " + err.Error()})
		return
	}

	// Return Ercas-compatible response
	ctx.JSON(http.StatusOK, gin.H{
		"requestSuccessful": true,
		"responseMessage":   "success",
		"responseCode":      "success",
		"responseBody":      []interface{}{},
	})
}

func initTransactionTable(db *sql.DB) error {
	// First drop the existing table
	_, err := db.Exec(`DROP TABLE IF EXISTS transactions`)
	if err != nil {
		return err
	}

	// Then create the table with the correct schema
	_, err = db.Exec(transactionTableQuery)
	return err
}

func processDonation(db *sql.DB, campaignID string, payload ErcasWebhookPayload) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Check for duplicate
	var count int
	err = tx.QueryRow(`SELECT COUNT(*) FROM transactions WHERE reference_id = $1`, payload.Reference).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		log.Println("Duplicate donation:", payload.Reference)
		return nil
	}

	// Insert transaction
	metaJSON, _ := json.Marshal(payload.Metadata)

	_, err = tx.Exec(`
		INSERT INTO transactions (campaign_id, transaction_type, amount, reference_id, donor_name, metadata)
		VALUES ($1, 'donation', $2, $3, $4, $5)
	`, campaignID, payload.Amount, payload.Reference, payload.PayerName, metaJSON)
	if err != nil {
		return err
	}

	// Update campaign balance
	_, err = tx.Exec(`UPDATE fundraising SET balance = COALESCE(balance, 0) + $1 WHERE id = $2`, payload.Amount, campaignID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func DonationWebhookHandler(c *gin.Context) {
	var donation struct {
		CampaignID string  `json:"campaign_id"`
		Amount     float64 `json:"amount"`
		DonorName  string  `json:"donor_name"`
	}

	if err := c.ShouldBindJSON(&donation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Get database connection from context
	db, exists := c.Get("db")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection not found"})
		return
	}

	// First check if the campaign exists
	var campaignExists bool
	err := db.(*sql.DB).QueryRow("SELECT EXISTS(SELECT 1 FROM fundraising WHERE id = $1)", donation.CampaignID).Scan(&campaignExists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to check campaign existence",
			"details": err.Error(),
		})
		return
	}

	if !campaignExists {
		c.JSON(http.StatusNotFound, gin.H{
			"error":       "Campaign not found",
			"campaign_id": donation.CampaignID,
		})
		return
	}

	// Check if balance column exists
	var balanceColumnExists bool
	err = db.(*sql.DB).QueryRow(`
		SELECT EXISTS (
			SELECT 1 
			FROM information_schema.columns 
			WHERE table_name = 'fundraising' 
			AND column_name = 'balance'
		);
	`).Scan(&balanceColumnExists)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to check balance column",
			"details": err.Error(),
		})
		return
	}

	if !balanceColumnExists {
		// Try to add the balance column
		_, err = db.(*sql.DB).Exec(`
			ALTER TABLE fundraising 
			ADD COLUMN balance DECIMAL(12,2) DEFAULT 0;
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to add balance column",
				"details": err.Error(),
			})
			return
		}
	}

	// Update campaign balance
	_, err = db.(*sql.DB).Exec(`
		UPDATE fundraising 
		SET balance = balance + $1 
		WHERE id = $2
	`, donation.Amount, donation.CampaignID)

	if err != nil {
		// Get table structure for debugging
		var tableStructure []struct {
			ColumnName string `db:"column_name"`
			DataType   string `db:"data_type"`
		}
		rows, _ := db.(*sql.DB).Query(`
			SELECT column_name, data_type 
			FROM information_schema.columns 
			WHERE table_name = 'fundraising';
		`)
		if rows != nil {
			defer rows.Close()
			for rows.Next() {
				var col struct {
					ColumnName string `db:"column_name"`
					DataType   string `db:"data_type"`
				}
				if err := rows.Scan(&col.ColumnName, &col.DataType); err == nil {
					tableStructure = append(tableStructure, col)
				}
			}
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":           "Failed to update campaign balance",
			"details":         err.Error(),
			"campaign_id":     donation.CampaignID,
			"table_structure": tableStructure,
		})
		return
	}

	// Generate a unique reference ID
	referenceID := fmt.Sprintf("DON-%d-%s", time.Now().Unix(), donation.CampaignID)

	// Create transaction record
	_, err = db.(*sql.DB).Exec(`
		INSERT INTO transactions (campaign_id, amount, donor_name, transaction_type, reference_id)
		VALUES ($1, $2, $3, 'donation', $4)
	`, donation.CampaignID, donation.Amount, donation.DonorName, referenceID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create transaction record",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Donation processed successfully",
		"campaign_id":  donation.CampaignID,
		"amount":       donation.Amount,
		"reference_id": referenceID,
	})
}

func InitiatePayment(c *gin.Context) {
	var req PaymentInitiationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Invalid request data",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}

	// Validate campaign exists
	db, exists := c.Get("db")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Database connection not found",
			"responseCode":      "error",
			"responseBody":      nil,
		})
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Invalid database connection",
			"responseCode":      "error",
			"responseBody":      nil,
		})
		return
	}

	var campaignExists bool
	err := sqlDB.QueryRow("SELECT EXISTS(SELECT 1 FROM fundraising WHERE id = $1)", req.CampaignID).Scan(&campaignExists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Failed to verify campaign",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}

	if !campaignExists {
		c.JSON(http.StatusNotFound, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Campaign not found",
			"responseCode":      "error",
			"responseBody":      nil,
		})
		return
	}

	// Prepare the payment request to Ercas
	paymentRequest := map[string]interface{}{
		"amount":           req.Amount,
		"paymentReference": req.PaymentReference,
		"paymentMethods":   req.PaymentMethods,
		"customerEmail":    req.CustomerEmail,
		"customerName":     req.CustomerName,
		"currency":         req.Currency,
		"description":      req.Description,
		"metadata": map[string]interface{}{
			"campaign_id": req.CampaignID,
		},
	}

	// Make request to Ercas API
	jsonData, err := json.Marshal(paymentRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Failed to prepare payment request",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}

	// Create HTTP request to Ercas
	ercasReq, err := http.NewRequest("POST", "https://api-staging.ercaspay.com/api/v1/transaction/initialize", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Failed to create payment request",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}

	// Set headers
	ercasReq.Header.Set("Accept", "application/json")
	ercasReq.Header.Set("Content-Type", "application/json")
	ercasReq.Header.Set("Authorization", "Bearer "+ErcasSecretKey)

	// Send request to Ercas
	client := &http.Client{}
	ercasResp, err := client.Do(ercasReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Failed to connect to payment gateway",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}
	defer ercasResp.Body.Close()

	// Read response
	var ercasResponse PaymentInitiationResponse
	if err := json.NewDecoder(ercasResp.Body).Decode(&ercasResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"requestSuccessful": false,
			"responseMessage":   "Failed to process payment gateway response",
			"responseCode":      "error",
			"responseBody":      err.Error(),
		})
		return
	}

	// Return the response from Ercas
	c.JSON(ercasResp.StatusCode, ercasResponse)
}
