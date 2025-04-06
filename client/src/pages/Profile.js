import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCreditCard, FaRegBell, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { user, updateUser } = useAuth();
  
  // Default user info if some fields are missing
  const userInfo = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently joined',
    role: user?.role || 'customer',
    isPremium: user?.isPremium || false,
    premiumTier: user?.premiumTier || '',
    bookings: user?.bookings || [],
    payments: user?.payments || []
  };

  // Form state
  const [formData, setFormData] = useState({
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    address: userInfo.address
  });
  
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the user profile
    updateUser({
      ...user,
      ...formData
    });
    setFormMessage({ type: 'success', text: 'Profile updated successfully!' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setFormMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={userInfo.avatar} alt={userInfo.name} />
            {userInfo.isPremium && (
              <div className="premium-badge" title={`Premium ${userInfo.premiumTier} Member`}>
                Premium
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userInfo.name}</h1>
            <p className="profile-meta">
              Member since {userInfo.memberSince}
              {userInfo.role === 'provider' && <span className="profile-role">Service Provider</span>}
            </p>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-navigation">
              <button 
                className={`nav-item ${activeTab === 'account' ? 'active' : ''}`} 
                onClick={() => setActiveTab('account')}
              >
                <FaUser className="nav-icon" />
                <span>ACCOUNT</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} 
                onClick={() => setActiveTab('bookings')}
              >
                <FaCalendarAlt className="nav-icon" />
                <span>BOOKINGS</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`} 
                onClick={() => setActiveTab('payments')}
              >
                <FaCreditCard className="nav-icon" />
                <span>PAYMENTS</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} 
                onClick={() => setActiveTab('notifications')}
              >
                <FaRegBell className="nav-icon" />
                <span>NOTIFICATIONS</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} 
                onClick={() => setActiveTab('security')}
              >
                <FaLock className="nav-icon" />
                <span>SECURITY</span>
              </button>
            </div>
          </div>
          
          <div className="profile-main">
            {activeTab === 'account' && (
              <div className="tab-content">
                <h2 className="section-title">ACCOUNT INFORMATION</h2>
                
                {formMessage.text && (
                  <div className={`alert alert-${formMessage.type}`}>
                    {formMessage.text}
                  </div>
                )}
                
                <form className="account-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">
                      <FaUser className="form-icon" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="form-icon" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone className="form-icon" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">
                      <FaMapMarkerAlt className="form-icon" />
                      <span>Address</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="tab-content">
                <h2 className="section-title">YOUR BOOKINGS</h2>
                
                {userInfo.bookings.length === 0 ? (
                  <p className="empty-state">You have no bookings yet.</p>
                ) : (
                  <div className="bookings-list">
                    {userInfo.bookings.map(booking => (
                      <div className={`booking-card ${booking.status}`} key={booking.id}>
                        <div className="booking-header">
                          <h3 className="booking-service">{booking.service}</h3>
                          <div className={`booking-status ${booking.status}`}>
                            {booking.status}
                          </div>
                        </div>
                        <div className="booking-details">
                          <div className="booking-info">
                            <span>Provider:</span>
                            <span>{booking.provider}</span>
                          </div>
                          <div className="booking-info">
                            <span>Date:</span>
                            <span>{booking.date}</span>
                          </div>
                          <div className="booking-info">
                            <span>Time:</span>
                            <span>{booking.time}</span>
                          </div>
                          <div className="booking-info">
                            <span>Price:</span>
                            <span>₹{booking.price}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <button className="btn btn-outline btn-sm">
                            View Details
                          </button>
                          {booking.status === 'upcoming' && (
                            <button className="btn btn-accent btn-sm">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div className="tab-content">
                <h2 className="section-title">PAYMENT HISTORY</h2>
                
                {userInfo.payments.length === 0 ? (
                  <p className="empty-state">You have no payment history.</p>
                ) : (
                  <div className="payments-list">
                    {userInfo.payments.map(payment => (
                      <div className="payment-item" key={payment.id}>
                        <div className="payment-service">{payment.service}</div>
                        <div className="payment-date">{payment.date}</div>
                        <div className="payment-amount">₹{payment.amount}</div>
                        <div className="payment-method">{payment.method}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h2 className="section-title">NOTIFICATION PREFERENCES</h2>
                <div className="notification-settings">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Email Notifications</h3>
                      <p>Receive booking confirmations, reminders, and updates via email.</p>
                    </div>
                    <div className="setting-action">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={true} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>SMS Notifications</h3>
                      <p>Receive booking confirmations, reminders, and updates via SMS.</p>
                    </div>
                    <div className="setting-action">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={true} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Marketing Communications</h3>
                      <p>Receive promotions, offers, and news about our services.</p>
                    </div>
                    <div className="setting-action">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={false} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="tab-content">
                <h2 className="section-title">SECURITY SETTINGS</h2>
                <div className="password-section">
                  <h3>CHANGE PASSWORD</h3>
                  <div className="form-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                      type="password"
                      id="current-password"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="form-control"
                    />
                  </div>
                  <button className="btn btn-primary">Update Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 