import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSpa, FaTools, FaCar, FaTaxi, FaUtensils, FaBroom, FaLaptop, FaGuitar, FaHome, FaBaby, FaDog, FaPaintRoller, FaSearch } from 'react-icons/fa';
import './Services.css';

// Components
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search');

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'beauty', name: 'Beauty & Wellness' },
    { id: 'home', name: 'Home Services' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'professional', name: 'Professional Services' }
  ];

  // All services with their categories
  const allServices = [
    { 
      id: 1, 
      title: 'Beauty Services', 
      icon: <FaSpa />, 
      description: 'Professional beauty services including hair styling, makeup, manicures, and more.',
      category: 'beauty',
      color: '#f8a5c2',
      rating: 4.8,
      providers: 158
    },
    { 
      id: 2, 
      title: 'Plumbing', 
      icon: <FaTools />, 
      description: 'Expert plumbers to fix leaks, install fixtures, and handle all your plumbing needs.',
      category: 'home',
      color: '#3498db',
      rating: 4.7,
      providers: 124
    },
    { 
      id: 3, 
      title: 'Car Maintenance', 
      icon: <FaCar />, 
      description: 'Comprehensive car maintenance including oil changes, tune-ups, and inspections.',
      category: 'automotive',
      color: '#f39c12',
      rating: 4.9,
      providers: 86
    },
    { 
      id: 4, 
      title: 'Driver Services', 
      icon: <FaTaxi />, 
      description: 'Professional driving services for personal transportation needs.',
      category: 'lifestyle',
      color: '#2ecc71',
      rating: 4.6,
      providers: 210
    },
    { 
      id: 5, 
      title: 'Cooking', 
      icon: <FaUtensils />, 
      description: 'Custom meal preparation services by experienced chefs.',
      category: 'lifestyle',
      color: '#e74c3c',
      rating: 4.8,
      providers: 92
    },
    { 
      id: 6, 
      title: 'Cleaning', 
      icon: <FaBroom />, 
      description: 'Thorough house cleaning services for a spotless home.',
      category: 'home',
      color: '#9b59b6',
      rating: 4.7,
      providers: 178
    },
    { 
      id: 7, 
      title: 'Tech Support', 
      icon: <FaLaptop />, 
      description: 'Technical assistance for your computer, smartphone, and other devices.',
      category: 'professional',
      color: '#34495e',
      rating: 4.5,
      providers: 64
    },
    { 
      id: 8, 
      title: 'Music Lessons', 
      icon: <FaGuitar />, 
      description: 'Learn to play musical instruments with experienced instructors.',
      category: 'lifestyle',
      color: '#1abc9c',
      rating: 4.9,
      providers: 46
    },
    { 
      id: 9, 
      title: 'Interior Design', 
      icon: <FaHome />, 
      description: 'Professional interior design services to transform your living spaces.',
      category: 'home',
      color: '#d35400',
      rating: 4.8,
      providers: 53
    },
    { 
      id: 10, 
      title: 'Childcare', 
      icon: <FaBaby />, 
      description: 'Trusted childcare services by verified professionals.',
      category: 'lifestyle',
      color: '#27ae60',
      rating: 4.9,
      providers: 115
    },
    { 
      id: 11, 
      title: 'Pet Care', 
      icon: <FaDog />, 
      description: 'Reliable pet care services including walking, grooming, and sitting.',
      category: 'lifestyle',
      color: '#3498db',
      rating: 4.7,
      providers: 87
    },
    { 
      id: 12, 
      title: 'Painting', 
      icon: <FaPaintRoller />, 
      description: 'Professional painting services for both interior and exterior projects.',
      category: 'home',
      color: '#e67e22',
      rating: 4.6,
      providers: 94
    }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(searchParam || '');

  // Update search term when URL parameter changes
  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    navigate('/services');
  };

  // Filter services based on category and search term
  const filteredServices = allServices.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = !searchTerm || 
                         service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1 className="services-hero-title">Our Services</h1>
          <p className="services-hero-description">
            Discover professional services for all your daily needs
          </p>
          <form onSubmit={handleSearch} className="services-search">
            <div className="search-input-wrapper">
              <input 
                type="text"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="services-search-input"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="clear-search" 
                  onClick={clearSearch}
                >
                  ×
                </button>
              )}
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          <div className="services-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="services-results">
            <p className="results-count">
              {filteredServices.length} services found
              {searchTerm && (
                <span className="search-query"> for "{searchTerm}"</span>
              )}
            </p>
            
            <div className="services-grid">
              {filteredServices.map((service) => (
                <Link to={`/services/${service.id}`} key={service.id} className="service-link">
                  <ServiceCard service={service} />
                </Link>
              ))}
            </div>
            
            {filteredServices.length === 0 && (
              <div className="no-results">
                <h3>No services found</h3>
                <p>Try adjusting your search or browse all categories</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {setActiveCategory('all'); clearSearch();}}
                >
                  View All Services
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 