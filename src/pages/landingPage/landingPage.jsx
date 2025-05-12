import {useState, useEffect} from 'react'
import crowd from '../../assets/img/help.png'
import { BsArrowUp, BsSun, BsMoon } from "react-icons/bs";
import Footer from '../../components/landingPage/footer';
import HeroSection from '../../components/landingPage/heroSection';
import Donations from '../../components/landingPage/donations';
import HumanitarianMission from '../../components/landingPage/humanitarianMission';
import PartnersSection from '../../components/landingPage/partnersSection';
import OpenDataSection from '../../components/landingPage/openDataSection';
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
      
      <section className="platform-intro">
        <div className="intro-content">
          <span className="subtitle">MODERN CROWDFUNDING PLATFORM</span>
          <h1 className="main-title">
            Distribute aid <span className="highlight">easily</span>, <span className="highlight">quickly</span>, and <br/>
            <span className="highlight">transparently</span>.
          </h1>
        </div>
      </section>
      
      <OpenDataSection/>
      
      <HumanitarianMission />
      
      <PartnersSection/>
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