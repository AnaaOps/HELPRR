import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg 
                className="footer-logo-icon" 
                width="40" 
                height="40" 
                viewBox="0 0 300 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* House shape with 4 colored sections */}
                <path d="M150 0L0 130V300H150V0Z" fill="#42B5F5" />
                <path d="M150 0L300 130V300H150V0Z" fill="#F7B731" />
                <path d="M150 300V150H0V300H150Z" fill="#29BB89" />
                <path d="M150 300V150H300V300H150Z" fill="#E74C3C" />
                
                {/* Top left - Cleaning bucket */}
                <path d="M95 70C97.7614 70 100 67.7614 100 65C100 62.2386 97.7614 60 95 60C92.2386 60 90 62.2386 90 65C90 67.7614 92.2386 70 95 70Z" fill="white" />
                <path d="M75 80C77.7614 80 80 77.7614 80 75C80 72.2386 77.7614 70 75 70C72.2386 70 70 72.2386 70 75C70 77.7614 72.2386 80 75 80Z" fill="white" />
                <path d="M60 100C65.5228 100 70 95.5228 70 90C70 84.4772 65.5228 80 60 80C54.4772 80 50 84.4772 50 90C50 95.5228 54.4772 100 60 100Z" fill="white" />
                <path d="M110 120C115.523 120 120 115.523 120 110C120 104.477 115.523 100 110 100C104.477 100 100 104.477 100 110C100 115.523 104.477 120 110 120Z" fill="white" />
                <path d="M50 120H120V140C120 140 110 150 85 150C60 150 50 140 50 140V120Z" fill="white" />
                
                {/* Top right - Stars */}
                <path d="M210 60L215 80L235 85L215 90L210 110L205 90L185 85L205 80L210 60Z" fill="white" />
                <path d="M250 90L255 110L275 115L255 120L250 140L245 120L225 115L245 110L250 90Z" fill="white" />
                
                {/* Bottom left - Spray bottle */}
                <path d="M70 170H100V190C100 190 85 200 85 210V240H70V210C70 200 55 190 55 190V170H70Z" fill="white" />
                <path d="M75 170V160C75 155 80 150 85 150C90 150 95 155 95 160V170H75Z" fill="white" />
                
                {/* Bottom right - Vacuum */}
                <path d="M230 220L250 180V200H230V220Z" fill="white" />
                <path d="M210 260C221.046 260 230 251.046 230 240C230 228.954 221.046 220 210 220C198.954 220 190 228.954 190 240C190 251.046 198.954 260 210 260Z" fill="white" />
              </svg>
              <span className="footer-logo-text">HELPRR</span>
            </div>
            <p className="footer-tagline">
              Your one-stop solution for all your home cleaning needs
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-category">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-list">
                <li><Link to="/services?category=beauty">Beauty</Link></li>
                <li><Link to="/services?category=plumbing">Plumbing</Link></li>
                <li><Link to="/services?category=mechanics">Mechanics</Link></li>
                <li><Link to="/services?category=drivers">Drivers</Link></li>
                <li><Link to="/services?category=cooking">Cooking</Link></li>
                <li><Link to="/services?category=cleaning">Cleaning</Link></li>
              </ul>
            </div>

            <div className="footer-links-category">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/premium">Premium</Link></li>
                <li><Link to="/providers">Service Providers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>

            <div className="footer-links-category">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-list">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/help">Help Center</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4 className="footer-title">Subscribe to our Newsletter</h4>
            <p>Get the latest updates and offers directly to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" className="form-control" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} HELPRR. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 