package campaign

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Campaign struct {
	ID           int       `json:"id"`
	Title        string    `json:"title" binding:"required"`
	Story        string    `json:"story" binding: "required"`
	CampaignDays int       `json:"campaign_days" binding: "required"`
	ImageVideo   string    `json:"image_or_video" binding: "required"`
	Completed    bool      `json:"completed"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

const CreateCampaignTable = `CREATE TABLE IF NOT EXISTS fundraising (
id SERIAL PRIMARY KEY,
title VARCHAR (255) NOT NULL,
story TEXT NOT NULL,
campaign_days INTEGER NOT NULL,
image_or_video VARCHAR (255) NOT NULL,
completed BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT WITH TIME ZONE DEFAULT CURRENT_TIME,
updated_at TIMESTAMP DEFAULT WITH TIME ZONE DEFAULT CURRENT_TIME
)`

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

	query := `
	INSERT INTO fundraising (title, story, campaign_days, completed, image_or_video, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	RETURNING id, created_at, updated_at`

	err := sqlDB.QueryRow(query, campaign.Title, campaign.Story, campaign.CampaignDays, campaign.Completed, campaign.ImageVideo).Scan(&campaign.ID, &campaign.CreatedAt, &campaign.UpdatedAt)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "could not create campaign",
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
		err := rows.Scan(&campaign.ID, &campaign.Title, &campaign.Story, &campaign.CampaignDays, &campaign.ImageVideo, &campaign.Completed, &campaign.CreatedAt, &campaign.UpdatedAt)
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
	query := `SELECT * FROM fundraising WHERE id = $1`
	var campaign Campaign
	err := sqlDB.QueryRow(query, id).Scan(&campaign.ID, &campaign.Title, &campaign.Story, &campaign.CampaignDays, &campaign.ImageVideo, &campaign.Completed, &campaign.CreatedAt, &campaign.UpdatedAt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "could not get campaign",
		})
		return
	}
	ctx.JSON(http.StatusOK, campaign)
}

func UpdateCampaign(ctx *gin.Context) {

}
func DeleteCampaign(ctx *gin.Context) {
	db, exists := ctx.Get("db") // Fixed: was getting "id" instead of "db"
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
