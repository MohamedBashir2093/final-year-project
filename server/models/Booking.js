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
  bookingDateTime: {
    type: Date,
    required: [true, 'Please add a booking date and time']
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
    type: String,
    required: [true, 'Please add a service address']
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
bookingSchema.index({ bookingDateTime: 1 });

// Static method to check for booking conflicts
bookingSchema.statics.checkAvailability = async function(providerId, bookingDateTime, duration = 1) {
  const startTime = new Date(bookingDateTime);
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + duration);

  const conflictingBooking = await this.findOne({
    provider: providerId,
    status: { $in: ['confirmed', 'in_progress'] },
    $or: [
      {
        bookingDateTime: { $lt: endTime, $gte: startTime }
      },
      {
        $expr: {
          $and: [
            { $lt: ['$bookingDateTime', endTime] },
            { $gt: [{ $add: ['$bookingDateTime', { $multiply: ['$duration', 3600000] }] }, startTime] }
          ]
        }
      }
    ]
  });

  return !conflictingBooking;
};

export default mongoose.model('Booking', bookingSchema);