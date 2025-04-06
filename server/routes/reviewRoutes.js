const express = require('express');
const router = express.Router({ mergeParams: true });

// Import controllers
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getProviderReviews,
  getUserReviews
} = require('../controllers/reviewController');

// Import middleware
const { protect } = require('../middleware/auth');

// User and provider specific routes
router.get('/user', protect, getUserReviews);
router.get('/provider/:providerId', getProviderReviews);

// Standard CRUD routes
router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router; 