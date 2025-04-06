import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

// Import components
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';

// Import icons
import { FaRegStar, FaSpa, FaTools, FaCar, FaTaxi, FaUtensils, FaBroom } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Mock service data
  const services = [
    { 
      id: 1, 
      title: 'Beauty Services', 
      icon: <FaSpa />, 
      description: 'Professional beauty services at your doorstep.',
      color: '#f8a5c2',
      providers: 158,
      rating: 4.8
    },
    { 
      id: 2, 
      title: 'Plumbing', 
      icon: <FaTools />, 
      description: 'Expert plumbers to fix all your plumbing issues.',
      color: '#3498db',
      providers: 124,
      rating: 4.7
    },
    { 
      id: 3, 
      title: 'Car Maintenance', 
      icon: <FaCar />, 
      description: 'Comprehensive car maintenance including oil changes, tune-ups, and inspections.',
      color: '#f39c12',
      providers: 86,
      rating: 4.9
    },
    { 
      id: 4, 
      title: 'Driver Services', 
      icon: <FaTaxi />, 
      description: 'Professional driving services for personal transportation needs.',
      color: '#2ecc71',
      providers: 210,
      rating: 4.6
    },
    { 
      id: 5, 
      title: 'Cooking', 
      icon: <FaUtensils />, 
      description: 'Custom meal preparation services by experienced chefs.',
      color: '#e74c3c',
      providers: 92,
      rating: 4.8
    },
    { 
      id: 6, 
      title: 'Cleaning', 
      icon: <FaBroom />, 
      description: 'Thorough house cleaning services for a spotless home.',
      color: '#9b59b6',
      providers: 178,
      rating: 4.7
    }
  ];

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Regular Customer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Helprr has completely transformed how I manage household tasks. The quality of service and the ease of booking are unmatched!',
      rating: 5
    },
    {
      id: 2,
      name: 'Arjun Patel',
      role: 'Premium Member',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'The premium membership is absolutely worth it. I get priority bookings and the discounts save me a lot annually.',
      rating: 5
    },
    {
      id: 3,
      name: 'Ananya Desai',
      role: 'Regular Customer',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      content: "I've tried several service platforms, but Helprr stands out for its reliable providers and excellent customer support.",
      rating: 4
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Your <span className="hero-title-highlight">24x7</span> Service Platform</h1>
            <p className="hero-tagline">Hustle. Enable. Launch. Provide. Respond. Resolve.</p>
            <p className="hero-description">
              Connect with professional service providers for all your daily needs.
              From beauty to plumbing, cooking to driving - we've got you covered.
            </p>
            <form onSubmit={handleSearch} className="hero-search">
              <input 
                type="text" 
                placeholder="What service do you need today?" 
                className="hero-search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-lg">Search</button>
            </form>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1,000+</span>
                <span className="stat-label">Service Providers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100,000+</span>
                <span className="stat-label">Services Completed</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" alt="Helprr Services" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our <span className="highlight">Services</span></h2>
            <p className="section-description">Discover professional services for all your daily needs</p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="service-link">
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/services" className="btn btn-outline btn-lg">View All Services</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It <span className="highlight">Works</span></h2>
            <p className="section-description">Get your services done in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Find a Service</h3>
              <p className="step-description">Browse through our wide range of services or search for a specific one.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Book a Provider</h3>
              <p className="step-description">Choose from our verified service providers based on ratings and reviews.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Get it Done</h3>
              <p className="step-description">Relax as your service is completed by professionals at your convenience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Membership Section */}
      <section className="premium-section">
        <div className="container">
          <div className="premium-content">
            <div className="premium-info">
              <h2 className="premium-title">Premium Membership</h2>
              <p className="premium-description">
                Upgrade to Premium and unlock exclusive benefits to enhance your service experience.
              </p>
              <ul className="premium-benefits">
                <li className="benefit-item">
                  <FaRegStar className="benefit-icon" />
                  <span>Priority booking for all services</span>
                </li>
                <li className="benefit-item">
                  <FaRegStar className="benefit-icon" />
                  <span>Exclusive access to top-rated service providers</span>
                </li>
                <li className="benefit-item">
                  <FaRegStar className="benefit-icon" />
                  <span>Additional discount coupons on every booking</span>
                </li>
                <li className="benefit-item">
                  <FaRegStar className="benefit-icon" />
                  <span>24/7 dedicated customer support</span>
                </li>
                <li className="benefit-item">
                  <FaRegStar className="benefit-icon" />
                  <span>Special seasonal offers and promotions</span>
                </li>
              </ul>
              <Link to="/premium" className="btn btn-accent btn-lg">Upgrade Now</Link>
            </div>
            <div className="premium-image">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="Premium Membership" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our <span className="highlight">Customers</span> Say</h2>
            <p className="section-description">Trusted by thousands of satisfied customers across the country</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="app-download-section">
        <div className="container">
          <div className="app-content">
            <div className="app-info">
              <h2 className="app-title">Get the Helprr App</h2>
              <p className="app-description">
                Book and manage services on the go with our mobile app. Available for iOS and Android.
              </p>
              <div className="app-buttons">
                <a href="#download" className="app-button">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" />
                </a>
                <a href="#download" className="app-button">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                </a>
              </div>
            </div>
            <div className="app-image">
              <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" alt="Helprr Mobile App" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 