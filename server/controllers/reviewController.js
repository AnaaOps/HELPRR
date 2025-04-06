const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;

  // Check if there's a provider parameter
  if (req.query.provider) {
    query = Review.find({ provider: req.query.provider });
  } else {
    query = Review.find();
  }

  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate with user and provider information
  query = query.populate([
    { path: 'user', select: 'name' },
    { path: 'provider', select: 'name' }
  ]);

  // Execute query
  const reviews = await query;

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
    count: reviews.length,
    pagination,
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate([
    { path: 'user', select: 'name' },
    { path: 'provider', select: 'name' }
  ]);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if provider exists
  const provider = await Provider.findById(req.body.provider);
  if (!provider) {
    return next(
      new ErrorResponse(`No provider with the id of ${req.body.provider}`, 404)
    );
  }

  // Check if user has a completed booking with the provider
  const booking = await Booking.findOne({
    user: req.user.id,
    provider: req.body.provider,
    status: 'completed'
  });

  if (!booking && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You can only review providers after a completed service`,
        400
      )
    );
  }

  // Check if user already submitted a review for this provider
  const existingReview = await Review.findOne({
    user: req.user.id,
    provider: req.body.provider
  });

  if (existingReview) {
    return next(
      new ErrorResponse(
        `You have already submitted a review for this provider`,
        400
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401)
    );
  }

  // Update review
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Update provider average rating
  await updateProviderRating(review.provider);

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401)
    );
  }

  const providerId = review.provider;

  await review.remove();

  // Update provider average rating
  await updateProviderRating(providerId);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get reviews by provider
// @route   GET /api/providers/:providerId/reviews
// @access  Public
exports.getProviderReviews = asyncHandler(async (req, res, next) => {
  const provider = await Provider.findById(req.params.providerId);

  if (!provider) {
    return next(
      new ErrorResponse(`No provider with the id of ${req.params.providerId}`, 404)
    );
  }

  const reviews = await Review.find({ provider: req.params.providerId })
    .populate({ path: 'user', select: 'name' });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get reviews created by user
// @route   GET /api/reviews/user
// @access  Private
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({ path: 'provider', select: 'name' });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// Helper function to update provider average rating
const updateProviderRating = async (providerId) => {
  const provider = await Provider.findById(providerId);

  if (!provider) {
    return;
  }

  const reviews = await Review.find({ provider: providerId });
  
  // Calculate average rating
  if (reviews.length === 0) {
    provider.rating = 0;
    provider.reviewCount = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    provider.rating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to one decimal place
    provider.reviewCount = reviews.length;
  }

  await provider.save();
}; 