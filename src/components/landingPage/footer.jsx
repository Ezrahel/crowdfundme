

const Footer = () => {
  return (
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
  )
}

export default Footer