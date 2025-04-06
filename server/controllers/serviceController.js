const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  let query = Service.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Service.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate virtual fields if needed
  if (req.query.populate) {
    query = query.populate('topProviders');
  }

  // Executing query
  const services = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: services.length,
    pagination,
    data: services,
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate('topProviders');

  if (!service) {
    return next(
      new ErrorResponse(`Service not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(
      new ErrorResponse(`Service not found with id of ${req.params.id}`, 404)
    );
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(
      new ErrorResponse(`Service not found with id of ${req.params.id}`, 404)
    );
  }

  await service.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get services by category
// @route   GET /api/services/category/:categoryName
// @access  Public
exports.getServicesByCategory = asyncHandler(async (req, res, next) => {
  const services = await Service.find({
    category: req.params.categoryName,
  }).sort('-rating');

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
exports.getPopularServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find({ isPopular: true })
    .sort('-rating')
    .limit(6);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
exports.getFeaturedServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find({ isFeatured: true })
    .sort('-createdAt')
    .limit(3);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
}); 