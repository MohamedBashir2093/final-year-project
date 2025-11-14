import asyncHandler from '../middleware/asyncHandler.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    priceType,
    provider,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = { isActive: true };

  // Category filter
   if (provider) {
    query.provider = provider;
  }

  // Search in title or description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Price type filter
  if (priceType) {
    query.priceType = priceType;
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;

  const services = await Service.find(query)
    .populate('provider', 'name avatar rating reviewCount')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Service.countDocuments(query);

  res.status(200).json({
    success: true,
    count: services.length,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    },
    data: services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate('provider', 'name avatar rating reviewCount bio phone')
    .populate('reviews.user', 'name avatar');

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Service Providers only)
export const createService = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.provider = req.user.id;

  // Check if user is a service provider
  if (req.user.role !== 'service_provider') {
    return res.status(403).json({
      success: false,
      message: 'Only service providers can create services'
    });
  }

  const service = await Service.create(req.body);

  await service.populate('provider', 'name avatar rating reviewCount');

  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Service Provider owner only)
export const updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Make sure user is service provider owner
  if (service.provider.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this service'
    });
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('provider', 'name avatar rating reviewCount');

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Service Provider owner only)
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Make sure user is service provider owner
  if (service.provider.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this service'
    });
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get services by provider
// @route   GET /api/services/provider/:providerId
// @access  Public
export const getServicesByProvider = asyncHandler(async (req, res) => {
  const services = await Service.find({ 
    provider: req.params.providerId,
    isActive: true 
  }).populate('provider', 'name avatar rating reviewCount');

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Add review to service
// @route   POST /api/services/:id/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Check if user has already reviewed this service
  const alreadyReviewed = service.reviews.find(
    review => review.user.toString() === req.user.id
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: 'Service already reviewed'
    });
  }

  // Check if user has booked this service
  const hasBooked = await Booking.findOne({
    service: req.params.id,
    user: req.user.id,
    status: 'completed'
  });

  if (!hasBooked) {
    return res.status(400).json({
      success: false,
      message: 'You can only review services you have booked and completed'
    });
  }

  const review = {
    user: req.user.id,
    rating: Number(rating),
    comment
  };

  service.reviews.push(review);
  service.rating = service.reviews.reduce((acc, item) => item.rating + acc, 0) / service.reviews.length;

  await service.save();

  await service.populate('reviews.user', 'name avatar');

  res.status(200).json({
    success: true,
    data: service.reviews
  });
});
export const getMyServices = asyncHandler(async (req, res) => {
  console.log('Logged-in user:', req.user);
  const services = await Service.find({ provider: req.user.id })
    .populate('provider', 'name avatar rating reviewCount')
    .sort({ createdAt: -1 });

  console.log('Services found:', services);

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});



