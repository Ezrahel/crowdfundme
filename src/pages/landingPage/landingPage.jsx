import {useState, useEffect} from 'react'
import crowd from '../../assets/img/help.png'
import { BsArrowUp, BsSun, BsMoon } from "react-icons/bs";
import Footer from '../../components/landingPage/footer';
import HeroSection from '../../components/landingPage/heroSection';
import Donations from '../../components/landingPage/donations';
import FAQ from '../../components/landingPage/faq';
import HumanitarianMission from '../../components/landingPage/humanitarianMission';

const LandingPage = () => {;
  const [showBackToTop, setShowBackToTop] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    

    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <BsMoon /> : <BsSun />}
      </button>

      <HeroSection />
      
      <Donations />
      
      {/* This section no big, so e fit still dey here, but u fit turn am to component if u want*/}
      <section className="platform-intro">
        <div className="intro-content">
          <span className="subtitle">MODERN CROWDFUNDING PLATFORM</span>
          <h1 className="main-title">
            Distribute aid <span className="highlight">easily</span>, <span className="highlight">quickly</span>, and <br/>
            <span className="highlight">transparently</span>.
          </h1>
        </div>
      </section>

      {/* I no really understand this part too much, na why i only touch the FAQ part */}
      
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

                {/* This image is invalid, test the url to understand better */}
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
      
      <HumanitarianMission />
      
      {/* If you look the way I dey create those components, u suppose fit turn this section into one component */}
      <section className="partners-section">
        <div className="partners-container">
          <span className="section-label">OUR PARTNERS</span>
          <h2 className="partners-title">
            More than 50 <span className="highlight">Companies</span> and <span className="highlight">Institutions</span> that trust us over the years
          </h2>

          <div className="partners-grid">
            <a href="#" className="partner-card">
              <img src="/partners/microsoft.svg" alt="Microsoft" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/save-the-children.svg" alt="Save the Children" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/conservation-international.svg" alt="Conservation International" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/unicef.svg" alt="UNICEF" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/river-island.svg" alt="River Island" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/hello-wallet.svg" alt="HelloWallet" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/american-red-cross.svg" alt="American Red Cross" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/palang-merah.svg" alt="Palang Merah Indonesia" />
            </a>
            <a href="#" className="more-partners">
              <span>and 42 mores</span>
            </a>
          </div>
        </div>
      </section>
      
      {/* This section seff no too big, u fit turn am to one component if u want */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <h3>CALL CENTER</h3>
              <p className="contact-value">(+234) 9012345678</p>
            </div>
            <div className="contact-item">
              <h3>EMAIL</h3>
              <p className="contact-value">contact@crowdfundme.com</p>
            </div>
          </div>
          <div className="contact-image">
            <img src={crowd} alt="Caring hands" style={{color:'white'}} />
          </div>
        </div>
      </section> 
      
      <Footer />

      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <BsArrowUp />
        </button>
      )}
      
    </>
  );
};

export default LandingPage