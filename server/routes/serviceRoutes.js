const express = require('express');
const router = express.Router();

// Import controllers
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getPopularServices,
  getFeaturedServices
} = require('../controllers/serviceController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Include provider router for nested routes
const providerRouter = require('./providerRoutes');

// Re-route into other resource routers
router.use('/:serviceId/providers', providerRouter);

// Special routes
router.get('/popular', getPopularServices);
router.get('/featured', getFeaturedServices);
router.get('/category/:categoryName', getServicesByCategory);

// Standard CRUD routes
router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('admin'), updateService)
  .delete(protect, authorize('admin'), deleteService);

module.exports = router; 