package payment

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	ErcasSecretKey = "ECRS-TEST-SK11jU5xRkSzVCt9dckli3AlzkQIXwezH1FMfgDy5f"
	ErcasApiKey    = "ECRS-TEST-AKRJjS3IyHEeC29BqvjrWPlD6aQNQS0Dfun98Yus0w"
)

// Transaction status constants
const (
	StatusPending   = "pending"
	StatusSuccess   = "success"
	StatusFailed    = "failed"
	StatusCancelled = "cancelled"
)

// Transaction table definition
const CreateTransactionTable = `
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    campaign_id VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    verification_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

// Transaction represents a payment transaction
type Transaction struct {
	ID                int            `json:"id"`
	TransactionRef    string         `json:"transaction_ref"`
	CampaignID        string         `json:"campaign_id"`
	Amount            float64        `json:"amount"`
	Currency          string         `json:"currency"`
	PaymentMethod     string         `json:"payment_method"`
	Status            string         `json:"status"`
	VerificationCount int            `json:"verification_count"`
	LastVerifiedAt    *time.Time     `json:"last_verified_at"`
	Metadata          map[string]any `json:"metadata"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
}

// PaymentRequest represents the common fields for all payment methods
type PaymentRequest struct {
	Amount           float64 `json:"amount" binding:"required"`
	PaymentReference string  `json:"paymentReference" binding:"required"`
	CustomerEmail    string  `json:"customerEmail" binding:"required,email"`
	CustomerName     string  `json:"customerName" binding:"required"`
	Currency         string  `json:"currency" binding:"required"`
	Description      string  `json:"description,omitempty"`
	CampaignID       string  `json:"campaign_id" binding:"required"`
}

// CardPaymentRequest extends PaymentRequest with card-specific fields
type CardPaymentRequest struct {
	PaymentRequest
	CardNumber string `json:"cardNumber" binding:"required"`
	CardExpiry string `json:"cardExpiry" binding:"required"`
	CardCVV    string `json:"cardCVV" binding:"required"`
}

// BankTransferRequest extends PaymentRequest with bank-specific fields
type BankTransferRequest struct {
	PaymentRequest
	BankName      string `json:"bankName"`
	AccountNumber string `json:"accountNumber"`
}

// USSDRequest extends PaymentRequest with USSD-specific fields
type USSDRequest struct {
	PaymentRequest
	PhoneNumber string `json:"phoneNumber" binding:"required"`
}

// PayAttitudeRequest extends PaymentRequest with Pay Attitude specific fields
type PayAttitudeRequest struct {
	PaymentRequest
	PhoneNumber string `json:"phoneNumber" binding:"required"`
}

// PaymentResponse represents the standard response format
type PaymentResponse struct {
	RequestSuccessful bool        `json:"requestSuccessful"`
	ResponseMessage   string      `json:"responseMessage"`
	ResponseCode      string      `json:"responseCode"`
	ResponseBody      interface{} `json:"responseBody"`
}

// PaymentWebhookPayload represents the webhook payload from Ercas
type PaymentWebhookPayload struct {
	Event          string                 `json:"event"`
	TransactionRef string                 `json:"transactionRef"`
	Amount         float64                `json:"amount"`
	Currency       string                 `json:"currency"`
	Status         string                 `json:"status"`
	PaymentMethod  string                 `json:"paymentMethod"`
	Metadata       map[string]interface{} `json:"metadata"`
	PaidAt         *time.Time             `json:"paidAt"`
	CustomerEmail  string                 `json:"customerEmail"`
	CustomerName   string                 `json:"customerName"`
}

// WebhookLog represents a log entry for webhook processing
type WebhookLog struct {
	ID        int64           `json:"id"`
	Event     string          `json:"event"`
	Payload   json.RawMessage `json:"payload"`
	Status    string          `json:"status"`
	Error     string          `json:"error,omitempty"`
	CreatedAt time.Time       `json:"created_at"`
}

// Notification represents a payment notification
type Notification struct {
	ID              int64           `json:"id"`
	TransactionRef  string          `json:"transaction_ref"`
	CampaignID      string          `json:"campaign_id"`
	Type            string          `json:"type"` // success, failure, retry
	Message         string          `json:"message"`
	Metadata        json.RawMessage `json:"metadata"`
	CreatedAt       time.Time       `json:"created_at"`
	ProcessedAt     *time.Time      `json:"processed_at,omitempty"`
	ProcessingError string          `json:"processing_error,omitempty"`
}

