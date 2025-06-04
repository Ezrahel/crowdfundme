import React from 'react';
import './CampaignWithdrawals.css';

export interface Withdrawal {
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed'; // Example statuses
  method: string;
  details: string;
}

interface CampaignWithdrawalsProps {
  availableFunds: number;
  withdrawalHistory: Withdrawal[];
  campaignName?: string; // Prop for Campaign Name, made optional
  createdBy?: string; // Prop for Created By, made optional
}

const CampaignWithdrawals: React.FC<CampaignWithdrawalsProps> = ({
  availableFunds,
  withdrawalHistory,
  campaignName,
  createdBy
}) => {

  console.log('CampaignWithdrawals Props:', { availableFunds, withdrawalHistory });

  return (
    <div className="campaign-withdrawals-container">
      {/* Sidebar */}
      <div className="campaign-sidebar">
        <div className="campaign-info">
          <p className="campaign-name">{campaignName || 'Campaign Name'}</p>
          <p className="created-by">Created by: {createdBy || 'N/A'}</p>
        </div>
        <nav className="campaign-nav">
          <ul>
            <li><a href="#home"><i className="icon-home"></i> Home</a></li>
            <li className="active"><a href="#campaign"><i className="icon-campaign"></i> Campaign</a></li>
            <li><a href="#updates"><i className="icon-updates"></i> Updates</a></li>
            <li><a href="#comments"><i className="icon-comments"></i> Comments</a></li>
            <li><a href="#analytics"><i className="icon-analytics"></i> Analytics</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="withdrawals-main-content">
        <h1 className="withdrawals-title">Withdrawals</h1>
        <p className="withdrawals-description">Manage and process withdrawals from your campaign.</p>

        <div className="available-funds-section">
          <h2>Available Funds</h2>
          <div className="available-funds-card">
            <p>Total Available</p>
            <h3>${availableFunds?.toLocaleString() || 'N/A'}</h3>
          </div>
        </div>

        <div className="withdrawal-history-section">
          <h2>Withdrawal History</h2>
          <div className="withdrawal-history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalHistory && withdrawalHistory.map((withdrawal, index) => (
                  <tr key={index}>
                    <td>{withdrawal.date}</td>
                    <td>${withdrawal.amount?.toLocaleString() || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${withdrawal.status?.toLowerCase() || ''}`}>
                        {withdrawal.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{withdrawal.method}</td>
                    <td>{withdrawal.details}</td>
                  </tr>
                ))}
                {(!withdrawalHistory || withdrawalHistory.length === 0) && (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>No withdrawal history available.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignWithdrawals; 