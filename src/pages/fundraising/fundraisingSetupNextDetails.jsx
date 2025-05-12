import React, { useState } from 'react';
import './fundraisingSetupNextDetails.css';

const getRecommendation = (days) => {
  if (days <= 20) return 'Short campaigns (1-20 days) are best for urgent needs or quick events.';
  if (days <= 40) return 'Medium campaigns (21-40 days) are optimal for most personal and community fundraisers.';
  if (days <= 60) return 'Longer campaigns (41-60 days) work well for large projects or ongoing needs.';
  return 'Maximum duration (61-80 days) is best for big projects or when you need more time to reach your goal.';
};

const FundraisingSetupNextDetails = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [duration, setDuration] = useState(30);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
  };

  return (
    <div className="details-setup-container">
      <aside className="details-setup-sidebar">
        <div className="details-sidebar-content">
          <div className="details-sidebar-step">3 of 5</div>
          <h1 className="details-sidebar-title">Tell your story</h1>
          <p className="details-sidebar-desc">Share what you're raising funds for and why it matters.</p>
        </div>
      </aside>
      <main className="details-setup-main">
        <form className="details-form">
          <div className="details-input-group">
            <label htmlFor="fundraiser-title" className="details-input-label">Fundraiser title</label>
            <input id="fundraiser-title" className="details-input" type="text" placeholder="E.g. Help John recover from surgery" />
          </div>
          <div className="details-input-group">
            <label htmlFor="fundraiser-desc" className="details-input-label">Short description</label>
            <input id="fundraiser-desc" className="details-input" type="text" placeholder="E.g. Supporting John's medical expenses" />
          </div>
          <div className="details-input-group">
            <label htmlFor="fundraiser-story" className="details-input-label">Your story</label>
            <textarea id="fundraiser-story" className="details-textarea" rows={6} placeholder="Share details about your fundraiser..." />
          </div>

          {/* Campaign Duration Section */}
          <div className="details-input-group">
            <label htmlFor="campaign-duration" className="details-input-label">Campaign duration</label>
            <div className="duration-bar-container">
              <input
                type="range"
                id="campaign-duration"
                min="1"
                max="80"
                value={duration}
                onChange={handleDurationChange}
                className="duration-range"
              />
              <div className="duration-bar-labels">
                <span>1 day</span>
                <span>{duration} days</span>
                <span>80 days</span>
              </div>
              <div className="duration-recommendation">{getRecommendation(duration)}</div>
            </div>
          </div>

          <div className="details-input-group">
            <label className="details-input-label">Add a cover image</label>
            <div className="details-image-upload-area">
              <input type="file" accept="image/*" id="cover-upload" style={{ display: 'none' }} onChange={handleImageChange} />
              <label htmlFor="cover-upload" className="details-image-upload-label">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover Preview" className="details-image-preview" />
                ) : (
                  <span>Click to upload or drag an image here</span>
                )}
              </label>
            </div>
          </div>
          <div className="details-form-actions">
            <button type="submit" className="details-continue-btn">Continue</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FundraisingSetupNextDetails; 