package payment

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// NotificationService handles all notification-related operations
type NotificationService struct {
	db            *sql.DB
	emailTemplate *template.Template
	upgrader      websocket.Upgrader
	clients       map[string][]*websocket.Conn
	mu            sync.RWMutex // Protect clients map
}

// NewNotificationService creates a new notification service
func NewNotificationService(db *sql.DB) *NotificationService {
	// Initialize email template
	emailTemplate := template.Must(template.New("payment_notification").Parse(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{.Title}}</h1>
        </div>
        <div class="content">
            <p>{{.Message}}</p>
            {{if .Details}}
            <div class="details">
                <h3>Transaction Details:</h3>
                <ul>
                    {{range $key, $value := .Details}}
                    <li><strong>{{$key}}:</strong> {{$value}}</li>
                    {{end}}
                </ul>
            </div>
            {{end}}
        </div>
        <div class="footer">
            <p>This is an automated message from CrowdFundMe</p>
        </div>
    </div>
</body>
</html>
`))

	return &NotificationService{
		db:            db,
		emailTemplate: emailTemplate,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // In production, implement proper origin checking
			},
		},
		clients: make(map[string][]*websocket.Conn),
	}
}

// EmailNotification represents an email notification
type EmailNotification struct {
	To      string
	Subject string
	Title   string
	Message string
	Details map[string]interface{}
}

// SendEmailNotification sends an email notification
func (s *NotificationService) SendEmailNotification(email EmailNotification) error {
	var body bytes.Buffer
	if err := s.emailTemplate.Execute(&body, email); err != nil {
		return fmt.Errorf("failed to execute email template: %v", err)
	}

	// In production, use a proper email service like SendGrid, AWS SES, etc.
	// This is a placeholder for the actual email sending logic
	fmt.Printf("Sending email to %s:\nSubject: %s\nBody: %s\n",
		email.To, email.Subject, body.String())

	return nil
}

// HandleWebSocket handles WebSocket connections for real-time updates
func (s *NotificationService) HandleWebSocket(c *gin.Context) {
	campaignID := c.Query("campaign_id")
	if campaignID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "campaign_id is required"})
		return
	}

	// Upgrade HTTP connection to WebSocket
	conn, err := s.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Printf("Failed to upgrade connection: %v\n", err)
		return
	}

	// Add connection to clients map
	s.mu.Lock()
	s.clients[campaignID] = append(s.clients[campaignID], conn)
	s.mu.Unlock()

	// Handle connection close
	defer func() {
		conn.Close()
		// Remove connection from clients map
		s.mu.Lock()
		clients := s.clients[campaignID]
		for i, c := range clients {
			if c == conn {
				s.clients[campaignID] = append(clients[:i], clients[i+1:]...)
				break
			}
		}
		s.mu.Unlock()
	}()

	// Keep connection alive and handle incoming messages
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// BroadcastNotification sends a notification to all connected clients for a campaign
func (s *NotificationService) BroadcastNotification(campaignID string, notification Notification) {
	s.mu.RLock()
	clients := s.clients[campaignID]
	s.mu.RUnlock()

	for _, client := range clients {
		if err := client.WriteJSON(notification); err != nil {
			fmt.Printf("Failed to send notification to client: %v\n", err)
		}
	}
}

// ProcessNotification processes a new notification
func (s *NotificationService) ProcessNotification(notification Notification) error {
	// Store notification in database
	if err := s.storeNotification(notification); err != nil {
		return fmt.Errorf("failed to store notification: %v", err)
	}

	// Get campaign details
	var campaignEmail string
	err := s.db.QueryRow(`
		SELECT email FROM fundraising WHERE id = $1
	`, notification.CampaignID).Scan(&campaignEmail)
	if err != nil {
		return fmt.Errorf("failed to get campaign email: %v", err)
	}

	// Parse metadata
	var metadata map[string]interface{}
	if err := json.Unmarshal(notification.Metadata, &metadata); err != nil {
		return fmt.Errorf("failed to parse notification metadata: %v", err)
	}

	// Prepare email notification
	email := EmailNotification{
		To:      campaignEmail,
		Subject: fmt.Sprintf("Payment %s - %s", notification.Type, notification.TransactionRef),
		Title:   fmt.Sprintf("Payment %s", notification.Type),
		Message: notification.Message,
		Details: map[string]interface{}{
			"Transaction Reference": notification.TransactionRef,
			"Date":                  time.Now().Format(time.RFC3339),
		},
	}

	// Add amount and currency if available
	if amount, ok := metadata["amount"].(float64); ok {
		email.Details["Amount"] = amount
	}
	if currency, ok := metadata["currency"].(string); ok {
		email.Details["Currency"] = currency
	}

	// Send email notification
	if err := s.SendEmailNotification(email); err != nil {
		return fmt.Errorf("failed to send email notification: %v", err)
	}

	// Broadcast real-time notification
	s.BroadcastNotification(notification.CampaignID, notification)

	return nil
}

// storeNotification stores a notification in the database
func (s *NotificationService) storeNotification(notification Notification) error {
	_, err := s.db.Exec(`
		INSERT INTO payment_notifications (
			transaction_ref, campaign_id, type, message, metadata
		) VALUES ($1, $2, $3, $4, $5)
	`, notification.TransactionRef, notification.CampaignID,
		notification.Type, notification.Message, notification.Metadata)
	return err
}

// GetRecentNotifications retrieves recent notifications for a campaign
func (s *NotificationService) GetRecentNotifications(campaignID string, limit int) ([]Notification, error) {
	rows, err := s.db.Query(`
		SELECT id, transaction_ref, campaign_id, type, message, metadata, created_at
		FROM payment_notifications
		WHERE campaign_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`, campaignID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification
	for rows.Next() {
		var n Notification
		var metadata []byte
		if err := rows.Scan(&n.ID, &n.TransactionRef, &n.CampaignID, &n.Type,
			&n.Message, &metadata, &n.CreatedAt); err != nil {
			return nil, err
		}
		n.Metadata = metadata
		notifications = append(notifications, n)
	}
	return notifications, nil
}

// GetPaymentStats retrieves payment statistics for a campaign
func (s *NotificationService) GetPaymentStats(campaignID string) (map[string]interface{}, error) {
	var stats struct {
		TotalSuccess int
		TotalFailed  int
		TotalAmount  float64
		LastPayment  time.Time
	}

	err := s.db.QueryRow(`
		SELECT 
			COUNT(CASE WHEN type = 'success' THEN 1 END) as total_success,
			COUNT(CASE WHEN type = 'failure' THEN 1 END) as total_failed,
			SUM(CASE WHEN type = 'success' 
				THEN (metadata->>'amount')::float 
				ELSE 0 END) as total_amount,
			MAX(CASE WHEN type = 'success' THEN created_at END) as last_payment
		FROM payment_notifications
		WHERE campaign_id = $1
	`, campaignID).Scan(&stats.TotalSuccess, &stats.TotalFailed, &stats.TotalAmount, &stats.LastPayment)

	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total_successful_payments": stats.TotalSuccess,
		"total_failed_payments":     stats.TotalFailed,
		"total_amount_raised":       stats.TotalAmount,
		"last_payment_date":         stats.LastPayment,
	}, nil
}
