import FAQ from "./faq"
const OpenDataSection=()=>{
    return (
        <section className="open-data-section">
        <div className="open-data-container">
          <div className="data-visualization">
            <div className="kitabangun-card">
              <div className="card-header">
                <div className="brand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#13ADB7">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  <span>CrowdFundMe</span>
                </div>
                <div className="menu-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </div>
              </div>
              
              <div className="donation-thumbnails">
                <div className="thumbnail">
                  <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d" alt="Help Build a School" />
                  <p>Help Build a School</p>
                </div>
                <div className="thumbnail">
                  <img src="https://images.unsplash.com/photo-1548576304-09943603087b" alt="Help Clean Water for Africa" />
                  <p>Help Clean Water for Africa</p>
                </div>
                <div className="thumbnail">
                  <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6" alt="Help Arumbe Village" />
                  <p>Help Arumbe Village</p>
                </div>
              </div>

              <div className="data-chart">
                <h3>Open Data</h3>
                <div className="data-bars">
                  <div className="bar-item">
                    <div className="color-box pink">
                      <div className="white-overlay"></div>
                    </div>
                  </div>
                  <div className="bar-item">
                    <div className="color-box green">
                      <div className="white-overlay"></div>
                    </div>
                  </div>
                  <div className="bar-item">
                    <div className="color-box blue">
                      <div className="white-overlay"></div>
                    </div>
                  </div>
                </div>
                <div className="chart-container">
                  <svg className="chart" viewBox="0 0 300 100">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#13ADB7" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#13ADB7" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Background area with gradient */}
                    <path
                      d="M0,75 C50,65 100,85 150,55 C200,25 250,45 300,15 L300,100 L0,100 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Main line */}
                    <path
                      d="M0,75 C50,65 100,85 150,55 C200,25 250,45 300,15"
                      fill="none"
                      stroke="#13ADB7"
                      strokeWidth="2"
                    />
                    {/* Data points */}
                    <circle cx="0" cy="75" r="4" fill="white" stroke="#13ADB7" strokeWidth="2"/>
                    <circle cx="150" cy="55" r="4" fill="white" stroke="#13ADB7" strokeWidth="2"/>
                    <circle cx="300" cy="15" r="4" fill="white" stroke="#13ADB7" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="donation-count">
                  <span>Donation</span>
                  <span className="count">+ 618</span>
                </div>
              </div>
            </div>
          </div>

          <FAQ />
          
        </div>
      </section>
    )
}

export default OpenDataSection;