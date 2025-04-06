import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Initialize - check if user is already logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Get current user info
          const userData = await getProfile();
          
          if (userData.success) {
            setUser(userData.data);
            setIsAuthenticated(true);
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);
  
  // Login user
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user
  const updateUser = (userData) => {
    setUser(userData);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 