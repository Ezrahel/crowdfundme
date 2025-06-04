package campaign

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Campaign struct {
	ID int `json:"id"`
	// Step 1: Location and Category
	Country  string `json:"country"`
	Postcode string `json:"postcode"`
	Category string `json:"category"`

	// Step 2: Who you're fundraising for
	WhoFor string `json:"who_for"`

	// Step 3: Goal
	Goal     float64 `json:"goal"`
	Currency string  `json:"currency"`

	// Step 4: Campaign Details
	Title       string `json:"title"`
	Description string `json:"description"`
	Story       string `json:"story"`
	Duration    int    `json:"duration"`
	CoverImage  string `json:"cover_image"`

	// Step 5: Account Details
	AccountHolder string `json:"account_holder"`
	BankName      string `json:"bank_name"`
	AccountNumber string `json:"account_number"`
	AccountType   string `json:"account_type"`

	// Campaign Status
	Balance   float64   `json:"balance"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

const CreateCampaignTable = `CREATE TABLE IF NOT EXISTS fundraising (
id SERIAL PRIMARY KEY,
	country VARCHAR(255) NOT NULL,
	postcode VARCHAR(20) NOT NULL,
	category VARCHAR(100) NOT NULL,
	who_for VARCHAR(100) NOT NULL,
	goal DECIMAL(10,2) NOT NULL,
	currency VARCHAR(3) NOT NULL,
	title VARCHAR(255) NOT NULL,
	description TEXT,
story TEXT NOT NULL,
	duration INTEGER NOT NULL,
	cover_image VARCHAR(255),
	account_holder VARCHAR(255) NOT NULL,
	bank_name VARCHAR(255) NOT NULL,
	account_number VARCHAR(50) NOT NULL,
	account_type VARCHAR(50) NOT NULL,
	balance DECIMAL(12,2) DEFAULT 0,
completed BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`

func addBalanceColumn(db *sql.DB) error {
	// First check if the column exists
	var columnExists bool
	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT 1 
			FROM information_schema.columns 
			WHERE table_name = 'fundraising' 
			AND column_name = 'balance'
		);
	`).Scan(&columnExists)
	if err != nil {
		return fmt.Errorf("failed to check if balance column exists: %v", err)
	}

	// If column doesn't exist, add it
	if !columnExists {
		_, err = db.Exec(`
			ALTER TABLE fundraising 
			ADD COLUMN balance DECIMAL(12,2) DEFAULT 0;
		`)
		if err != nil {
			return fmt.Errorf("failed to add balance column: %v", err)
		}
	}

	return nil
}

func initTable(db *sql.DB) error {
	// First drop the existing table
	_, err := db.Exec(`DROP TABLE IF EXISTS fundraising`)
	if err != nil {
		return fmt.Errorf("failed to drop table: %v", err)
	}

	// Then create the table with the correct schema
	_, err = db.Exec(CreateCampaignTable)
	if err != nil {
		return fmt.Errorf("failed to create table: %v", err)
	}

	return nil
}

func CreateCampaign(ctx *gin.Context) {
	var campaign Campaign
	if err := ctx.ShouldBindJSON(&campaign); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database connection not found",
		})
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid database connection type",
		})
		return
	}

	// Initialize table if it doesn't exist
	if err := initTable(sqlDB); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to initialize table: " + err.Error(),
		})
		return
	}

	query := `
		INSERT INTO fundraising (
			country, postcode, category, who_for, goal, currency,
			title, description, story, duration, cover_image,
			account_holder, bank_name, account_number, account_type,
			completed, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
			$16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
		)
	RETURNING id, created_at, updated_at`

	err := sqlDB.QueryRow(
		query,
		campaign.Country, campaign.Postcode, campaign.Category,
		campaign.WhoFor, campaign.Goal, campaign.Currency,
		campaign.Title, campaign.Description, campaign.Story,
		campaign.Duration, campaign.CoverImage,
		campaign.AccountHolder, campaign.BankName,
		campaign.AccountNumber, campaign.AccountType,
		campaign.Completed,
	).Scan(&campaign.ID, &campaign.CreatedAt, &campaign.UpdatedAt)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "could not create campaign: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, campaign)
}

