import './App.css'
import crowd from '../src/assets/img/help.png'
import { IoIosCall, IoIosSearch } from "react-icons/io";
import { CgPlayButtonO } from "react-icons/cg";
import { BsBookmark, BsChevronDown, BsChevronUp, BsArrowUp, BsSun, BsMoon, BsList, BsX } from "react-icons/bs";
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import FundraisingSetup from './components/fundraising/FundraisingSetup';
import NextFundRaise from './components/fundraising/fundraisingSetup2';
import FundraisingSetupGoal from './components/fundraising/fundraisingSetupGoal';
import FundraisingSetupNextDetails from './components/fundraising/fundraisingSetupNextDetails';
import FundraisingSetupAccountDetails from './components/fundraising/fundraisingSetupAccountDetails';
import FundraisingSetupReviewPublish from './components/fundraising/fundraisingSetupReviewPublish';
import UserDashboard from './components/dashboard/UserDashboard';
import AboutUs from './components/about/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donations" element={<FundraisingSetup />} />
        <Route path="/donations-2" element={<NextFundRaise/>}/>
        <Route path="/donations-3" element={<FundraisingSetupGoal/>}/>
        <Route path="/donations-4" element={<FundraisingSetupNextDetails/>}/>
        <Route path="/donations-5" element={<FundraisingSetupAccountDetails/>}/>
        <Route path="/donations-6" element={<FundraisingSetupReviewPublish/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/about" element={<AboutUs/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const MainContent = () => {
  const [openQuestion, setOpenQuestion] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const hamburgerButton = document.querySelector('.mobile-menu-toggle');
      
      if (isMobileMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(event.target) && 
          !hamburgerButton?.contains(event.target)) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'unset';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <BsMoon /> : <BsSun />}
      </button>

      <section className='hero-section'>
        <nav className="navbar">
          <div className="navbar-container">
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <BsX /> : <BsList />}
            </button>

            <div className="navbar-links">
              <a href="#" className="nav-link">Home</a>
              <a href="#" className="nav-link">Charity</a>
              <a href="#" className="nav-link">Disaster</a>
              <a href="#" className="nav-link">Event</a>
            </div>

            <div className="navbar-contact">
              <a href="tel:+2349012345678" className="contact-link">
                <IoIosCall className="phone-icon" /> (+234) 9012345678
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-content">
              <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>Home</a>
              <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>Charity</a>
              <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>Disaster</a>
              <a href="#" className="mobile-nav-link" onClick={toggleMobileMenu}>Event</a>
              <a href="tel:+2349012345678" className="mobile-contact-link" onClick={toggleMobileMenu}>
                <IoIosCall className="phone-icon" /> (+234) 9012345678
              </a>
            </div>
          </div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Happiness</span> comes from <br/> 
            <span className="highlight">your action</span>.
          </h1>
          <p className="hero-subtitle">
            Be a part of the breakthrough and make someone's dream come true.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Donate Now
            </button>
            <button className="btn btn-secondary">
              <CgPlayButtonO className="play-icon" />Watch Video
            </button>
          </div>
        </div>
      </section>
      
      {/* crises and donations */}
      <section className='secondPhase'>
        <div className="topic">
          <h1>
            Open <span style={{color:'#13ADB7'}}>donations</span>
          </h1>
          <div className="search-container">
            <input type="search" className='searchCrises' placeholder='Find donations...' />
            <IoIosSearch className="search-icon" />
          </div>
          <div className="categories">
            <button className="category-btn active">All</button>
            <button className="category-btn">Disaster</button>
            <button className="category-btn">Children</button>
            <button className="category-btn">Food Crisis</button>
            <button className="category-btn">Health</button>
            <button className="category-btn">Education</button>
            <button className="category-btn">Homeless</button>
            <button className="category-btn">Animal</button>
            <button className="category-btn">Pandemic</button>
            <button className="category-btn">War Crisis</button>
          </div>

          <div className="donation-cards">
            {/* First row of cards */}
            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5" alt="Flood in Lamboa" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">230 donations</span>
                </div>
                <h2>Flood in Lamboa</h2>
                <p>Lamboa community needs your help for crisis management from 3 days of non-stop flooding.</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn">Donate now</button>
                </div>
              </div>
            </div>

            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5" alt="Tsunami in Malika" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">1,099 donations</span>
                </div>
                <h2>Tsunami in Malika</h2>
                <p>Emergency! A tsunami has just hit Malika, Tarasudi District. Help our affected brothers and sisters.</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn active">Donate now</button>
                </div>
              </div>
            </div>

            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5" alt="Help African Children" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">748 donations</span>
                </div>
                <h2>Help African Children</h2>
                <p>African children need your help to get proper food and water. Prolonged crisis is a real urgency.</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn">Donate now</button>
                </div>
              </div>
            </div>

            {/* Second row of cards */}
            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578" alt="Sianka Forest Fire" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">320 donations</span>
                </div>
                <h2>Sianka Forest Fire</h2>
                <p>The Sianka forest has caught fire and affected the surrounding community. Let's help buy their health facilities!</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn">Donate now</button>
                </div>
              </div>
            </div>

            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf" alt="Soporo Earthquake" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">769 donations</span>
                </div>
                <h2>Soporo Earthquake</h2>
                <p>A magnitude 7.3 earthquake has shaken Saporo sub-district, help them recover with food and medicine.</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn">Donate now</button>
                </div>
              </div>
            </div>

            <div className="donation-card">
              <img src="https://images.unsplash.com/photo-1504297050568-910d24c426d3" alt="Lidu Land Drought" className="card-image" />
              <div className="card-content">
                <div className="card-header">
                  <span className="date">June 27, 2021</span>
                  <span className="donation-count">748 donations</span>
                </div>
                <h2>Lidu Land Drought</h2>
                <p>The people of Tanah Lidu are currently suffering from drought, help them get clean water!</p>
                <div className="card-actions">
                  <button className="bookmark-btn">
                    <BsBookmark />
                  </button>
                  <button className="donate-btn">Donate now</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pagination">
            <button className="pagination-btn prev">
              <span className="arrow">‹</span>
            </button>
            <button className="pagination-btn">1</button>
            <button className="pagination-btn active">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">49</button>
            <button className="pagination-btn">50</button>
            <button className="pagination-btn next">
              <span className="arrow">›</span>
            </button>
            <a href="#" className="view-all">Lihat semua <span className="arrow">→</span></a>
          </div>
        </div>
      </section>
      <section className="platform-intro">
        <div className="intro-content">
          <span className="subtitle">MODERN CROWDFUNDING PLATFORM</span>
          <h1 className="main-title">
            Distribute aid <span className="highlight">easily</span>, <span className="highlight">quickly</span>, and <br/>
            <span className="highlight">transparently</span>.
          </h1>
        </div>
      </section>
      
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

          <div className="open-data-content">
            <h2>Open Data is the idea that some data should be freely available for everyone to use and republish as they see fit, without restrictions from copyright, patents, or other control mechanisms.</h2>
            <a href="#" className="read-more">Read more</a>

            <div className="faq-section">
              <h2>Frequently Asked Question</h2>
              
              <div className="faq-list">
                <div className={`faq-item ${openQuestion === 1 ? 'active' : ''}`} onClick={() => setOpenQuestion(openQuestion === 1 ? null : 1)}>
                  <div className="faq-header">
                    <h4>Is Open Data Open Source?</h4>
                    {openQuestion === 1 ? <BsChevronUp /> : <BsChevronDown />}
                  </div>
                  {openQuestion === 1 && (
                    <p>Yes, Open Data is a service with open source code for the public.</p>
                  )}
                </div>

                <div className={`faq-item ${openQuestion === 2 ? 'active' : ''}`} onClick={() => setOpenQuestion(openQuestion === 2 ? null : 2)}>
                  <div className="faq-header">
                    <h4>Why use Open Data services?</h4>
                    {openQuestion === 2 ? <BsChevronUp /> : <BsChevronDown />}
                  </div>
                  {openQuestion === 2 && (
                    <p>Open Data services provide transparent, accessible information that can be used to improve decision-making and foster innovation.</p>
                  )}
                </div>

                <div className={`faq-item ${openQuestion === 3 ? 'active' : ''}`} onClick={() => setOpenQuestion(openQuestion === 3 ? null : 3)}>
                  <div className="faq-header">
                    <h4>Can Open Data be accessed by the public?</h4>
                    {openQuestion === 3 ? <BsChevronUp /> : <BsChevronDown />}
                  </div>
                  {openQuestion === 3 && (
                    <p>Yes, Open Data is freely available to the public without any access restrictions.</p>
                  )}
                </div>

                <div className={`faq-item ${openQuestion === 4 ? 'active' : ''}`} onClick={() => setOpenQuestion(openQuestion === 4 ? null : 4)}>
                  <div className="faq-header">
                    <h4>How do I contribute to Open Data?</h4>
                    {openQuestion === 4 ? <BsChevronUp /> : <BsChevronDown />}
                  </div>
                  {openQuestion === 4 && (
                    <p>You can contribute to Open Data by sharing your datasets, providing feedback, and participating in the open data community.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
              <div className="stat-item">
                <span className="stat-number highlight">22,690</span>
                <p className="stat-description">Donations have been verified and still active.</p>
              </div>

              <div className="stat-item">
                <span className="stat-number highlight">10,517</span>
                <p className="stat-description">donations have been distributed to the needy.</p>
              </div>

              <div className="stat-item">
                <span className="stat-number highlight">6,450</span>
                <p className="stat-description">Donations have been distributed to disaster-affected areas.</p>
              </div>

              <div className="stat-item">
                <span className="stat-number highlight">5,058</span>
                <p className="stat-description">donations were distributed to social foundations and orphanages.</p>
              </div>

              <div className="stat-item">
                <span className="stat-number highlight">1.4 Billion</span>
                <p className="stat-description">total funds raised so far.</p>
              </div>

              <div className="stat-item">
                <span className="stat-number highlight">4,803</span>
                <p className="stat-description">donations have been distributed to people in emergency situations.</p>
              </div>
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
      
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>CrowdFundMe</h3>
            <p className="footer-description">
              A modern crowdfunding platform dedicated to distributing aid easily, quickly, and transparently to those in need.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Start a Campaign</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Categories</h4>
            <ul>
              <li><a href="#">Disaster Relief</a></li>
              <li><a href="#">Children's Aid</a></li>
              <li><a href="#">Education</a></li>
              <li><a href="#">Healthcare</a></li>
              <li><a href="#">Emergency Relief</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <i className="fas fa-phone"></i>
                (+234) 9012345678
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                contact@crowdfundme.com
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                123 Charity Street, Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 CrowdFundMe. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
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

export default App;
