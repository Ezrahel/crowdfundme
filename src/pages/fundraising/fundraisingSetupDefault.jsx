import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FundraisingSetup.css';
import { IoIosArrowRoundBack } from "react-icons/io";
const categories = [
  { id: 'animals', label: 'Animals' },
  { id: 'business', label: 'Business' },
  { id: 'community', label: 'Community' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'creative', label: 'Creative' },
  { id: 'education', label: 'Education' },
  { id: 'emergencies', label: 'Emergencies' },
  { id: 'environment', label: 'Environment' },
  { id: 'events', label: 'Events' },
  { id: 'faith', label: 'Faith' },
  { id: 'family', label: 'Family' },
  { id: 'funerals', label: 'Funerals & Memorials' },
  { id: 'medical', label: 'Medical' },
  { id: 'monthly-bills', label: 'Monthly Bills' },
  { id: 'newlyweds', label: 'Newlyweds' },
  { id: 'other', label: 'Other' },
  { id: 'sports', label: 'Sports' },
  { id: 'travel', label: 'Travel' },
  { id: 'ukraine', label: 'Ukraine Relief' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'wishes', label: 'Wishes' }
];

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
            <h1>Let's begin your fundraising <br/> journey</h1>
            <p>We're here to guide you every step <br/>of the way.</p>
          </div>
        </div>
      </aside>

      <main className="setup-main">
        <div className="setup-form">
          

          <div className="setup-actions">
            <button className="back-btn" style={{marginRight:'70%', paddingRight:20, paddingLeft:20, borderRadius:5, border:'none'}} >
            <IoIosArrowRoundBack style={{fontSize:30}} />
            </button>
            <button
              className={`continue-button ${!isValid ? 'disabled' : ''}`}
              disabled={!isValid}
              onClick={() => {/* Handle continue */}}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DefaultFundRaiseSetup; 