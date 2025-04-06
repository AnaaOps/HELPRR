import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProviderDetail.css';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const ProviderDetail = () => {
  const { id } = useParams();
  
  // Dummy provider data - in a real app, this would come from an API
  const provider = {
    id: id,
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    reviews: 127,
    specialty: "Professional Beautician",
    bio: "Certified beautician with over 8 years of experience specializing in facials, makeup, and hair styling. Graduate of Milan Beauty Academy with advanced training in the latest techniques.",
    services: [
      "Makeup Application",
      "Facials",
      "Hair Styling",
      "Manicure & Pedicure",
      "Skincare Consultation"
    ],
    experience: "8+ years",
    location: "Downtown, Los Angeles",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "jane.smith@example.com"
    },
    availability: {
      days: "Monday - Saturday",
      hours: "9:00 AM - 6:00 PM"
    },
    portfolio: [
      "https://images.unsplash.com/photo-1560869713-7d9baafa0f53?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1526307616774-60d0098f7642?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3"
    ]
  };

  return (
    <div className="provider-detail-page">
      <div className="provider-hero">
        <div className="container">
          <Link to="/services" className="back-link">
            &larr; Back to Services
          </Link>
          
          <div className="provider-header">
            <div className="provider-avatar">
              <img src={provider.avatar} alt={provider.name} />
            </div>
            <div className="provider-info">
              <h1 className="provider-name">{provider.name}</h1>
              <p className="provider-specialty">{provider.specialty}</p>
              <div className="provider-meta">
                <div className="rating">
                  <FaStar className="star-icon" />
                  <span>{provider.rating}</span>
                  <span className="review-count">({provider.reviews} reviews)</span>
                </div>
                <div className="experience">
                  <span>Experience: {provider.experience}</span>
                </div>
              </div>
            </div>
            <div className="provider-actions">
              <Link to={`/booking?provider=${id}`} className="btn btn-primary">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="provider-content">
        <div className="container">
          <div className="provider-grid">
            <div className="provider-main">
              <section className="provider-about">
                <h2>About</h2>
                <p>{provider.bio}</p>
              </section>

              <section className="provider-services">
                <h2>Services Offered</h2>
                <ul className="services-list">
                  {provider.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </section>

              <section className="provider-portfolio">
                <h2>Portfolio</h2>
                <div className="portfolio-grid">
                  {provider.portfolio.map((image, index) => (
                    <div className="portfolio-item" key={index}>
                      <img src={image} alt={`Portfolio ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="provider-sidebar">
              <div className="contact-card">
                <h3>Contact Information</h3>
                <div className="contact-item">
                  <FaMapMarkerAlt className="icon" />
                  <span>{provider.location}</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="icon" />
                  <span>{provider.contact.phone}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="icon" />
                  <span>{provider.contact.email}</span>
                </div>
                <div className="contact-item">
                  <FaCalendarAlt className="icon" />
                  <span>{provider.availability.days}<br />{provider.availability.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail; 