import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'plumbing', 
      'electrical', 
      'cleaning', 
      'tutoring', 
      'gardening', 
      'carpentry',
      'painting',
      'moving',
      'pet_care',
      'beauty',
      'fitness',
      'other'
    ]
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['hourly', 'fixed', 'negotiable'],
    default: 'fixed'
  },
  availability: {
    type: String,
    default: 'Flexible'
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
serviceSchema.index({ provider: 1, createdAt: -1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ rating: -1, isActive: 1 });

// Static method to get average rating and save
serviceSchema.statics.getAverageRating = async function(serviceId) {
  const obj = await this.aggregate([
    {
      $match: { _id: serviceId }
    },
    {
      $unwind: '$reviews'
    },
    {
      $group: {
        _id: '$_id',
        averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Service').findByIdAndUpdate(serviceId, {
      rating: obj[0]?.averageRating || 0,
      reviewCount: obj[0]?.reviewCount || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
serviceSchema.post('save', function() {
  this.constructor.getAverageRating(this._id);
});

// Call getAverageRating after remove
serviceSchema.post('remove', function() {
  this.constructor.getAverageRating(this._id);
});

export default mongoose.model('Service', serviceSchema);