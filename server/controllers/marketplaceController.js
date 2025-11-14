import asyncHandler from '../middleware/asyncHandler.js';
import MarketplaceItem from '../models/MarketplaceItem.js';

// @desc    Get all marketplace items
// @route   GET /api/marketplace
// @access  Public
export const getMarketplaceItems = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    condition,
    page = 1,
    limit = 12,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = { isActive: true, status: 'available' };

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
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

  // Condition filter
  if (condition) {
    query.condition = condition;
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;

  const items = await MarketplaceItem.find(query)
    .populate('seller', 'name avatar rating')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await MarketplaceItem.countDocuments(query);

  res.status(200).json({
    success: true,
    count: items.length,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    },
    data: items
  });
});

// @desc    Get single marketplace item
// @route   GET /api/marketplace/:id
// @access  Public
export const getMarketplaceItem = asyncHandler(async (req, res) => {
  const item = await MarketplaceItem.findById(req.params.id)
    .populate('seller', 'name avatar rating phone');

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Increment view count
  await MarketplaceItem.incrementViewCount(req.params.id);

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Create new marketplace item
// @route   POST /api/marketplace
// @access  Private
export const createMarketplaceItem = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.seller = req.user.id;

  if (req.files) {
    req.body.images = req.files.map(file => file.path);
  }

  const item = await MarketplaceItem.create(req.body);

  await item.populate('seller', 'name avatar rating');

  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Update marketplace item
// @route   PUT /api/marketplace/:id
// @access  Private
export const updateMarketplaceItem = asyncHandler(async (req, res) => {
  let item = await MarketplaceItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is item owner
  if (item.seller.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  item = await MarketplaceItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('seller', 'name avatar rating');

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete marketplace item
// @route   DELETE /api/marketplace/:id
// @access  Private
export const deleteMarketplaceItem = asyncHandler(async (req, res) => {
  const item = await MarketplaceItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is item owner
  if (item.seller.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's marketplace items
// @route   GET /api/marketplace/my-items
// @access  Private
export const getMyMarketplaceItems = asyncHandler(async (req, res) => {
  const items = await MarketplaceItem.find({ seller: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Update item status
// @route   PUT /api/marketplace/:id/status
// @access  Private
export const updateItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'pending', 'sold'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  let item = await MarketplaceItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Make sure user is item owner
  if (item.seller.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  item.status = status;
  await item.save();

  res.status(200).json({
    success: true,
    data: item
  });
});