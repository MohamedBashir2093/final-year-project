import asyncHandler from '../middleware/asyncHandler.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { service: serviceId, bookingDateTime, duration, address, message } = req.body;

  // Get service and verify it exists
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Check if service is active
  if (!service.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Service is not available'
    });
  }

  // Calculate total price
  const totalPrice = service.priceType === 'hourly' 
    ? service.price * (duration || 1)
    : service.price;

  // Check provider availability
  const isAvailable = await Booking.checkAvailability(
    service.provider,
    bookingDateTime,
    duration
  );

  if (!isAvailable) {
    return res.status(400).json({
      success: false,
      message: 'Provider is not available at the selected time'
    });
  }

  // Create booking
  const booking = await Booking.create({
    service: serviceId,
    user: req.user.id,
    provider: service.provider,
    bookingDateTime,
    duration: duration || 1,
    totalPrice,
    address,
    message
  });

  await booking.populate('service', 'title category price priceType');
  await booking.populate('user', 'name avatar phone');
  await booking.populate('provider', 'name avatar phone');

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings for user
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('service', 'title category images')
    .populate('provider', 'name avatar rating')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get all bookings for provider
// @route   GET /api/bookings/my-services
// @access  Private
export const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user.id })
    .populate('service', 'title category')
    .populate('user', 'name avatar phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service', 'title category price priceType images')
    .populate('user', 'name avatar phone email')
    .populate('provider', 'name avatar phone email rating');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Make sure user is booking owner or provider
  if (booking.user._id.toString() !== req.user.id && 
      booking.provider._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking'
    });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = asyncHandler(async (req, res) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this booking'
    });
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check authorization
  const isProvider = booking.provider.toString() === req.user.id;
  const isUser = booking.user.toString() === req.user.id;

  if (!isProvider && !isUser) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this booking'
    });
  }

  // Status transition rules
  if (status === 'cancelled' && !isUser && !isProvider) {
    return res.status(403).json({
      success: false,
      message: 'Only user or provider can cancel booking'
    });
  }

  if (['confirmed', 'in_progress', 'completed'].includes(status) && !isProvider) {
    return res.status(403).json({
      success: false,
      message: 'Only provider can update status to confirmed, in progress, or completed'
    });
  }

  booking.status = status;
  await booking.save();

  await booking.populate('service', 'title category');
  await booking.populate('user', 'name avatar');
  await booking.populate('provider', 'name avatar');

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Add review to completed booking
// @route   POST /api/bookings/:id/review
// @access  Private
export const addBookingReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if booking is completed
  if (booking.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Can only review completed bookings'
    });
  }

  // Check if user is the one who booked
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to review this booking'
    });
  }

  // Check if already reviewed
  if (booking.userRating) {
    return res.status(400).json({
      success: false,
      message: 'Booking already reviewed'
    });
  }

  booking.userRating = rating;
  booking.userReview = review;
  await booking.save();

  // Update provider rating
  await updateProviderRating(booking.provider);

  res.status(200).json({
    success: true,
    data: booking
  });
});

// Helper function to update provider rating
const updateProviderRating = async (providerId) => {
  const result = await Booking.aggregate([
    {
      $match: {
        provider: providerId,
        userRating: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$provider',
        averageRating: { $avg: '$userRating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await User.findByIdAndUpdate(providerId, {
      rating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  }
};