import React, { useState } from 'react';
import { postsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Heart, Share, MoreHorizontal } from 'lucide-react';

const Post = ({ post, onLike, onUnlike }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const isLiked = post.likes?.some(like => like.toString() === user?._id) || false;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await postsAPI.addComment(post._id, newComment);
      setComments(response.data);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-3">
          <img
            src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=3B82F6&color=fff`}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          onClick={() => (isLiked ? onUnlike(post._id) : onLike(post._id))}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-600 bg-red-50'
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length}</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment._id} className="flex space-x-2">
                <img
                  src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=3B82F6&color=fff`}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p className="font-semibold text-sm">{comment.user?.name}</p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
