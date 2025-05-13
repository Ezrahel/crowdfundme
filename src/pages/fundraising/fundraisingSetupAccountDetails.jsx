import React from 'react';
import './fundraisingSetupAccountDetails.css';
import {Link} from 'react-router-dom'

const FundraisingSetupAccountDetails = () => {
  return (
    <div className="account-setup-container">
      <aside className="account-setup-sidebar">
        <div className="account-sidebar-content">
        <Link to="/" className="logo">
            CrowdFundMe
          </Link>
          <div className="account-sidebar-step">4 of 5</div>
          <h1 className="account-sidebar-title">Where should we send your funds?</h1>
          <p className="account-sidebar-desc">Enter your bank account details to receive donations securely.</p>
        </div>
      </aside>
      <main className="account-setup-main">
        <form className="account-form">
          <div className="account-input-group">
            <label htmlFor="account-holder" className="account-input-label">Account holder name</label>
            <input id="account-holder" className="account-input" type="text" placeholder="Full name as on bank account" />
          </div>
          <div className="account-input-group">
            <label htmlFor="bank-name" className="account-input-label">Bank name</label>
            <input id="bank-name" className="account-input" type="text" placeholder="E.g. Barclays, Chase, GTBank" />
          </div>
          <div className="account-input-group">
            <label htmlFor="account-number" className="account-input-label">Account number</label>
            <input id="account-number" className="account-input" type="text" placeholder="Enter account number" />
          </div>
          <div className="account-input-group">
            <label htmlFor="confirm-account-number" className="account-input-label">Confirm account number</label>
            <input id="confirm-account-number" className="account-input" type="text" placeholder="Re-enter account number" />
          </div>
          <div className="account-input-group">
            <label htmlFor="account-type" className="account-input-label">Account type</label>
            <select id="account-type" className="account-input">
              <option value="">Select type</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="account-info-box">
            <h3>Donation payout info</h3>
            <ul>
              <li>Funds are sent directly to your verified bank account.</li>
              <li>Ensure your account details are correct to avoid payout delays.</li>
              <li>For security, only accounts in your name are accepted.</li>
              <li>Withdrawals may take 1-3 business days after approval.</li>
            </ul>
          </div>
          <div className="account-form-actions">
            <button type="submit" className="account-continue-btn">Continue</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FundraisingSetupAccountDetails; 