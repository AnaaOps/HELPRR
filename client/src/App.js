import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';


// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import ProviderDetail from './pages/ProviderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Premium from './pages/Premium';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import './styles/App.css';


const App = () => {
  useEffect(() => {
    // Update document title and meta description
    document.title = "HELPRR | Home Services Marketplace";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'HELPRR - Your trusted marketplace for home services including cleaning, plumbing, repairs, and more. Find reliable service providers in your area.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'HELPRR - Your trusted marketplace for home services including cleaning, plumbing, repairs, and more. Find reliable service providers in your area.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/providers/:id" element={<ProviderDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/premium" element={<Premium />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 