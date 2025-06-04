package server

import (
	"database/sql"
	"net/http"
	"server/campaign"
	"server/payment"
	usermgt "server/userMgt"
	"server/wallet"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	// Database middleware
	r.Use(func(c *gin.Context) {
		db := s.db.(interface{ GetDB() *sql.DB }).GetDB()
		c.Set("db", db)
		c.Next()
	})

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Add your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	r.GET("/", s.HelloWorldHandler)

	r.GET("/health", s.healthHandler)
	api := r.Group("/api/v1")
	api.POST("/", campaign.CreateCampaign)
	api.GET("/", campaign.GetCampaigns)
	api.GET("/:id", campaign.GetCampaign)
	api.DELETE("/:id", campaign.DeleteCampaign)
	api.POST("/auth", usermgt.ClerkUserMgt)
	api.POST("/ercas/webhook", wallet.ErcasWebhook)
	api.POST("/donation", wallet.DonationWebhookHandler)

	// Register payment routes
	payment.RegisterRoutes(api)

	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}
