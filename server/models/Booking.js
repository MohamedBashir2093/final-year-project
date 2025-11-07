import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingStart: {
    type: Date,
    required: [true, 'Please specify the booking start time']
  },
  duration: {
    type: Number, // in hours
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userReview: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  providerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  providerReview: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, createdAt: -1 });
bookingSchema.index({ service: 1, status: 1 });
bookingSchema.index({ date: 1, time: 1 });

// Static method to check for booking conflicts
bookingSchema.statics.checkAvailability = async function(providerId, bookingStart, duration = 1) {
  const bookingStartDate = new Date(bookingStart);

  const bookingEndDate = new Date(bookingStartDate);
  bookingEndDate.setHours(bookingStartDate.getHours() + duration);

  const conflictingBooking = await this.findOne({
    provider: providerId,
    status: { $in: ['confirmed', 'in_progress'] },
    bookingStart: {
      $lt: bookingEndDate
    },
    $expr: {
      $gt: [
        { $add: ["$bookingStart", { $multiply: ["$duration", 60 * 60 * 1000] }] },
        bookingStartDate
      ]
    }
  });

  return !conflictingBooking;
};

export default mongoose.model('Booking', bookingSchema);