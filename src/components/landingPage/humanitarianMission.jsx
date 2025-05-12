
const statDetails = [
  { 
    count: '22,690',
    info: 'Donations have been verified and still active.'
  },
  { 
    count: '10,517',
    info: 'donations have been distributed to the needy.'
  },
  { 
    count: '6,450',
    info: 'donations were distributed to social foundations and orphanages.'
  },
  { 
    count: '5,058',
    info: 'total funds raised so far.'
  },
  { 
    count: '1.4 Billion',
    info: 'donations have been distributed to people in emergency situations.'
  },
  { 
    count: '4,803',
    info: 'Donations have been verified and still active.'
  }
]

const HumanitarianMission = () => {

  const statItems = () => {
    return statDetails.map((detail, index) => (
      <div key={index} className="stat-item">
        <span className="stat-number highlight">{detail.count}</span>
        <p className="stat-description">{detail.info}</p>
      </div>
    ))
  }

  return (
    <section className="humanitarian-mission">
      <div className="mission-container">
        <div className="mission-content">
          <span className="mission-label">HUMANITARIAN MISSION</span>
          <h2 className="mission-title">
            Help the Affected by<br />
            <span className="highlight">Disasters, Shortages</span>, and<br />
            <span className="highlight">Emergency Relief</span>.
          </h2>

          <div className="statistics-grid">
            {statItems()}
          </div>
        </div>

        <div className="mission-image-container">
          <div className="circular-image">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c" alt="Humanitarian aid workers" />
            <div className="decorative-circle"></div>
            <div className="decorative-dots">
              <span className="dot dot-1"></span>
              <span className="dot dot-2"></span>
              <span className="dot dot-3"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HumanitarianMission