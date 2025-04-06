const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './server/config/config.env' });

// Route files
const serviceRoutes = require('./routes/serviceRoutes');
const providerRoutes = require('./routes/providerRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Add mock data middleware if SKIP_DB is true
if (process.env.SKIP_DB === 'true') {
  // Mock data middleware
  app.use((req, res, next) => {
    console.log('Using mock data middleware');
    
    // Add mock response for service endpoints
    if (req.path.startsWith('/api/services')) {
      if (req.method === 'GET') {
        if (req.path === '/api/services') {
          return res.status(200).json({
            success: true,
            count: 5,
            data: [
              { id: '1', title: 'Beauty Services', category: 'Beauty', price: 50 },
              { id: '2', title: 'Plumbing', category: 'Home', price: 80 },
              { id: '3', title: 'Car Maintenance', category: 'Automotive', price: 100 },
              { id: '4', title: 'Driver Services', category: 'Transportation', price: 60 },
              { id: '5', title: 'Cooking', category: 'Food', price: 75 }
            ]
          });
        }
      }
    }

    // Add mock response for user registration and login
    if (req.path.startsWith('/api/users')) {
      // Handle user registration
      if (req.path === '/api/users/register' && req.method === 'POST') {
        console.log('Mock registration:', req.body);
        return res.status(201).json({
          success: true,
          token: 'mock-jwt-token-for-testing'
        });
      }
      
      // Handle user login
      if (req.path === '/api/users/login' && req.method === 'POST') {
        console.log('Mock login:', req.body);
        return res.status(200).json({
          success: true,
          token: 'mock-jwt-token-for-testing'
        });
      }
      
      // Handle user profile
      if (req.path === '/api/users/me' && req.method === 'GET') {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: {
            id: '1',
            name: 'Test User',
            email: req.body.email || 'test@example.com',
            role: 'customer'
          }
        });
      }
    }

    // Let real handlers process if we don't have a mock
    next();
  });
}

// Mount routers
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV,
    dbConnected: process.env.SKIP_DB !== 'true'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Connect to database unless skipped
if (process.env.SKIP_DB !== 'true') {
  console.log('Attempting database connection...'.cyan);
  connectDB()
    .then(() => {
      console.log('MongoDB Connected'.cyan.underline);
    })
    .catch((err) => {
      console.error(`Database connection error: ${err.message}`.red);
      console.log('Running in database-less mode. Data will not be persisted.'.yellow);
      // Set SKIP_DB to true if connection fails
      process.env.SKIP_DB = 'true';
    });
} else {
  console.log('Database connection skipped. Running with mock data.'.yellow);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process only for critical errors
  if (err.message.includes('EACCES') || err.message.includes('EADDRINUSE')) {
    server.close(() => process.exit(1));
  }
});

module.exports = app; 