import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Booking.css';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaCreditCard, FaCheck } from 'react-icons/fa';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('provider');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  // Dummy data for available dates and times
  const availableDates = [
    '2023-12-01', '2023-12-02', '2023-12-03', 
    '2023-12-04', '2023-12-05', '2023-12-06', 
    '2023-12-07', '2023-12-08', '2023-12-09'
  ];
  
  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  const locations = [
    'Your Home',
    'Provider\'s Studio',
    'Virtual Session'
  ];
  
  // Dummy service data - in a real app, this would be fetched from an API
  const service = {
    id: 1,
    title: 'Beauty Services',
    provider: 'Jane Smith',
    price: 85,
    duration: '1 hour',
    image: 'https://images.unsplash.com/photo-1560869713-7d9baafa0f53?ixlib=rb-4.0.3'
  };
  
  useEffect(() => {
    // In a real app, this would fetch service data based on provider ID
    console.log('Provider ID:', providerId);
  }, [providerId]);
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmitBooking = () => {
    // In a real app, this would submit booking data to an API
    console.log('Submitting booking:', {
      service: service.id,
      provider: providerId,
      date: selectedDate,
      time: selectedTime,
      location: selectedLocation,
      contactName,
      contactPhone,
      contactEmail,
      paymentMethod
    });
    
    // Generate a booking ID and complete the booking
    const generatedBookingId = 'BK' + Math.floor(10000 + Math.random() * 90000);
    setBookingId(generatedBookingId);
    setBookingComplete(true);
    nextStep();
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <Link to={providerId ? `/providers/${providerId}` : '/services'} className="back-link">
            <FaArrowLeft /> Back
          </Link>
          <h1 className="booking-title">Book Your Service</h1>
        </div>
        
        <div className="booking-container">
          <div className="booking-progress">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Date & Time</div>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Contact Info</div>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
          
          <div className="booking-content">
            <div className="booking-main">
              {currentStep === 1 && (
                <div className="booking-step">
                  <h2 className="step-title">
                    <FaCalendarAlt className="step-icon" />
                    Select Date & Time
                  </h2>
                  
                  <div className="form-group">
                    <label>Select Date</label>
                    <div className="date-grid">
                      {availableDates.map(date => (
                        <button
                          key={date}
                          className={`date-option ${selectedDate === date ? 'selected' : ''}`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Time</label>
                    <div className="time-grid">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Location</label>
                    <div className="location-options">
                      {locations.map(location => (
                        <button
                          key={location}
                          className={`location-option ${selectedLocation === location ? 'selected' : ''}`}
                          onClick={() => setSelectedLocation(location)}
                        >
                          <FaMapMarkerAlt />
                          <span>{location}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="step-actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={nextStep}
                      disabled={!selectedDate || !selectedTime || !selectedLocation}
                    >
                      Continue to Contact Info
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="booking-step">
                  <h2 className="step-title">
                    <FaUser className="step-icon" />
                    Contact Information
                  </h2>
                  
                  <div className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className="form-control"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="step-actions">
                    <button className="btn btn-outline" onClick={prevStep}>
                      Back
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={nextStep}
                      disabled={!contactName || !contactPhone || !contactEmail}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="booking-step">
                  <h2 className="step-title">
                    <FaCreditCard className="step-icon" />
                    Payment Method
                  </h2>
                  
                  <div className="payment-methods">
                    <div className="payment-option">
                      <label className="payment-label">
                        <input
                          type="radio"
                          name="payment"
                          value="credit-card"
                          checked={paymentMethod === 'credit-card'}
                          onChange={() => setPaymentMethod('credit-card')}
                        />
                        <div className="payment-card">
                          <div className="payment-icon">
                            <i className="far fa-credit-card"></i>
                          </div>
                          <div className="payment-info">
                            <h3>Credit / Debit Card</h3>
                            <p>Pay with Visa, Mastercard, or American Express</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="payment-option">
                      <label className="payment-label">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                        />
                        <div className="payment-card">
                          <div className="payment-icon">
                            <i className="fab fa-paypal"></i>
                          </div>
                          <div className="payment-info">
                            <h3>PayPal</h3>
                            <p>Pay with your PayPal account</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="payment-option">
                      <label className="payment-label">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                        />
                        <div className="payment-card">
                          <div className="payment-icon">
                            <i className="fas fa-money-bill-wave"></i>
                          </div>
                          <div className="payment-info">
                            <h3>Cash on Delivery</h3>
                            <p>Pay when the service is completed</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="step-actions">
                    <button className="btn btn-outline" onClick={prevStep}>
                      Back
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSubmitBooking}
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="booking-step confirmation-step">
                  {bookingComplete ? (
                    <div className="confirmation-content">
                      <div className="confirmation-icon">
                        <FaCheck />
                      </div>
                      <h2>Booking Confirmed!</h2>
                      <p className="confirmation-message">
                        Your booking has been confirmed. We've sent a confirmation email to {contactEmail}.
                      </p>
                      <div className="booking-details-summary">
                        <div className="booking-summary-item">
                          <strong>Booking ID:</strong> {bookingId}
                        </div>
                        <div className="booking-summary-item">
                          <strong>Service:</strong> {service.title}
                        </div>
                        <div className="booking-summary-item">
                          <strong>Provider:</strong> {service.provider}
                        </div>
                        <div className="booking-summary-item">
                          <strong>Date:</strong> {formatDate(selectedDate)}
                        </div>
                        <div className="booking-summary-item">
                          <strong>Time:</strong> {selectedTime}
                        </div>
                        <div className="booking-summary-item">
                          <strong>Location:</strong> {selectedLocation}
                        </div>
                      </div>
                      <div className="confirmation-actions">
                        <Link to="/" className="btn btn-outline">
                          Back to Home
                        </Link>
                        <Link to="/profile" className="btn btn-primary">
                          View My Bookings
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="processing-message">
                      <div className="spinner"></div>
                      <p>Processing your booking...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="booking-sidebar">
              <div className="service-summary">
                <h3>Service Summary</h3>
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-info">
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-provider">By {service.provider}</p>
                  <p className="service-duration">
                    <FaClock /> {service.duration}
                  </p>
                </div>
                <div className="service-price">
                  <div className="price-label">Price</div>
                  <div className="price-amount">${service.price}</div>
                </div>
                
                {(selectedDate || selectedTime || selectedLocation) && (
                  <div className="booking-summary">
                    <h4>Booking Details</h4>
                    {selectedDate && (
                      <div className="summary-item">
                        <FaCalendarAlt />
                        <span>{formatDate(selectedDate)}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="summary-item">
                        <FaClock />
                        <span>{selectedTime}</span>
                      </div>
                    )}
                    {selectedLocation && (
                      <div className="summary-item">
                        <FaMapMarkerAlt />
                        <span>{selectedLocation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 