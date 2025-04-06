import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer' // 'customer' or 'provider'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { firstName, lastName, email, password, confirmPassword, userType } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time email validation
    if (name === 'email') {
      const emailErrors = validateEmail(value);
      if (emailErrors.length > 0) {
        setEmailError(emailErrors[0]);
      } else {
        setEmailError('');
      }
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters long`);
    if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
    if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
    if (!hasNumbers) errors.push('Password must contain at least one number');
    if (!hasSpecialChar) errors.push('Password must contain at least one special character');

    return errors;
};

const validateEmail = (email) => {
    const isGmail = email.toLowerCase().endsWith('@gmail.com');
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const errors = [];
    if (!isGmail) errors.push('Please use a Gmail address');
    if (!isValidFormat) errors.push('Please enter a valid email format');

    return errors;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
        setError(emailErrors.join('\n'));
        return;
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
        setError(passwordErrors.join('\n'));
        return;
    }
    setError('');
    setSuccess(false);
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Format data for API
      const userData = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        phone: '1234567890', // Default phone as it's required by the model
        role: userType
      };
      
      console.log('Sending registration data:', userData);
      
      // The API utility now returns the data directly, not the response object
      const data = await register(userData);
      console.log('Registration successful:', data);
      
      if (data && data.success) {
        // Temporarily store registration data for the login page
        localStorage.setItem('registeredEmail', email);
        localStorage.setItem('registeredName', `${firstName} ${lastName}`);
        
        setSuccess(true);
        
        // Show success message for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-container">
          <div className="register-header">
            <h1 className="register-title">Create Your Account</h1>
            <p className="register-subtitle">Join Helprr and access quality services</p>
          </div>

          <div className="user-type-toggle">
            <button 
              className={`user-type-btn ${userType === 'customer' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, userType: 'customer' })}
              type="button"
            >
              I need services
            </button>
            <button 
              className={`user-type-btn ${userType === 'provider' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, userType: 'provider' })}
              type="button"
            >
              I provide services
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                value={email}
                onChange={handleChange}
                required
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Please enter a valid Gmail address"
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={handleChange}
                required
                minLength="8"
              />
              <small className="form-text">At least 8 characters with letters and numbers</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-terms">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (userType === 'customer' ? 'Sign Up as Customer' : 'Sign Up as Provider')}
            </button>
          </form>
          
          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 