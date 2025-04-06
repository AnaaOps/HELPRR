const Provider = require('../models/Provider');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Mock provider data for demo
const providers = [
    {
        id: '1',
        name: 'Emma Johnson',
        email: 'emma@example.com',
        phone: '123-456-7890',
        services: ['1'], // Hair Styling
        availability: 'Mon-Sat, 9AM-7PM',
        address: '789 Oak Street, City',
        rating: 4.8,
        reviewCount: 124,
        verified: true,
        isPremium: true,
        bio: 'Professional hair stylist with 10 years of experience in top salons.'
    },
    {
        id: '2',
        name: 'Michael Rodriguez',
        email: 'michael@example.com',
        phone: '234-567-8901',
        services: ['2'], // Plumbing Repair
        availability: 'Mon-Sun, 8AM-8PM',
        address: '456 Pine Avenue, Town',
        rating: 4.6,
        reviewCount: 92,
        verified: true,
        isPremium: false,
        bio: 'Licensed plumber with expertise in residential and commercial plumbing systems.'
    },
    {
        id: '3',
        name: 'David Chen',
        email: 'david@example.com',
        phone: '345-678-9012',
        services: ['3'], // Car Maintenance
        availability: 'Mon-Fri, 9AM-6PM',
        address: '123 Maple Drive, City',
        rating: 4.9,
        reviewCount: 156,
        verified: true,
        isPremium: true,
        bio: 'Certified mechanic with 15 years of experience in car maintenance and repair.'
    },
    {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        phone: '456-789-0123',
        services: ['4'], // Personal Driver
        availability: 'Mon-Sun, 24/7',
        address: '567 Cedar Lane, City',
        rating: 4.7,
        reviewCount: 83,
        verified: true,
        isPremium: false,
        bio: 'Professional driver with excellent knowledge of the city and safe driving record.'
    },
    {
        id: '5',
        name: 'James Wilson',
        email: 'james@example.com',
        phone: '567-890-1234',
        services: ['5'], // Meal Preparation
        availability: 'Mon-Sat, 10AM-8PM',
        address: '890 Birch Street, Town',
        rating: 4.9,
        reviewCount: 108,
        verified: true,
        isPremium: true,
        bio: 'Professional chef specializing in custom meal preparation and catering services.'
    },
    {
        id: '6',
        name: 'Lisa Martinez',
        email: 'lisa@example.com',
        phone: '678-901-2345',
        services: ['6'], // House Cleaning
        availability: 'Mon-Sun, 9AM-5PM',
        address: '321 Willow Way, City',
        rating: 4.5,
        reviewCount: 75,
        verified: true,
        isPremium: false,
        bio: 'Detail-oriented cleaning professional with eco-friendly cleaning solutions.'
    }
];

// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
exports.getProviders = asyncHandler(async (req, res, next) => {
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
  let query = Provider.find(JSON.parse(queryStr));

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
    query = query.sort('-rating');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Provider.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate virtual fields if needed
  if (req.query.populate) {
    query = query.populate('providerReviews');
  }

  // Executing query
  const providers = await query;

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
    count: providers.length,
    pagination,
    data: providers,
  });
});

// @desc    Get single provider
// @route   GET /api/providers/:id
// @access  Public
exports.getProvider = asyncHandler(async (req, res, next) => {
  const provider = await Provider.findById(req.params.id).populate('providerReviews');

  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: provider,
  });
});

// @desc    Create new provider
// @route   POST /api/providers
// @access  Private
exports.createProvider = asyncHandler(async (req, res, next) => {
  // Check if user already has a provider profile
  const existingProvider = await Provider.findOne({ user: req.user.id });

  if (existingProvider) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} already has a provider profile`,
        400
      )
    );
  }

  // Add user to req.body
  req.body.user = req.user.id;

  // Get user name
  const user = await User.findById(req.user.id);
  
  // Set provider name from user name
  if (!req.body.name) {
    req.body.name = user.name;
  }

  // Check if user role is provider
  if (user.role !== 'provider') {
    // Update user role to provider
    await User.findByIdAndUpdate(req.user.id, { role: 'provider' });
  }

  const provider = await Provider.create(req.body);

  res.status(201).json({
    success: true,
    data: provider,
  });
});

// @desc    Update provider
// @route   PUT /api/providers/:id
// @access  Private
exports.updateProvider = asyncHandler(async (req, res, next) => {
  let provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is provider owner or admin
  if (
    provider.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this provider`,
        401
      )
    );
  }

  provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: provider,
  });
});

// @desc    Delete provider
// @route   DELETE /api/providers/:id
// @access  Private
exports.deleteProvider = asyncHandler(async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is provider owner or admin
  if (
    provider.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this provider`,
        401
      )
    );
  }

  await provider.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get providers by service
// @route   GET /api/providers/service/:serviceId
// @access  Public
exports.getProvidersByService = asyncHandler(async (req, res, next) => {
  const providers = await Provider.find({
    'services.service': req.params.serviceId,
  }).sort('-rating');

  res.status(200).json({
    success: true,
    count: providers.length,
    data: providers,
  });
});

// @desc    Get top rated providers
// @route   GET /api/providers/top
// @access  Public
exports.getTopProviders = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 5;
  
  const providers = await Provider.find({
    isVerified: true,
  })
    .sort('-rating')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: providers.length,
    data: providers,
  });
});

// @desc    Add service to provider
// @route   PUT /api/providers/:id/services
// @access  Private
exports.addService = asyncHandler(async (req, res, next) => {
  let provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is provider owner
  if (provider.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this provider's services`,
        401
      )
    );
  }

  // Check if service already exists
  const serviceExists = provider.services.some(
    (service) => service.service.toString() === req.body.service
  );

  if (serviceExists) {
    return next(
      new ErrorResponse(`Service already added to this provider`, 400)
    );
  }

  provider.services.push(req.body);
  await provider.save();

  res.status(200).json({
    success: true,
    data: provider,
  });
});

// @desc    Remove service from provider
// @route   DELETE /api/providers/:id/services/:serviceId
// @access  Private
exports.removeService = asyncHandler(async (req, res, next) => {
  let provider = await Provider.findById(req.params.id);

  if (!provider) {
    return next(
      new ErrorResponse(`Provider not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is provider owner
  if (provider.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this provider's services`,
        401
      )
    );
  }

  // Check if service exists
  const serviceIndex = provider.services.findIndex(
    (service) => service.service.toString() === req.params.serviceId
  );

  if (serviceIndex === -1) {
    return next(
      new ErrorResponse(`Service not found for this provider`, 404)
    );
  }

  provider.services.splice(serviceIndex, 1);
  await provider.save();

  res.status(200).json({
    success: true,
    data: provider,
  });
}); 