import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FundraisingSetup.css';
import others from '../../assets/img/others.png'
import { IoIosArrowRoundBack } from "react-icons/io";
import './fundraisingSetup2.css'


const countries = [
  { id: 'uk', label: 'United Kingdom' },
  
];

const DefaultFundRaiseSetup = () => {

  return (
    <div className="fundraising-setup">
      <aside className="setup-sidebar">
        <div className="sidebar-content">
          <Link to="/" className="logo">
            CrowdFundMe
          </Link>
          <div className="setup-intro">
            <h3>1 of 5</h3>
            <h1>Tell us who you're <br/>raising funds for</h1>
            <p>This information helps us get to know you <br/>and your fundraising needs.</p>
          </div>
        </div>
      </aside>

      <main className="setup-main">
        <div className="setup-form">
          <div className="fundraising-options">
            <div className="fundraising-option selected" tabIndex={0}>
              <div className="option-icon">
                <span role="img" aria-label="Yourself">🌼✋</span>
              </div>
              <div className="option-content">
                <h2>Yourself</h2>
                <p>Funds are delivered to your bank account for your own use</p>
              </div>
            </div>
            <div className="fundraising-option" tabIndex={0}>
              <div className="option-icon">
                <span role="img" aria-label="Someone else">👥❤️</span>
              </div>
              <div className="option-content">
                <h2>Someone else</h2>
                <p>You'll invite a beneficiary to receive funds or distribute them yourself</p>
              </div>
            </div>
            <div className="fundraising-option" tabIndex={0}>
              <div className="option-icon">
                <span role="img" aria-label="Charity">🎗️</span>
              </div>
              <div className="option-content">
                <h2>Charity</h2>
                <p>Funds are delivered to your chosen nonprofit for you</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DefaultFundRaiseSetup; 