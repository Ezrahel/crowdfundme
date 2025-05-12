import React, { useState } from 'react';
import './fundraisingSetupReviewPublish.css';

const mockData = {
  whoFor: 'Yourself',
  goal: '£4,000',
  title: 'Help John recover from surgery',
  desc: "Supporting John's medical expenses",
  story: 'John needs urgent surgery and your support can make a difference.',
  duration: 30,
  coverImage: '',
  account: {
    holder: 'John Doe',
    bank: 'Barclays',
    number: '12345678',
    type: 'Savings',
  },
  campaignLink: '/campaign/israel/12345',
};

const FundraisingSetupReviewPublish = () => {
  const [published, setPublished] = useState(false);
  const data = mockData;

  if (published) {
    return (
      <div className="review-setup-container">
        <aside className="review-setup-sidebar">
          <div className="review-sidebar-content">
            <div className="review-sidebar-step">Complete</div>
            <h1 className="review-sidebar-title">Campaign Published!</h1>
            <p className="review-sidebar-desc">Your fundraiser is now live. Here's what to do next:</p>
          </div>
        </aside>
        <main className="review-setup-main">
          <div className="review-confirm-card">
            <h2>Congratulations!</h2>
            <p>Your campaign <b>{data.title}</b> is now live.</p>
            <div className="review-campaign-link">
              <span>Campaign Link:</span>
              <a href={data.campaignLink} target="_blank" rel="noopener noreferrer">{window.location.origin + data.campaignLink}</a>
            </div>
            <ul className="review-next-steps">
              <li>Share your campaign link with friends, family, and on social media.</li>
              <li>Thank your donors and keep them updated with progress.</li>
              <li>Monitor your donations and respond to supporter messages.</li>
              <li>Request withdrawals as funds come in.</li>
            </ul>
            <button className="review-dashboard-btn" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="review-setup-container">
      <aside className="review-setup-sidebar">
        <div className="review-sidebar-content">
          <div className="review-sidebar-step">5 of 5</div>
          <h1 className="review-sidebar-title">Review & Publish</h1>
          <p className="review-sidebar-desc">Check your campaign details before going live. You can edit any section.</p>
        </div>
      </aside>
      <main className="review-setup-main">
        <div className="review-summary-card">
          <div className="review-section">
            <h3>Who are you fundraising for?</h3>
            <div className="review-value">{data.whoFor}</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Goal</h3>
            <div className="review-value">{data.goal}</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Fundraiser title</h3>
            <div className="review-value">{data.title}</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Short description</h3>
            <div className="review-value">{data.desc}</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Your story</h3>
            <div className="review-value review-story">{data.story}</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Campaign duration</h3>
            <div className="review-value">{data.duration} days</div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Cover image</h3>
            <div className="review-value">
              {data.coverImage ? (
                <img src={data.coverImage} alt="Cover" className="review-cover-img" />
              ) : (
                <span>No image uploaded</span>
              )}
            </div>
            <button className="review-edit-btn">Edit</button>
          </div>
          <div className="review-section">
            <h3>Account details</h3>
            <div className="review-value">
              <div><b>Holder:</b> {data.account.holder}</div>
              <div><b>Bank:</b> {data.account.bank}</div>
              <div><b>Account #:</b> {data.account.number}</div>
              <div><b>Type:</b> {data.account.type}</div>
            </div>
            <button className="review-edit-btn">Edit</button>
          </div>
        </div>
        <div className="review-publish-actions">
          <button className="review-publish-btn" onClick={() => setPublished(true)}>Publish Campaign</button>
        </div>
      </main>
    </div>
  );
};

export default FundraisingSetupReviewPublish; 