import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, SignOutButton, ClerkProvider } from '@clerk/clerk-react';
import './UserDashboard.css';
import { FaBell, FaWallet, FaArrowDown, FaArrowUp, FaRocket, FaPlus, FaMoneyCheckAlt, FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const mockNotifications = [
  { id: 1, text: 'Your fundraiser "Help John" received a new donation!', read: false },
  { id: 2, text: 'Withdrawal request processed.', read: false },
  { id: 3, text: 'Your campaign was published successfully.', read: true },
];

const mockWallet = {
  balance: 1200.50,
  currency: 'GBP',
  lastWithdrawal: 200.00,
  pending: 100.00,
};

const mockFeeds = [
  { id: 1, donor: 'Alice', amount: 50, message: 'Wishing you a speedy recovery!', time: '2h ago' },
  { id: 2, donor: 'Bob', amount: 100, message: 'Stay strong!', time: '5h ago' },
  { id: 3, donor: 'Anonymous', amount: 20, message: '', time: '1d ago' },
];

const mockMetrics = {
  totalRaised: 4000,
  totalDonors: 120,
  totalWithdrawn: 2000,
  activeCampaigns: 2,
};

const setupSteps = [
  'Who for',
  'Goal',
  'Story',
  'Account',
  'Review',
];
const currentStep = 3;

const motivationalQuotes = [
  "Every act of kindness grows the spirit and strengthens the soul.",
  "Your campaign can change lives. Keep going!",
  "Small steps lead to big impact.",
  "Together, we make dreams possible.",
];

const UserDashboard = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <>
      <SignedOut>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-title">User Dashboard</div>
            <div className="dashboard-icons">
              <SignInButton mode="modal" />
            </div>
          </div>
          <div className="dashboard-main">
            <p style={{textAlign: 'center', marginTop: '40px', fontSize: '1.2rem'}}>Forbidden Page</p>
          </div>
          <div className="dashboard-main">
            <p style={{textAlign: 'center', marginTop: '40px', fontSize: '1.2rem'}}>Please sign in to access your dashboard.</p>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="dashboard-title">User Dashboard</div>
            <div className="dashboard-icons">
              <div className="notification-icon-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
                <FaBell className="notification-icon" />
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                {showNotifications && (
                  <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notification-item${n.read ? ' read' : ''}`}>{n.text}</div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <button className="signout-btn">Sign Out</button>
              </SignOutButton>
            </div>
          </header>
          {/* Progress Indicator */}
          <div className="dashboard-progress-bar">
            <div className="progress-labels">
              {setupSteps.map((step, idx) => (
                <div key={step} className={`progress-label${idx + 1 === currentStep ? ' active' : ''}`}>{step}</div>
              ))}
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(currentStep - 1) / (setupSteps.length - 1) * 100}%` }}
              />
            </div>
            <div className="progress-step-text">Step {currentStep} of {setupSteps.length}</div>
          </div>
          <main className="dashboard-main">
            <section className="dashboard-welcome">
              <h2>Welcome back{user && user.firstName ? `, ${user.firstName}` : ''}!</h2>
              <div className="dashboard-quote">
                <FaRocket className="quote-icon" /> {quote}
              </div>
            </section>
            <section className="dashboard-quick-actions">
              <button className="quick-action-btn" onClick={() => navigate('/donations-2')}><FaPlus /> Start New Campaign</button>
              <button className="quick-action-btn" onClick={() => navigate('/withdrawal')}><FaMoneyCheckAlt /> Withdraw Funds</button>
              <button className="quick-action-btn" onClick={() => navigate('/dashboard')}><FaTrophy /> View Achievements</button>
            </section>
            <section className="dashboard-wallet">
              <div className="wallet-header">
                <FaWallet className="wallet-icon" />
                <span>Wallet Balance</span>
              </div>
              <div className="wallet-balance">{mockWallet.currency} {mockWallet.balance.toLocaleString()}</div>
              <div className="wallet-meta">
                <span>Last withdrawal: {mockWallet.currency} {mockWallet.lastWithdrawal}</span>
                <span>Pending: {mockWallet.currency} {mockWallet.pending}</span>
              </div>
            </section>
            <section className="dashboard-metrics">
              <div className="metric-card">
                <FaArrowUp className="metric-icon up" />
                <div className="metric-value">{mockMetrics.totalRaised.toLocaleString()}</div>
                <div className="metric-label">Total Raised</div>
              </div>
              <div className="metric-card">
                <FaArrowUp className="metric-icon up" />
                <div className="metric-value">{mockMetrics.totalDonors}</div>
                <div className="metric-label">Total Donors</div>
              </div>
              <div className="metric-card">
                <FaArrowDown className="metric-icon down" />
                <div className="metric-value">{mockMetrics.totalWithdrawn.toLocaleString()}</div>
                <div className="metric-label">Total Withdrawn</div>
              </div>
              <div className="metric-card">
                <FaWallet className="metric-icon" />
                <div className="metric-value">{mockMetrics.activeCampaigns}</div>
                <div className="metric-label">Active Campaigns</div>
              </div>
            </section>
            <section className="dashboard-achievements">
              <h2>Your Achievements</h2>
              <div className="achievements-list">
                <div className="achievement-card"><FaTrophy className="achieve-icon" /> 100+ Donors Supported</div>
                <div className="achievement-card"><FaTrophy className="achieve-icon" /> £4,000+ Raised</div>
                <div className="achievement-card"><FaTrophy className="achieve-icon" /> 2 Active Campaigns</div>
              </div>
            </section>
            <section className="dashboard-feeds">
              <h2>Donation Feeds</h2>
              <div className="feeds-list">
                {mockFeeds.map(feed => (
                  <div key={feed.id} className="feed-item">
                    <div className="feed-donor">{feed.donor}</div>
                    <div className="feed-amount">+£{feed.amount}</div>
                    <div className="feed-message">{feed.message}</div>
                    <div className="feed-time">{feed.time}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="dashboard-about">
              <h2>About Us</h2>
              <p>
                CrowdFundMe is a modern crowdfunding platform dedicated to helping people raise funds for personal, community, and charitable causes. We believe in transparency, speed, and security for all our users.
              </p>
            </section>
            <section className="dashboard-policy">
              <h2>Withdrawal Policy</h2>
              <ul>
                <li>Withdrawals are processed within 1-3 business days.</li>
                <li>Ensure your bank details are correct to avoid delays.</li>
                <li>Minimum withdrawal amount: £10.</li>
                <li>Contact support for any issues with your withdrawals.</li>
              </ul>
            </section>
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default UserDashboard; 