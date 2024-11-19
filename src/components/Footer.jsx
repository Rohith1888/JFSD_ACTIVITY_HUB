import React from 'react';
import { Link } from 'react-router-dom';
import '../components/css/footer.css'; // Make sure to create a CSS file for styles
import logo from '../Assets/images/logo_footer.png'; // Adjust the path to your logo file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
          <p>&copy; 2024 Activity Hub™</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Help</h4>
            <ul>
              <li><Link to="signin/">Login/Register</Link></li>
              <li><Link to="#">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/clubs">Clubs</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-icons">
          <Link to="https://x.com/" target='_blank' aria-label="Twitter"><i className="fab fa-twitter"></i></Link>
          <Link to="https://www.facebook.com/" target='_blank' aria-label="Facebook"><i className="fab fa-facebook"></i></Link>
          <Link to="https://www.instagram.com/rohith_gopisetty/"target='_blank' aria-label="Instagram"><i className="fab fa-instagram"></i></Link>
          <Link to="https://github.com/Rohith1888"target='_blank' aria-label="GitHub"><i className="fab fa-github"></i></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;