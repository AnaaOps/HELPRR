const express = require('express');
const router = express.Router();

// Mock recommendation controller functions (in production, these would be imported from controllers)
const {
    getPersonalizedRecommendations,
    getPopularServices,
    getSeasonalRecommendations,
    getLocationBasedServices,
    getSimilarProviders,
    getRecommendedPackages
} = require('../controllers/recommendationController');

// @route   GET /api/recommendations/personalized/:userId
// @desc    Get personalized recommendations for a user
// @access  Private
router.get('/personalized/:userId', getPersonalizedRecommendations);

// @route   GET /api/recommendations/popular
// @desc    Get most popular services
// @access  Public
router.get('/popular', getPopularServices);

// @route   GET /api/recommendations/seasonal
// @desc    Get seasonal service recommendations
// @access  Public
router.get('/seasonal', getSeasonalRecommendations);

// @route   GET /api/recommendations/location/:locationId
// @desc    Get location-based service recommendations
// @access  Public
router.get('/location/:locationId', getLocationBasedServices);

// @route   GET /api/recommendations/providers/similar/:providerId
// @desc    Get similar providers to a given provider
// @access  Public
router.get('/providers/similar/:providerId', getSimilarProviders);

// @route   GET /api/recommendations/packages/:userId
// @desc    Get recommended service packages for a user
// @access  Private
router.get('/packages/:userId', getRecommendedPackages);

module.exports = router; 