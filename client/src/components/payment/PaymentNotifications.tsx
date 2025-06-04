import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PaymentNotifications.css';

interface Notification {
  id: number;
  transaction_ref: string;
  campaign_id: string;
  type: 'success' | 'failure' | 'retry';
  message: string;
  metadata: {
    amount?: number;
    currency?: string;
    error?: string;
    attempts?: number;
  };
  created_at: string;
}

const PaymentNotifications: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<{
    total_successful_payments: number;
    total_failed_payments: number;
    total_amount_raised: number;
    last_payment_date: string;
  } | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/payment/notifications/${campaignId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    // Fetch payment stats
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/payment/stats/${campaignId}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch payment stats:', error);
      }
    };

    fetchNotifications();
    fetchStats();

    // Set up WebSocket connection
    const ws = new WebSocket(`ws://${window.location.host}/api/payment/ws?campaign_id=${campaignId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      
      // Update stats when new payment is received
      if (notification.type === 'success') {
        fetchStats();
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [campaignId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'failure':
        return '❌';
      case 'retry':
        return '🔄';
      default:
        return '📢';
    }
  };

  return (
    <div className="payment-notifications">
      <div className="notifications-header">
        <h2>Payment Notifications</h2>
        <div className="connection-status">
          {wsConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      {stats && (
        <div className="payment-stats">
          <div className="stat-card">
            <h3>Total Raised</h3>
            <p>{stats.total_amount_raised.toLocaleString()} NGN</p>
          </div>
          <div className="stat-card">
            <h3>Successful Payments</h3>
            <p>{stats.total_successful_payments}</p>
          </div>
          <div className="stat-card">
            <h3>Failed Payments</h3>
            <p>{stats.total_failed_payments}</p>
          </div>
          <div className="stat-card">
            <h3>Last Payment</h3>
            <p>{new Date(stats.last_payment_date).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.type}`}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <div className="notification-details">
                <span className="transaction-ref">
                  Ref: {notification.transaction_ref}
                </span>
                {notification.metadata.amount && (
                  <span className="amount">
                    {notification.metadata.amount.toLocaleString()} {notification.metadata.currency}
                  </span>
                )}
                <span className="timestamp">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentNotifications; 