const express = require('express');
const router = express.Router({ mergeParams: true });

// Import controllers
const {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  getProvidersByService,
  getTopProviders,
  addService,
  removeService
} = require('../controllers/providerController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Include review router for nested routes
const reviewRouter = require('./reviewRoutes');

// Re-route into other resource routers
router.use('/:providerId/reviews', reviewRouter);

// Special routes
router.get('/top', getTopProviders);
router.get('/service/:serviceId', getProvidersByService);

// Standard CRUD routes
router.route('/')
  .get(getProviders)
  .post(protect, createProvider);

router.route('/:id')
  .get(getProvider)
  .put(protect, updateProvider)
  .delete(protect, deleteProvider);

// Services management routes
router.route('/:id/services')
  .put(protect, addService);

router.route('/:id/services/:serviceId')
  .delete(protect, removeService);

module.exports = router; 