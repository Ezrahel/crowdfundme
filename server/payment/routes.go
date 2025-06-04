package payment

import (
	"github.com/gin-gonic/gin"
)

// RegisterRoutes registers all payment-related routes
func RegisterRoutes(router *gin.RouterGroup) {
	payment := router.Group("/payment")
	{
		payment.POST("/card", InitiateCardPayment)
		payment.POST("/bank-transfer", InitiateBankTransfer)
		payment.POST("/ussd", InitiateUSSD)
		payment.POST("/pay-attitude", InitiatePayAttitude)
		payment.GET("/verify/:transactionRef", VerifyPayment)
		payment.POST("/webhook", HandlePaymentWebhook)
		payment.GET("/ws", notificationService.HandleWebSocket) // WebSocket endpoint for real-time notifications

		// Transaction history endpoint
		payment.GET("/transactions/:campaignId", func(c *gin.Context) {
			campaignId := c.Param("campaignId")
			page := c.DefaultQuery("page", "1")
			limit := c.DefaultQuery("limit", "20")

			transactions, err := GetTransactionHistory(c, campaignId, page, limit)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(200, transactions)
		})

		// Notification endpoints
		payment.GET("/notifications/:campaignId", func(c *gin.Context) {
			campaignId := c.Param("campaignId")
			notifications, err := notificationService.GetRecentNotifications(campaignId, 50)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(200, notifications)
		})

		payment.GET("/stats/:campaignId", func(c *gin.Context) {
			campaignId := c.Param("campaignId")
			stats, err := notificationService.GetPaymentStats(campaignId)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(200, stats)
		})
	}
}
