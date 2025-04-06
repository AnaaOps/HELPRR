import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      setLoading(true);
      console.log('Login attempt with:', formData);
      
      const data = await login(email, password);
      console.log('Login successful:', data);
      
      if (data && data.success) {
        setSuccess(true);
        
        // Set user in auth context
        const userData = {
          email,
          name: email.split('@')[0], // For mock data
          role: 'customer'
        };
        authLogin(userData, data.token);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-form-container">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to continue to your account</p>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Login successful! Redirecting...</div>}
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={handleChange}
                  required
                />
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
                />
              </div>
              
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
          </div>
          
          <div className="login-image">
            <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Helprr Login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 