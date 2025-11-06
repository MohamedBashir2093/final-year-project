import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add some content'],
    maxlength: [1000, 'Post cannot be more than 1000 characters']
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  type: {
    type: String,
    enum: ['general', 'event', 'alert', 'question'],
    default: 'general'
  },
  eventDate: {
    type: Date
  },
  location: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });

// Static method to get posts with pagination
postSchema.statics.getPosts = async function(page = 1, limit = 10, type = null) {
  const skip = (page - 1) * limit;
  let query = { isActive: true };
  
  if (type) {
    query.type = type;
  }

  const posts = await this.find(query)
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(query);

  return {
    posts,
    page,
    pages: Math.ceil(total / limit),
    total
  };
};

export default mongoose.model('Post', postSchema);