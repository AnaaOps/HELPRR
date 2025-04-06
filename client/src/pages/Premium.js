import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Premium.css';
import { FaCheck, FaTimes, FaStar, FaGem, FaRocket, FaShieldAlt, FaClock, FaGift, FaTimes as FaClose } from 'react-icons/fa';

const Premium = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Define premium membership plans
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 749,
      period: 'month',
      description: 'Perfect for first-time users',
      features: [
        { text: 'Priority Booking', included: true },
        { text: '10% Discount on all services', included: true },
        { text: 'Dedicated Customer Support', included: true },
        { text: 'Free Cancellation', included: true },
        { text: 'Access to Exclusive Events', included: false },
        { text: 'Family Member Benefits', included: false }
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 6749,
      period: 'year',
      popular: true,
      description: 'Most popular choice',
      features: [
        { text: 'Priority Booking', included: true },
        { text: '15% Discount on all services', included: true },
        { text: 'Dedicated Customer Support', included: true },
        { text: 'Free Cancellation', included: true },
        { text: 'Access to Exclusive Events', included: true },
        { text: 'Family Member Benefits', included: false }
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 18749,
      period: 'lifetime',
      description: 'For our dedicated customers',
      features: [
        { text: 'Priority Booking', included: true },
        { text: '20% Discount on all services', included: true },
        { text: 'Dedicated Customer Support', included: true },
        { text: 'Free Cancellation', included: true },
        { text: 'Access to Exclusive Events', included: true },
        { text: 'Family Member Benefits', included: true }
      ]
    }
  ];
  
  // Premium benefits
  const benefits = [
    {
      icon: <FaClock />,
      title: 'Priority Booking',
      description: 'Skip the queue and get priority access to booking slots with our top service providers.'
    },
    {
      icon: <FaGift />,
      title: 'Exclusive Discounts',
      description: 'Enjoy special discounts on all services, saving you money on every booking.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Premium Support',
      description: 'Get dedicated customer support with faster response times and personalized assistance.'
    },
    {
      icon: <FaRocket />,
      title: 'Advanced Features',
      description: 'Access premium-only features like flexible cancellations and exclusive events.'
    }
  ];
  
  // Testimonials from premium members
  const testimonials = [
    {
      id: 1,
      name: 'Vikram Mehta',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'The premium membership has been a game-changer for me. I save so much time with priority booking, and the discounts have already paid for my annual subscription!',
      rating: 5
    },
    {
      id: 2,
      name: 'Neha Kapoor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'I was skeptical at first, but the premium benefits are worth every rupee. The dedicated support team helped me through a complicated booking issue within minutes.',
      rating: 5
    },
    {
      id: 3,
      name: 'Rohan Verma',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      content: 'After calculating how much I spend on services yearly, going premium was a no-brainer. The 15% discount alone pays for the membership!',
      rating: 4
    }
  ];
  
  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/premium' } });
      return;
    }
    
    setSelectedPlan(plan);
    setShowPurchaseForm(true);
    setError('');
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.cardName || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    // Card number basic validation
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Mock successful purchase
      if (user) {
        // Update user with premium status
        updateUser({
          ...user,
          isPremium: true,
          premiumTier: selectedPlan.id
        });
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Close form after showing success
      setTimeout(() => {
        setShowPurchaseForm(false);
        setSelectedPlan(null);
      }, 3000);
    }, 1500);
  };

  const closePurchaseForm = () => {
    setShowPurchaseForm(false);
    setSelectedPlan(null);
    setError('');
    setSuccess(false);
  };

  return (
    <div className="premium-page">
      {/* Hero Section */}
      <section className="premium-hero">
        <div className="container">
          <div className="premium-hero-content">
            <div className="premium-badge">
              <FaGem /> Premium Membership
            </div>
            <h1 className="premium-title">Elevate Your Service Experience</h1>
            <p className="premium-subtitle">
              Join Helprr Premium and unlock exclusive benefits, discounts, and priority access to top service providers.
            </p>
            <Link to="#pricing" className="btn btn-primary btn-lg">
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="premium-benefits">
        <div className="container">
          <h2 className="section-title">Why Go Premium?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div className="benefit-card" key={index}>
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="premium-pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">Choose Your Plan</h2>
          <p className="section-subtitle">Select the premium plan that best fits your needs</p>
          
          <div className="pricing-grid">
            {plans.map(plan => (
              <div className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={plan.id}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">₹</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <div className="pricing-features">
                  {plan.features.map((feature, index) => (
                    <div className="feature-item" key={index}>
                      {feature.included ? (
                        <FaCheck className="feature-included" />
                      ) : (
                        <FaTimes className="feature-excluded" />
                      )}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pricing-action">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Choose {plan.name} Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Purchase Form Modal */}
      {showPurchaseForm && selectedPlan && (
        <div className="modal-overlay">
          <div className="purchase-modal">
            <div className="modal-header">
              <h2>Upgrade to {selectedPlan.name} Premium</h2>
              <button className="close-btn" onClick={closePurchaseForm}>
                <FaClose />
              </button>
            </div>
            
            <div className="modal-body">
              {success ? (
                <div className="success-message">
                  <FaCheck className="success-icon" />
                  <h3>Purchase Successful!</h3>
                  <p>Thank you for upgrading to {selectedPlan.name} Premium.</p>
                  <p>Your premium benefits are now active.</p>
                </div>
              ) : (
                <form className="purchase-form" onSubmit={handlePurchaseSubmit}>
                  <div className="purchase-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-item">
                      <span>{selectedPlan.name} Premium Membership</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                    <div className="summary-item summary-total">
                      <span>Total</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                  </div>
                  
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Expiry Date</label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="agreeTerms">
                      I agree to the <Link to="/terms">Terms and Conditions</Link>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonials Section */}
      <section className="premium-testimonials">
        <div className="container">
          <h2 className="section-title">What Our Premium Members Say</h2>
          
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div className="testimonial-card" key={testimonial.id}>
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < testimonial.rating ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="premium-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to upgrade your experience?</h2>
            <p>Join thousands of satisfied premium members today.</p>
            <Link to="#pricing" className="btn btn-primary btn-lg">
              Become Premium
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="premium-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How will I be billed?</h3>
              <p>You'll be charged at the beginning of each billing cycle (monthly or yearly). Lifetime membership is a one-time payment.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel my subscription?</h3>
              <p>Yes, you can cancel your subscription at any time. Your benefits will remain active until the end of your current billing period.</p>
            </div>
            <div className="faq-item">
              <h3>How do I access premium features?</h3>
              <p>Once you're a premium member, all benefits will be automatically applied to your account. You'll see the premium badge in your profile.</p>
            </div>
            <div className="faq-item">
              <h3>Can I upgrade my plan?</h3>
              <p>Absolutely! You can upgrade your plan at any time. We'll prorate the remaining value of your current subscription.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium; 