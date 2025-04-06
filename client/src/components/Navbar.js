import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaCrown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('navbar-search-input')?.focus();
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    // Close dropdown after logout
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
      setShowSearch(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <svg 
              className="logo-icon" 
              width="48" 
              height="48" 
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
            <h1 className="logo-text">HELPRR</h1>
          </div>
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="toggle-icon"></span>
          <span className="toggle-icon"></span>
          <span className="toggle-icon"></span>
        </div>

        <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">HOME</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link">SERVICES</Link>
            </li>
            <li className="nav-item">
              <Link to="/premium" className="nav-link">PREMIUM</Link>
            </li>
          </ul>

          <div className="navbar-actions">
            
            <div className={`navbar-search ${showSearch ? 'active' : ''}`}>
              <button 
                className="search-toggle" 
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                <FaSearch />
              </button>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="Search services..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
              </form>
            </div>
            
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                    {user.isPremium && <span className="premium-indicator" title="Premium Member">★</span>}
                  </div>
                  <span className="user-name">{user.name}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <span className="user-email">{user.email}</span>
                      {user.isPremium && (
                        <div className="premium-tag">
                          Premium {user.premiumTier && user.premiumTier.charAt(0).toUpperCase() + user.premiumTier.slice(1)}
                        </div>
                      )}
                    </div>
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/bookings" className="dropdown-item">My Bookings</Link>
                    {user.role === 'provider' && (
                      <Link to="/provider-dashboard" className="dropdown-item">Provider Dashboard</Link>
                    )}
                    {!user.isPremium && (
                      <Link to="/premium" className="dropdown-item premium-upgrade">
                        <span className="upgrade-icon">⭐</span>
                        Upgrade to Premium
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar; 