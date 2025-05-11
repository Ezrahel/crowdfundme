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

const FundraisingSetup = () => {
  const [formData, setFormData] = useState({
    country: '',
    postcode: '',
    category: ''
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { country, postcode, category } = formData;
    setIsValid(country && postcode && category);
  }, [formData]);

  const handleCountryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      country: e.target.value
    }));
  };

  const handlePostcodeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      postcode: e.target.value
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
  };

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
          <section className="location-section">
            <h2>Where will the funds go?</h2>
            <p>
              Choose the location where you plan to withdraw your funds.{' '}
              <Link to="/supported-countries" className="support-link">
                Countries we support fundraisers in.
              </Link>
            </p>

            <div className="location-inputs">
              <div className="select-wrapper">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-wrapper">
                <label htmlFor="postcode">Postcode</label>
                <input
                  type="text"
                  id="postcode"
                  value={formData.postcode}
                  onChange={handlePostcodeChange}
                  placeholder="Postcode"
                  required
                />
              </div>
            </div>
          </section>

          <section className="category-section">
            <h2>What best describes why you're fundraising?</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-button ${formData.category === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </section>

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

export default FundraisingSetup; 