import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheck } from 'react-icons/fa';
import './ServiceDetail.css';

// Dummy data (in a real app, this would come from an API)
import { serviceDetails } from '../utils/dummyData';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchService = () => {
      setLoading(true);
      setTimeout(() => {
        const foundService = serviceDetails.find(s => s.id === parseInt(id));
        setService(foundService);
        setLoading(false);
      }, 500);
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="not-found-container">
        <h2>Service Not Found</h2>
        <p>The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const { 
    title, 
    category, 
    description, 
    price, 
    rating, 
    reviews, 
    providers, 
    image, 
    features, 
    availableDates, 
    availableTimes 
  } = service;

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !bookingAddress) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to book a service');
        return;
      }

      const bookingDateTime = new Date(`${selectedDate} ${selectedTime}`);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service: id,
          provider: service.topProviders[0].id, // Using first provider for demo
          date: bookingDateTime.toISOString(),
          amount: price,
          address: bookingAddress,
          notes: additionalNotes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Booking successful! You can view your booking in your profile.');
      setError('');
      
      // Clear form
      setSelectedDate('');
      setSelectedTime('');
      setBookingAddress('');
      setAdditionalNotes('');

      // Navigate to profile page after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="service-detail-page">
      <div className="service-detail-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="service-detail-header">
            <Link to="/services" className="back-link">
              ← Back to Services
            </Link>
            <div className="category-tag">{category}</div>
            <h1 className="service-title">{title}</h1>
            <div className="service-meta">
              <div className="rating">
                <FaStar className="star-icon" />
                <span>{rating} ({reviews} reviews)</span>
              </div>
              <div className="providers">
                <span>{providers} service providers available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-detail-content">
        <div className="container">
          <div className="service-detail-grid">
            <div className="service-info">
              <section className="service-description">
                <h2>Service Description</h2>
                <p>{description}</p>
              </section>

              <section className="service-features">
                <h2>What's Included</h2>
                <ul className="features-list">
                  {features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="service-providers">
                <h2>Top Service Providers</h2>
                <div className="providers-list">
                  {service.topProviders.map(provider => (
                    <div className="provider-card" key={provider.id}>
                      <img src={provider.avatar} alt={provider.name} className="provider-avatar" />
                      <div className="provider-info">
                        <h4>{provider.name}</h4>
                        <div className="provider-rating">
                          <FaStar className="star-icon" />
                          <span>{provider.rating}</span>
                        </div>
                        <p className="provider-speciality">{provider.speciality}</p>
                      </div>
                      <Link to={`/providers/${provider.id}`} className="btn btn-outline btn-sm">View Profile</Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="booking-sidebar">
              <div className="booking-card">
                <h3>Book this Service</h3>
                <div className="price">
                  <span className="amount">₹{price}</span>
                  <span className="period">/ hour</span>
                </div>

                <div className="booking-form">
                  <div className="form-group">
                    <label>
                      <FaCalendarAlt className="form-icon" />
                      Select Date
                    </label>
                    <select 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Choose a date</option>
                      {availableDates.map(date => (
                        <option key={date} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaClock className="form-icon" />
                      Select Time
                    </label>
                    <select 
                      value={selectedTime} 
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="form-control"
                      disabled={!selectedDate}
                    >
                      <option value="">Choose a time</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <FaMapMarkerAlt className="form-icon" />
                      Your Location
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your address" 
                      className="form-control"
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Additional Notes (Optional)</label>
                    <textarea
                      placeholder="Any special requests or notes"
                      className="form-control"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      maxLength={500}
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}

                  <button 
                    className="btn btn-primary btn-block booking-btn"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>
                </div>

                <div className="booking-note">
                  <p>Free cancellation up to 24 hours before the appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail; 