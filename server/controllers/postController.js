import asyncHandler from '../middleware/asyncHandler.js';
import Post from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const type = req.query.type || null;

  const result = await Post.getPosts(page, limit, type);

  res.status(200).json({
    success: true,
    count: result.posts.length,
    pagination: {
      page: result.page,
      pages: result.pages,
      total: result.total
    },
    data: result.posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar');

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  await post.populate('author', 'name avatar');

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Make sure user is post owner
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('author', 'name avatar');

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Make sure user is post owner
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if the post has already been liked
  if (post.likes.includes(req.user.id)) {
    return res.status(400).json({
      success: false,
      message: 'Post already liked'
    });
  }

  post.likes.push(req.user.id);
  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes
  });
});

// @desc    Unlike a post
// @route   PUT /api/posts/:id/unlike
// @access  Private
export const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if the post has not been liked
  if (!post.likes.includes(req.user.id)) {
    return res.status(400).json({
      success: false,
      message: 'Post has not been liked yet'
    });
  }

  post.likes = post.likes.filter(
    like => like.toString() !== req.user.id
  );
  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const newComment = {
    user: req.user.id,
    text
  };

  post.comments.unshift(newComment);
  await post.save();

  await post.populate('comments.user', 'name avatar');

  res.status(200).json({
    success: true,
    data: post.comments
  });
});

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Pull out comment
  const comment = post.comments.find(
    comment => comment._id.toString() === req.params.commentId
  );

  // Make sure comment exists
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  post.comments = post.comments.filter(
    comment => comment._id.toString() !== req.params.commentId
  );

  await post.save();

  res.status(200).json({
    success: true,
    data: post.comments
  });
});