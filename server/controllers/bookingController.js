const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  // If user is not admin, they can only see their own bookings
  if (req.user.role !== 'admin') {
    query = Booking.find({ user: req.user.id });
  } else {
    query = Booking.find();
  }

  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Booking.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate with service, provider, and user details
  query = query.populate([
    { path: 'service', select: 'title category price' },
    { path: 'provider', select: 'name phone email' },
    { path: 'user', select: 'name email' }
  ]);

  // Execute query
  const bookings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate([
    { path: 'service', select: 'title category price' },
    { path: 'provider', select: 'name phone email' },
    { path: 'user', select: 'name email' }
  ]);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns booking or is admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Check if service exists
  const service = await Service.findById(req.body.service);
  if (!service) {
    return next(
      new ErrorResponse(`Service not found with id of ${req.body.service}`, 404)
    );
  }

  // Check if provider exists
  const provider = await Provider.findById(req.body.provider);
  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.body.provider}`, 404)
    );
  }

  // Check if provider offers this service
  const providerHasService = provider.services.some(
    s => s.service.toString() === req.body.service
  );

  if (!providerHasService) {
    return next(
      new ErrorResponse(
        `Provider ${req.body.provider} does not offer service ${req.body.service}`,
        400
      )
    );
  }

  // Add user id to req.body
  req.body.user = req.user.id;

  // Set initial status
  req.body.status = 'pending';

  // Create booking
  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns booking or is admin or is the provider
  const isProvider = booking.provider.toString() === req.user.id;
  const isUser = booking.user.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isUser && !isAdmin && !isProvider) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        401
      )
    );
  }

  // If user is provider, they can only update status
  if (isProvider && !isAdmin) {
    // Only allow updating status
    const allowedFields = ['status'];
    const requestedUpdates = Object.keys(req.body);
    
    const isValidOperation = requestedUpdates.every(update => 
      allowedFields.includes(update)
    );

    if (!isValidOperation) {
      return next(
        new ErrorResponse(
          `Providers can only update the booking status`,
          400
        )
      );
    }
  }

  // Update booking
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns booking or is admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this booking`,
        401
      )
    );
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get bookings for logged in user
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate([
    { path: 'service', select: 'title category price' },
    { path: 'provider', select: 'name phone email' }
  ]);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get bookings for provider
// @route   GET /api/bookings/provider
// @access  Private/Provider
exports.getProviderBookings = asyncHandler(async (req, res, next) => {
  // Get provider profile for logged in user
  const provider = await Provider.findOne({ user: req.user.id });

  if (!provider) {
    return next(
      new ErrorResponse(`No provider profile found for user ${req.user.id}`, 404)
    );
  }

  const bookings = await Booking.find({ provider: provider._id }).populate([
    { path: 'service', select: 'title category price' },
    { path: 'user', select: 'name email phone' }
  ]);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
}); 