// Create notification table
const CreateNotificationTable = `
CREATE TABLE IF NOT EXISTS payment_notifications (
    id SERIAL PRIMARY KEY,
    transaction_ref VARCHAR(100) NOT NULL,
    campaign_id VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processing_error TEXT
);`

// Create webhook log table
const CreateWebhookLogTable = `
CREATE TABLE IF NOT EXISTS webhook_logs (
    id SERIAL PRIMARY KEY,
    event VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

var notificationService *NotificationService

// Initialize notification service
func init() {
	db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	notificationService = NewNotificationService(db)
}

// HandlePaymentWebhook processes payment status updates from Ercas with retry logic and notifications
func HandlePaymentWebhook(c *gin.Context) {
	// Start timing the webhook processing
	startTime := time.Now()

	// Verify webhook signature
	authHeader := c.GetHeader("Authorization")
	if authHeader != "Bearer "+ErcasSecretKey {
		logWebhook(c, "payment.webhook", c.Request.Body, "unauthorized", "Invalid webhook signature")
		c.JSON(http.StatusUnauthorized, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid webhook signature",
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	var payload PaymentWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		logWebhook(c, "payment.webhook", c.Request.Body, "invalid_payload", err.Error())
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid webhook payload",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Get database connection
	db, exists := c.Get("db")
	if !exists {
		logWebhook(c, "payment.webhook", c.Request.Body, "error", "Database connection not found")
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Database connection not found",
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		logWebhook(c, "payment.webhook", c.Request.Body, "error", "Invalid database connection")
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid database connection",
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Initialize tables if needed
	if err := initWebhookTables(sqlDB); err != nil {
		logWebhook(c, "payment.webhook", c.Request.Body, "error", "Failed to initialize tables: "+err.Error())
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to initialize tables",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Process webhook with retry logic
	maxRetries := 3
	var lastErr error
	for attempt := 1; attempt <= maxRetries; attempt++ {
		err := processWebhookWithTransaction(sqlDB, payload)
		if err == nil {
			// Create success notification
			notification := Notification{
				TransactionRef: payload.TransactionRef,
				CampaignID:     payload.Metadata["campaign_id"].(string),
				Type:           "success",
				Message:        fmt.Sprintf("Payment of %s %s processed successfully", payload.Currency, fmt.Sprintf("%.2f", payload.Amount)),
				Metadata:       json.RawMessage(fmt.Sprintf(`{"amount": %f, "currency": "%s"}`, payload.Amount, payload.Currency)),
			}

			// Process notification
			if err := notificationService.ProcessNotification(notification); err != nil {
				fmt.Printf("Failed to process notification: %v\n", err)
			}
			break
		}

		lastErr = err
		if attempt < maxRetries {
			// Log retry attempt
			logWebhook(c, "payment.webhook.retry", c.Request.Body, "retry",
				fmt.Sprintf("Attempt %d failed: %v. Retrying...", attempt, err))
			time.Sleep(time.Duration(attempt) * time.Second) // Exponential backoff
		}
	}

	if lastErr != nil {
		// Create failure notification
		notification := Notification{
			TransactionRef: payload.TransactionRef,
			CampaignID:     payload.Metadata["campaign_id"].(string),
			Type:           "failure",
			Message:        fmt.Sprintf("Payment processing failed after %d attempts", maxRetries),
			Metadata:       json.RawMessage(fmt.Sprintf(`{"error": "%v", "attempts": %d}`, lastErr, maxRetries)),
		}

		// Process notification
		if err := notificationService.ProcessNotification(notification); err != nil {
			fmt.Printf("Failed to process notification: %v\n", err)
		}

		logWebhook(c, "payment.webhook", c.Request.Body, "error",
			fmt.Sprintf("All retry attempts failed: %v", lastErr))
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to process webhook after retries",
			ResponseCode:      "error",
			ResponseBody:      lastErr.Error(),
		})
		return
	}

	// Log successful processing
	processingTime := time.Since(startTime)
	logWebhook(c, "payment.webhook", c.Request.Body, "success",
		fmt.Sprintf("Webhook processed successfully in %v", processingTime))

	c.JSON(http.StatusOK, PaymentResponse{
		RequestSuccessful: true,
		ResponseMessage:   "Webhook processed successfully",
		ResponseCode:      "success",
		ResponseBody:      nil,
	})
}

// processWebhookWithTransaction processes the webhook payload within a database transaction
func processWebhookWithTransaction(db *sql.DB, payload PaymentWebhookPayload) error {
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	// Update transaction status
	_, err = tx.Exec(`
		UPDATE payment_transactions 
		SET status = $1,
			updated_at = NOW(),
			metadata = jsonb_set(
				COALESCE(metadata, '{}'::jsonb),
				'{webhook_payload}',
				$2::jsonb
			)
		WHERE transaction_ref = $3
	`, payload.Status, payload, payload.TransactionRef)

	if err != nil {
		return fmt.Errorf("failed to update transaction status: %v", err)
	}

	// If payment is successful, update campaign balance
	if payload.Status == StatusSuccess {
		campaignID, ok := payload.Metadata["campaign_id"].(string)
		if ok {
			_, err = tx.Exec(`
				UPDATE fundraising 
				SET balance = COALESCE(balance, 0) + $1,
					updated_at = NOW()
				WHERE id = $2
			`, payload.Amount, campaignID)

			if err != nil {
				return fmt.Errorf("failed to update campaign balance: %v", err)
			}
		}
	}

	return tx.Commit()
}

// logWebhook logs webhook processing details
func logWebhook(c *gin.Context, event string, payload io.Reader, status string, errorMsg string) {
	db, exists := c.Get("db")
	if !exists {
		fmt.Printf("Failed to log webhook: database connection not found\n")
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		fmt.Printf("Failed to log webhook: invalid database connection\n")
		return
	}

	// Read payload
	payloadBytes, err := io.ReadAll(payload)
	if err != nil {
		fmt.Printf("Failed to read webhook payload: %v\n", err)
		return
	}

	// Insert log entry
	_, err = sqlDB.Exec(`
		INSERT INTO webhook_logs (event, payload, status, error)
		VALUES ($1, $2, $3, $4)
	`, event, payloadBytes, status, errorMsg)

	if err != nil {
		fmt.Printf("Failed to insert webhook log: %v\n", err)
	}
}

// createNotification creates a new payment notification
func createNotification(db *sql.DB, notification Notification) error {
	_, err := db.Exec(`
		INSERT INTO payment_notifications (
			transaction_ref, campaign_id, type, message, metadata
		) VALUES ($1, $2, $3, $4, $5)
	`, notification.TransactionRef, notification.CampaignID,
		notification.Type, notification.Message, notification.Metadata)
	return err
}

// initWebhookTables initializes the webhook-related tables
func initWebhookTables(db *sql.DB) error {
	_, err := db.Exec(CreateWebhookLogTable)
	if err != nil {
		return fmt.Errorf("failed to create webhook_logs table: %v", err)
	}

	_, err = db.Exec(CreateNotificationTable)
	if err != nil {
		return fmt.Errorf("failed to create payment_notifications table: %v", err)
	}

	return nil
}

// Helper function to initialize transaction table
func initTransactionTable(db *sql.DB) error {
	_, err := db.Exec(CreateTransactionTable)
	return err
}

// Helper function to validate campaign existence
func validateCampaign(c *gin.Context, campaignID string) error {
	db, exists := c.Get("db")
	if !exists {
		return fmt.Errorf("database connection not found")
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		return fmt.Errorf("invalid database connection type")
	}

	var campaignExists bool
	err := sqlDB.QueryRow("SELECT EXISTS(SELECT 1 FROM fundraising WHERE id = $1)", campaignID).Scan(&campaignExists)
	if err != nil {
		return fmt.Errorf("failed to verify campaign: %v", err)
	}

	if !campaignExists {
		return fmt.Errorf("campaign not found")
	}

	return nil
}

// Helper function to send request to Ercas API
func sendToErcasAPI(endpoint string, payload interface{}) (PaymentResponse, error) {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return PaymentResponse{}, fmt.Errorf("failed to marshal request: %v", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", "https://api-staging.ercaspay.com/api/v1"+endpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		return PaymentResponse{}, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+ErcasSecretKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return PaymentResponse{}, fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Parse response
	var response PaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return PaymentResponse{}, fmt.Errorf("failed to parse response: %v", err)
	}

	return response, nil
}

// InitiateCardPayment handles card payment initiation
func InitiateCardPayment(c *gin.Context) {
	var req CardPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid request data",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Validate campaign exists
	if err := validateCampaign(c, req.CampaignID); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   err.Error(),
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Send request to Ercas API
	response, err := sendToErcasAPI("/transaction/initialize", map[string]interface{}{
		"amount":           req.Amount,
		"paymentReference": req.PaymentReference,
		"paymentMethods":   "card",
		"customerEmail":    req.CustomerEmail,
		"customerName":     req.CustomerName,
		"currency":         req.Currency,
		"description":      req.Description,
		"metadata": map[string]interface{}{
			"campaign_id": req.CampaignID,
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to initiate payment",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// InitiateBankTransfer handles bank transfer initiation
func InitiateBankTransfer(c *gin.Context) {
	var req BankTransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid request data",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Validate campaign exists
	if err := validateCampaign(c, req.CampaignID); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   err.Error(),
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Send request to Ercas API
	response, err := sendToErcasAPI("/transaction/initialize", map[string]interface{}{
		"amount":           req.Amount,
		"paymentReference": req.PaymentReference,
		"paymentMethods":   "bank_transfer",
		"customerEmail":    req.CustomerEmail,
		"customerName":     req.CustomerName,
		"currency":         req.Currency,
		"description":      req.Description,
		"metadata": map[string]interface{}{
			"campaign_id": req.CampaignID,
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to initiate payment",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// InitiateUSSD handles USSD payment initiation
func InitiateUSSD(c *gin.Context) {
	var req USSDRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid request data",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Validate campaign exists
	if err := validateCampaign(c, req.CampaignID); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   err.Error(),
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Send request to Ercas API
	response, err := sendToErcasAPI("/transaction/initialize", map[string]interface{}{
		"amount":           req.Amount,
		"paymentReference": req.PaymentReference,
		"paymentMethods":   "ussd",
		"customerEmail":    req.CustomerEmail,
		"customerName":     req.CustomerName,
		"currency":         req.Currency,
		"description":      req.Description,
		"metadata": map[string]interface{}{
			"campaign_id": req.CampaignID,
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to initiate payment",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// InitiatePayAttitude handles Pay Attitude payment initiation
func InitiatePayAttitude(c *gin.Context) {
	var req PayAttitudeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Invalid request data",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	// Validate campaign exists
	if err := validateCampaign(c, req.CampaignID); err != nil {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   err.Error(),
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Send request to Ercas API
	response, err := sendToErcasAPI("/transaction/initialize", map[string]interface{}{
		"amount":           req.Amount,
		"paymentReference": req.PaymentReference,
		"paymentMethods":   "pay_attitude",
		"customerEmail":    req.CustomerEmail,
		"customerName":     req.CustomerName,
		"currency":         req.Currency,
		"description":      req.Description,
		"metadata": map[string]interface{}{
			"campaign_id": req.CampaignID,
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to initiate payment",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// VerifyPayment verifies a payment status
func VerifyPayment(c *gin.Context) {
	transactionRef := c.Param("transactionRef")
	if transactionRef == "" {
		c.JSON(http.StatusBadRequest, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Transaction reference is required",
			ResponseCode:      "error",
			ResponseBody:      nil,
		})
		return
	}

	// Send request to Ercas API
	response, err := sendToErcasAPI("/transaction/verify/"+transactionRef, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, PaymentResponse{
			RequestSuccessful: false,
			ResponseMessage:   "Failed to verify payment",
			ResponseCode:      "error",
			ResponseBody:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetTransactionHistory retrieves paginated transaction history for a campaign
func GetTransactionHistory(c *gin.Context, campaignID string, pageStr, limitStr string) (map[string]interface{}, error) {
	db, exists := c.Get("db")
	if !exists {
		return nil, fmt.Errorf("database connection not found")
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		return nil, fmt.Errorf("invalid database connection type")
	}

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	// Get total count
	var total int
	err := sqlDB.QueryRow(`
		SELECT COUNT(*) 
		FROM payment_transactions 
		WHERE campaign_id = $1
	`, campaignID).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("failed to get transaction count: %v", err)
	}

	// Get transactions
	rows, err := sqlDB.Query(`
		SELECT id, transaction_ref, amount, currency, payment_method, 
			   status, metadata, created_at, updated_at
		FROM payment_transactions
		WHERE campaign_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`, campaignID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	var transactions []Transaction
	for rows.Next() {
		var t Transaction
		var metadata []byte
		if err := rows.Scan(&t.ID, &t.TransactionRef, &t.Amount, &t.Currency,
			&t.PaymentMethod, &t.Status, &metadata, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan transaction: %v", err)
		}
		if err := json.Unmarshal(metadata, &t.Metadata); err != nil {
			return nil, fmt.Errorf("failed to parse metadata: %v", err)
		}
		transactions = append(transactions, t)
	}

	return map[string]interface{}{
		"transactions": transactions,
		"pagination": map[string]interface{}{
			"total":  total,
			"page":   page,
			"limit":  limit,
			"pages":  (total + limit - 1) / limit,
			"offset": offset,
		},
	}, nil
}
