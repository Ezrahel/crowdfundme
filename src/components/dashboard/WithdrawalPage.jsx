import React, { useState } from 'react';
import './WithdrawalPage.css';
import { FaUniversity, FaPaypal, FaExchangeAlt, FaWallet } from 'react-icons/fa';

const mockWallet = {
  balance: 1200.50,
  currency: 'GBP',
};

const mockHistory = [
  { id: 1, date: '2024-06-01', amount: 200, method: 'Bank', status: 'Completed' },
  { id: 2, date: '2024-05-20', amount: 100, method: 'PayPal', status: 'Completed' },
  { id: 3, date: '2024-05-10', amount: 50, method: 'Wire', status: 'Pending' },
];

const WithdrawalPage = () => {
  const [method, setMethod] = useState('Bank');
  const [form, setForm] = useState({
    bankAccount: '',
    bankName: '',
    paypalEmail: '',
    wireIban: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMethod = (m) => {
    setMethod(m);
    setForm({ bankAccount: '', bankName: '', paypalEmail: '', wireIban: '', amount: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call here
    alert('Withdrawal request submitted!');
  };

  return (
    <div className="withdrawal-container">
      <div className="withdrawal-header">
        <h1>Withdraw Funds</h1>
        <div className="wallet-balance-box">
          <FaWallet className="wallet-icon" />
          <span>Wallet Balance: <b>{mockWallet.currency} {mockWallet.balance.toLocaleString()}</b></span>
        </div>
      </div>
      <div className="withdrawal-methods">
        <button className={`method-btn${method === 'Bank' ? ' active' : ''}`} onClick={() => handleMethod('Bank')}><FaUniversity /> Bank Account</button>
        <button className={`method-btn${method === 'PayPal' ? ' active' : ''}`} onClick={() => handleMethod('PayPal')}><FaPaypal /> PayPal</button>
        <button className={`method-btn${method === 'Wire' ? ' active' : ''}`} onClick={() => handleMethod('Wire')}><FaExchangeAlt /> Wire Transfer</button>
      </div>
      <form className="withdrawal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} min="1" max={mockWallet.balance} required placeholder="Enter amount" />
        </div>
        {method === 'Bank' && (
          <>
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" name="bankName" value={form.bankName} onChange={handleChange} required placeholder="E.g. Barclays, Chase" />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input type="text" name="bankAccount" value={form.bankAccount} onChange={handleChange} required placeholder="Account Number" />
            </div>
          </>
        )}
        {method === 'PayPal' && (
          <div className="form-group">
            <label>PayPal Email</label>
            <input type="email" name="paypalEmail" value={form.paypalEmail} onChange={handleChange} required placeholder="PayPal Email" />
          </div>
        )}
        {method === 'Wire' && (
          <div className="form-group">
            <label>IBAN / Account Number</label>
            <input type="text" name="wireIban" value={form.wireIban} onChange={handleChange} required placeholder="IBAN or Account Number" />
          </div>
        )}
        <button type="submit" className="withdraw-btn">Request Withdrawal</button>
      </form>
      <div className="withdrawal-info-box">
        <h3>Withdrawal Policy</h3>
        <ul>
          <li>Withdrawals are processed within 1-3 business days.</li>
          <li>Minimum withdrawal amount: £10.</li>
          <li>Ensure your payment details are correct to avoid delays.</li>
          <li>Contact support for any issues with your withdrawals.</li>
        </ul>
      </div>
      <div className="withdrawal-history">
        <h3>Withdrawal History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{mockWallet.currency} {item.amount}</td>
                <td>{item.method}</td>
                <td className={item.status === 'Completed' ? 'status-completed' : 'status-pending'}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalPage; 