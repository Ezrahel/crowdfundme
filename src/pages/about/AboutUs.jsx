import React from 'react';
import './AboutUs.css';
import { FaHandshake, FaGlobe, FaLock, FaUsers, FaChartLine, FaLightbulb, FaHeart } from 'react-icons/fa';

const team = [
  { name: 'Jane Doe', role: 'Founder & CEO', quote: 'Every dream deserves a chance.', img: '' },
  { name: 'John Smith', role: 'CTO', quote: 'Innovation drives impact.', img: '' },
  { name: 'Maria Lee', role: 'Community Lead', quote: 'Together, we build hope.', img: '' },
  { name: 'Ahmed Khan', role: 'Head of Support', quote: 'Your success is our mission.', img: '' },
];

const stories = [
  { img: '', title: 'Hope for Sarah', desc: 'Raised £10,000 for medical treatment.', impact: 'Enabled life-saving surgery.' },
  { img: '', title: 'Clean Water for All', desc: 'Funded a well in Kenya.', impact: 'Provided clean water to 500+ people.' },
  { img: '', title: 'School Supplies Drive', desc: 'Supplied 300+ kids with books.', impact: 'Boosted education in rural areas.' },
];

const AboutUs = () => (
  <div className="aboutus-container">
    {/* Hero Section */}
    <section className="aboutus-hero">
      <div className="aboutus-hero-bg">
        {/* Replace with real image/video */}
        <div className="aboutus-hero-overlay" />
      </div>
      <div className="aboutus-hero-content">
        <h1>Empowering Dreams, One Contribution at a Time.</h1>
        <p className="aboutus-hero-sub">We connect people, stories, and resources to make a real difference.</p>
        <button className="aboutus-cta-btn">Start Funding</button>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="aboutus-mission-grid">
      <div className="aboutus-mission-text">
        <h2>Our Mission & Vision</h2>
        <p>
          At CrowdFundMe, our mission is to empower individuals and communities to achieve their dreams through transparent, impactful, and innovative crowdfunding. We envision a world where everyone has the opportunity to make a difference, no matter where they are.
        </p>
        {/* Optional: Video */}
        <div className="aboutus-mission-video">[Team Video Placeholder]</div>
      </div>
      <div className="aboutus-mission-icons">
        <div className="aboutus-icon-card"><FaLock /><span>Transparency</span></div>
        <div className="aboutus-icon-card"><FaChartLine /><span>Impact</span></div>
        <div className="aboutus-icon-card"><FaLightbulb /><span>Innovation</span></div>
      </div>
    </section>

    {/* How It Works */}
    <section className="aboutus-how-grid">
      <h2>How It Works</h2>
      <div className="aboutus-how-cards">
        <div className="aboutus-how-card">
          <FaUsers className="aboutus-how-icon" />
          <h3>Create a Campaign</h3>
          <p>Start raising funds easily for your cause or project.</p>
        </div>
        <div className="aboutus-how-card">
          <FaHeart className="aboutus-how-icon" />
          <h3>Share Your Story</h3>
          <p>Engage donors and amplify your reach with your unique story.</p>
        </div>
        <div className="aboutus-how-card">
          <FaHandshake className="aboutus-how-icon" />
          <h3>Receive Support</h3>
          <p>Funds go directly to your cause, quickly and securely.</p>
        </div>
      </div>
    </section>

    {/* Success Stories */}
    <section className="aboutus-stories">
      <h2>Success Stories</h2>
      <div className="aboutus-stories-grid">
        {stories.map((s, i) => (
          <div className="aboutus-story-card" key={i}>
            <div className="aboutus-story-img">[Image]</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="aboutus-story-impact">{s.impact}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="aboutus-why-grid">
      <h2>Why Choose Us?</h2>
      <div className="aboutus-why-cards">
        <div className="aboutus-why-card"><FaLock /><span>Secure Transactions</span></div>
        <div className="aboutus-why-card"><FaGlobe /><span>Global Reach</span></div>
        <div className="aboutus-why-card"><FaChartLine /><span>Low Fees</span></div>
        <div className="aboutus-why-card"><FaUsers /><span>Strong Community Support</span></div>
      </div>
    </section>

    {/* Meet the Team */}
    <section className="aboutus-team">
      <h2>Meet the Team</h2>
      <div className="aboutus-team-grid">
        {team.map((member, i) => (
          <div className="aboutus-team-card" key={i}>
            <div className="aboutus-team-img">[Photo]</div>
            <div className="aboutus-team-info">
              <h3>{member.name}</h3>
              <p className="aboutus-team-role">{member.role}</p>
              <p className="aboutus-team-quote">“{member.quote}”</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Join Us CTA */}
    <section className="aboutus-join">
      <h2>Ready to Make a Difference?</h2>
      <p>Join our community of changemakers. Start a campaign or support a cause today!</p>
      <button className="aboutus-cta-btn">Join the Movement</button>
    </section>
  </div>
);

export default AboutUs; 