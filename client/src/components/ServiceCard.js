import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers } from 'react-icons/fa';
import './ServiceCard.css';

// Import service background images
import cleaningBg from '../assets/images/services/cleaning.svg';
import plumbingBg from '../assets/images/services/plumbing.svg';
import mechanicsBg from '../assets/images/services/mechanics.svg';
import beautyBg from '../assets/images/services/beauty.svg';
import cookingBg from '../assets/images/services/cooking.svg';
import driversBg from '../assets/images/services/drivers.svg';
import electronicsBg from '../assets/images/services/electronics.svg';

const ServiceCard = ({ service }) => {
  // Determine service type for data-attribute
  const getServiceType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('beauty')) return 'beauty';
    if (lowerTitle.includes('plumbing')) return 'plumbing';
    if (lowerTitle.includes('car')) return 'car';
    if (lowerTitle.includes('driver')) return 'driver';
    if (lowerTitle.includes('cook')) return 'cooking';
    if (lowerTitle.includes('clean')) return 'cleaning';
    return 'other';
  };

  // Map service title to its background image
  const getCategoryBackground = (title) => {
    const titleMap = {
      'Beauty Services': beautyBg,
      'Plumbing': plumbingBg,
      'Car Maintenance': mechanicsBg,
      'Driver Services': driversBg,
      'Cooking': cookingBg,
      'Cleaning': cleaningBg,
      'Tech Support': electronicsBg
    };
    
    return titleMap[title] || '';
  };

  return (
    <Link to={`/services/${service.id}`} className="service-card" data-service={getServiceType(service.title)}>
      <div 
        className="service-card-inner"
        style={{
          backgroundImage: `url(${getCategoryBackground(service.title)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="service-card-content">
          <div className="service-icon">
            {service.icon}
          </div>
          <h3 className="service-card-title">{service.title}</h3>
          <span className="service-card-category">{service.category}</span>
          <p className="service-card-description">{service.description}</p>
          <div className="service-meta">
            <div className="service-providers">
              <FaUsers />
              <span>{service.providers} Providers</span>
            </div>
            <div className="service-rating">
              <FaStar />
              <span>{service.rating}</span>
              {service.reviewCount && (
                <span className="rating-count">({service.reviewCount} reviews)</span>
              )}
            </div>
          </div>
          {service.price && (
            <div className="service-card-price">₹{service.price}/hr</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard; 