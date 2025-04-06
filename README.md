# Helprr - Service Booking Platform

Helprr is a modern service booking platform that connects customers with service providers. This application features user authentication, service browsing, booking management, and more.

## Features

- User Registration and Authentication (Gmail accounts only)
- Service Browsing and Booking
- Real-time Booking Management
- Provider Profiles
- Secure Payment Integration
- Responsive Design

## Prerequisites

Before running the application, make sure you have:

- Node.js installed (Download from: https://nodejs.org)
- Windows operating system

## Quick Start Guide

1. First, close any running instances of the application:
   ```bash
   taskkill /F /IM node.exe
   ```

2. Navigate to the project folder:
   - Open File Explorer
   - Go to the 'helprrrrrrrrrrrrr' folder

3. Run the application:
   - Simply double-click the `start.bat` file
   OR
   - Right-click `start.bat` and select 'Run as administrator'

4. Wait for the application to start:
   - You'll see a terminal window open
   - The server will start automatically
   - A browser window will open automatically

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## User Registration Requirements

1. Email Address:
   - Must be a valid Gmail address (ending with @gmail.com)
   - Example: yourname@gmail.com

2. Password Requirements:
   - Minimum 8 characters
   - Must include:
     - At least one uppercase letter (A-Z)
     - At least one lowercase letter (a-z)
     - At least one number (0-9)
     - At least one special character (@$!%*?&)

## Common Issues and Solutions

1. If the application is already running:
   - Close all terminal windows
   - Run: `taskkill /F /IM node.exe`
   - Try starting the application again

2. If the website doesn't open automatically:
   - Open your browser
   - Go to http://localhost:3000

## Note

- The application uses mock data for demonstration
- No database setup required
- All features are fully functional with the mock data

## Support

For help or issues, please contact the development team. - Service Marketplace Platform

Helprr is a comprehensive service marketplace platform that connects service providers with customers looking for various services. It includes functionality for user management, service listings, provider profiles, booking management, and a review system.

## Live Demo

[Helprr Live Demo](https://helprr-marketplace.herokuapp.com)

## Features

- User authentication and profile management
- Service listings with different categories
- Service provider profiles and management
- Booking system for services
- Reviews and ratings
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express
- **Authentication**: JWT
- **Data**: Mock data (no database required)

## Running the Application

### Prerequisites

1. Make sure you have Node.js installed
   - Download from: https://nodejs.org
   - Install for Windows

### Quick Start (Windows)

1. **Close any running instances**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Start the application**
   - Navigate to the project folder
   - Double-click `start.bat`
   OR
   - Right-click `start.bat` and select 'Run as administrator'

3. **Access the website**
   - Open your browser
   - Go to http://localhost:3000

### What to Expect

- The terminal window will open automatically
- You'll see messages about the server starting
- The website will be available at http://localhost:3000
- The API server will run on http://localhost:5001

### Registration Rules

1. **Email Requirements**:
   - Must use a Gmail address (@gmail.com)
   - Example: yourname@gmail.com

2. **Password Requirements**:
   - At least 8 characters
   - Must include:
     - Uppercase letter (A-Z)
     - Lowercase letter (a-z)
     - Number (0-9)
     - Special character (@$!%*?&)

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/helprrr
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

4. **Run the application in development mode**

```bash
npm run dev
```

This will start both the backend server (port 5000) and the React development server (port 3000).

## Deployment

### Heroku Deployment

1. **Create a Heroku account** (if you don't have one)
2. **Install Heroku CLI**
3. **Login to Heroku**

```bash
heroku login
```

4. **Create a new Heroku app**

```bash
heroku create helprr-marketplace
```

5. **Add MongoDB URI to Heroku environment**

```bash
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_EXPIRE=30d
heroku config:set JWT_COOKIE_EXPIRE=30
heroku config:set NODE_ENV=production
```

6. **Push to Heroku**

```bash
git push heroku main
```

### Netlify/Vercel Deployment (Frontend)

1. Build the client

```bash
cd client
npm run build
```

2. Deploy the `build` folder to Netlify or Vercel
3. Set up environment variables in the platform settings
4. Add proxy settings or environment variable to point to your deployed backend API

## API Documentation

The API includes the following main resources:

- `/api/users` - User management and authentication
- `/api/services` - Service listings and categories
- `/api/providers` - Service provider profiles
- `/api/bookings` - Booking management
- `/api/reviews` - Reviews and ratings

## License

MIT 