func GetCampaigns(ctx *gin.Context) {
	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database connection not found",
		})
		return

	}
	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid database connection type",
		})
		return
	}
	rows, err := sqlDB.Query("SELECT * FROM fundraising")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "could not get campaigns",
		})
		return
	}
	defer rows.Close()
	campaigns := []Campaign{}
	for rows.Next() {
		var campaign Campaign
		err := rows.Scan(&campaign.ID, &campaign.Country, &campaign.Postcode, &campaign.Category, &campaign.WhoFor, &campaign.Goal, &campaign.Currency, &campaign.Title, &campaign.Description, &campaign.Story, &campaign.Duration, &campaign.CoverImage, &campaign.AccountHolder, &campaign.BankName, &campaign.AccountNumber, &campaign.AccountType, &campaign.Completed, &campaign.CreatedAt, &campaign.UpdatedAt)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "could not scan campaign",
			})
			return
		}
		campaigns = append(campaigns, campaign)
	}
	if err := rows.Err(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "could not iterate over campaigns",
		})
		return
	}
	ctx.JSON(http.StatusOK, campaigns)
}

func GetCampaign(ctx *gin.Context) {
	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "couldn't get db",
		})
		return
	}
	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "couldn't establish a DB request",
		})
		return
	}

	id := ctx.Param("id")
	query := `SELECT id, country, postcode, category, who_for, goal, currency, 
			  title, description, story, duration, cover_image, 
			  account_holder, bank_name, account_number, account_type, 
			  balance, completed, created_at, updated_at 
			  FROM fundraising WHERE id = $1`

	var campaign Campaign
	err := sqlDB.QueryRow(query, id).Scan(
		&campaign.ID,
		&campaign.Country,
		&campaign.Postcode,
		&campaign.Category,
		&campaign.WhoFor,
		&campaign.Goal,
		&campaign.Currency,
		&campaign.Title,
		&campaign.Description,
		&campaign.Story,
		&campaign.Duration,
		&campaign.CoverImage,
		&campaign.AccountHolder,
		&campaign.BankName,
		&campaign.AccountNumber,
		&campaign.AccountType,
		&campaign.Balance,
		&campaign.Completed,
		&campaign.CreatedAt,
		&campaign.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "campaign not found",
			"id":    id,
		})
		return
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "could not get campaign",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, campaign)
}

func UpdateCampaign(ctx *gin.Context) {
	// Get database connection
	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "database connection not found",
		})
		return
	}

	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "invalid database connection type",
		})
		return
	}

	// Get campaign ID from URL parameter
	id := ctx.Param("id")

	// Bind request body to campaign struct
	var campaign Campaign
	if err := ctx.ShouldBindJSON(&campaign); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	// Update campaign in database
	query := `
		UPDATE fundraising 
		SET country = $1, 
			postcode = $2, 
			category = $3, 
			who_for = $4, 
			goal = $5,
			currency = $6,
			title = $7,
			description = $8,
			story = $9,
			duration = $10,
			cover_image = $11,
			account_holder = $12,
			bank_name = $13,
			account_number = $14,
			account_type = $15,
			completed = $16,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $17
		RETURNING id, country, postcode, category, who_for, goal, currency, title, description, story, duration, cover_image, account_holder, bank_name, account_number, account_type, completed, created_at, updated_at`

	err := sqlDB.QueryRow(
		query,
		campaign.Country,
		campaign.Postcode,
		campaign.Category,
		campaign.WhoFor,
		campaign.Goal,
		campaign.Currency,
		campaign.Title,
		campaign.Description,
		campaign.Story,
		campaign.Duration,
		campaign.CoverImage,
		campaign.AccountHolder,
		campaign.BankName,
		campaign.AccountNumber,
		campaign.AccountType,
		campaign.Completed,
		id,
	).Scan(
		&campaign.ID,
		&campaign.Country,
		&campaign.Postcode,
		&campaign.Category,
		&campaign.WhoFor,
		&campaign.Goal,
		&campaign.Currency,
		&campaign.Title,
		&campaign.Description,
		&campaign.Story,
		&campaign.Duration,
		&campaign.CoverImage,
		&campaign.AccountHolder,
		&campaign.BankName,
		&campaign.AccountNumber,
		&campaign.AccountType,
		&campaign.Completed,
		&campaign.CreatedAt,
		&campaign.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "campaign not found",
		})
		return
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update campaign",
		})
		return
	}

	ctx.JSON(http.StatusOK, campaign)
}

func DeleteCampaign(ctx *gin.Context) {
	db, exists := ctx.Get("db")
	if !exists {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "couldn't get db",
		})
		return
	}
	sqlDB, ok := db.(*sql.DB)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "couldn't establish a DB request",
		})
		return
	}
	id := ctx.Param("id")
	query := `DELETE FROM fundraising WHERE id = $1`
	result, err := sqlDB.Exec(query, id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "already deleted or not found",
		})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "campaign not found",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "campaign deleted successfully",
	})
}
