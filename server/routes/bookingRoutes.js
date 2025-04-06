const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  getProviderBookings
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/me').get(protect, getMyBookings);
router.route('/provider').get(protect, authorize('provider', 'admin'), getProviderBookings);

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router
  .route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router; 