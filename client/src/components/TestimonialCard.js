import React from 'react';
import { FaStar } from 'react-icons/fa';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial }) => {
  // Generate rating stars based on rating value
  const renderRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className="rating-star" 
      />
    ));
  };

  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <img 
          src={testimonial.image} 
          alt={testimonial.name} 
          className="testimonial-avatar" 
        />
        <div className="testimonial-info">
          <h3 className="testimonial-name">{testimonial.name}</h3>
          <p className="testimonial-role">{testimonial.role}</p>
        </div>
      </div>
      <div className="testimonial-rating">
        {renderRatingStars(testimonial.rating)}
      </div>
      <p className="testimonial-content">{testimonial.content}</p>
    </div>
  );
};

export default TestimonialCard; 