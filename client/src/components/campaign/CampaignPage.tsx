import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentNotifications from '../payment/PaymentNotifications';
import CampaignWithdrawals, { Withdrawal } from './CampaignWithdrawals';
import './CampaignPage.css';

interface Transaction {
  id: number;
  transaction_ref: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface PaymentStats {
  total_successful_payments: number;
  total_failed_payments: number;
  total_amount_raised: number;
  last_payment_date: string;
}

// Mock data for payments
const mockPaymentStats: PaymentStats = {
  total_successful_payments: 150,
  total_failed_payments: 10,
  total_amount_raised: 2500000,
  last_payment_date: new Date().toISOString(),
};

const mockTransactions: Transaction[] = [
  { id: 1, transaction_ref: 'TXN12345', amount: 5000, currency: 'NGN', payment_method: 'Card', status: 'success', created_at: new Date().toISOString() },
  { id: 2, transaction_ref: 'TXN12346', amount: 2000, currency: 'NGN', payment_method: 'Bank Transfer', status: 'success', created_at: new Date().toISOString() },
  { id: 3, transaction_ref: 'TXN12347', amount: 10000, currency: 'NGN', payment_method: 'USSD', status: 'pending', created_at: new Date().toISOString() },
  { id: 4, transaction_ref: 'TXN12348', amount: 1500, currency: 'NGN', payment_method: 'Card', status: 'failed', created_at: new Date().toISOString() },
  { id: 5, transaction_ref: 'TXN12349', amount: 7500, currency: 'NGN', payment_method: 'Pay Attitude', status: 'success', created_at: new Date().toISOString() },
];

// Mock data for withdrawals
const mockAvailableFunds = 15000;
const mockWithdrawalHistory: Withdrawal[] = [
  { date: '2024-03-15', amount: 5000, status: 'Completed', method: 'Bank Transfer', details: 'Processed' },
  { date: '2024-02-20', amount: 3000, status: 'Completed', method: 'Bank Transfer', details: 'Processed' },
  { date: '2024-01-10', amount: 2000, status: 'Completed', method: 'Bank Transfer', details: 'Processed' },
];

const CampaignPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Assume campaign details are fetched or available elsewhere
  const mockCampaignName = `Campaign ${campaignId}`;
  const mockCreatedBy = "Alex Harper";

  useEffect(() => {
    // Use mock data instead of fetching from API
    setStats(mockPaymentStats);
    
    // Simulate pagination with mock data
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = mockTransactions.slice(startIndex, endIndex);
    
    setTransactions(paginatedTransactions);
    setTotalPages(Math.ceil(mockTransactions.length / itemsPerPage));

    // Original fetch calls (commented out)
    // const fetchStats = async () => {
    //   try {
    //     const response = await fetch(`/api/payment/stats/${campaignId}`);
    //     const data = await response.json();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Failed to fetch payment stats:', error);
    //   }
    // };

    // const fetchTransactions = async () => {
    //   try {
    //     const response = await fetch(`/api/payment/transactions/${campaignId}?page=${currentPage}&limit=10`);
    //     const data = await response.json();
    //     setTransactions(data.transactions);
    //     setTotalPages(data.pagination.pages);
    //   } catch (error) {
    //     console.error('Failed to fetch transactions:', error);
    //   }
    // };

    // fetchStats();
    // fetchTransactions();

  }, [campaignId, currentPage]); // Keep dependencies as they are used for mock data simulation

  return (
    <div className="campaign-page">
      <div className="campaign-header">
        <h1>Campaign Dashboard</h1>
      </div>
      
      <div className="campaign-content-main">
        {/* Payment Stats */}
        {stats && (
          <div className="stats-section">
            <h2>Payment Statistics</h2>
            <div className="stats-grid">
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
          </div>
        )}

        {/* Transaction History */}
        <div className="transactions-section">
          <h2>Transaction History</h2>
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-ref">{transaction.transaction_ref}</span>
                  <span className="transaction-amount">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </span>
                </div>
                <div className="transaction-details">
                  <span className="payment-method">{transaction.payment_method}</span>
                  <span className={`status ${transaction.status}`}>{transaction.status}</span>
                  <span className="date">{new Date(transaction.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Withdrawal Section with Mock Data */}
        <CampaignWithdrawals
          availableFunds={mockAvailableFunds}
          withdrawalHistory={mockWithdrawalHistory}
          campaignName={mockCampaignName}
          createdBy={mockCreatedBy}
        />

      </div>
      
      <div className="campaign-notifications">
        <PaymentNotifications />
      </div>
    </div>
  );
};

export default CampaignPage; 