import { useEffect, useState } from 'react'
import { IoIosCall } from "react-icons/io";
import { BsList, BsX } from "react-icons/bs";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="navbar">
      {/* Check https://github.com/Maloney18/Responsive-web-design/blob/main/src/components/navbar.css for reference on how to make the mobile view more responsive */}

      {/* Hint: commot the 'CrowdFundMe' from 'navbar::before', put am as normal p tag or span tag for here con style am*/}
      
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
  )
}

export default Navbar