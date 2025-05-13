import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './fundraisingSetupGoal.css';
import Login from '../auth/Login';
import {Link} from 'react-router-dom'

const FundraisingSetupGoal = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setShowLoginModal(true);
    } else {
      navigate('/donations-4');
    }
  };

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
    setShowLoginModal(false);
    navigate('/donations-4');
  };

  const handleCloseModal = () => setShowLoginModal(false);

  return (
    <div className="goal-setup-container">
      <aside className="goal-setup-sidebar">
        <div className="goal-sidebar-content">
          <div className="goal-sidebar-icon">
            <span role="img" aria-label="goal" style={{fontSize: '2.2rem', color: '#1a7f37'}}>
            <Link to="/" className="logo">
            CrowdFundMe
          </Link>
            </span>
          </div>
          <div className="goal-sidebar-step">2 of 5</div>
          <h1 className="goal-sidebar-title">Set your<br/>starting goal</h1>
          <p className="goal-sidebar-desc">You can always change your goal as you go.</p>
        </div>
      </aside>
      <main className="goal-setup-main">
        <form className="goal-form">
          <div className="goal-input-group">
            <label htmlFor="goal-amount" className="goal-input-label">Your starting goal</label>
            <div className="goal-input-wrapper">
              <span className="goal-currency">£</span>
              <input id="goal-amount" className="goal-input" type="text" value="4,000" readOnly />
              <span className="goal-currency-btn">GBP</span>
            </div>
          </div>
          <div className="goal-suggestion-box">
            <div className="goal-suggestion-title">
              Fundraisers like yours typically aim to raise <b>£12,000 or more.</b>
            </div>
            <hr className="goal-suggestion-divider" />
            <div className="goal-suggestion-detail">
              <span className="goal-suggestion-icon" role="img" aria-label="info">
              
              </span>
              <span>Based on goals for similar fundraisers</span>
            </div>
          </div>
          <div className="goal-form-actions">
            <button type="button" className="goal-back-btn">
              <span className="goal-back-arrow">&#8592;</span>
            </button>
            <button type="submit" className="goal-continue-btn" onClick={handleContinue}>Continue</button>
          </div>
        </form>
      </main>
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>&times;</button>
            {/* Pass sign-in success handler to Login for demo */}
            <Login onSignInSuccess={handleSignInSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraisingSetupGoal; 