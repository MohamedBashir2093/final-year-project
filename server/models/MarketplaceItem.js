import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'furniture',
      'electronics',
      'clothing',
      'sports',
      'home',
      'books',
      'vehicles',
      'other'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Please add condition'],
    enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    default: 'good'
  },
  images: [{
    type: String,
    required: [true, 'Please add at least one image']
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
marketplaceItemSchema.index({ seller: 1, createdAt: -1 });
marketplaceItemSchema.index({ category: 1, status: 1 });
marketplaceItemSchema.index({ price: 1, status: 1 });
marketplaceItemSchema.index({ tags: 1 });

// Static method to increment view count
marketplaceItemSchema.statics.incrementViewCount = async function(itemId) {
  await this.findByIdAndUpdate(itemId, { $inc: { viewCount: 1 } });
};

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);