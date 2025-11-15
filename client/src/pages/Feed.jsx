import React, { useState, useEffect } from 'react'
import { postsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, Heart, Share, Image, Calendar, Trash2, Edit3 } from 'lucide-react'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [postImage, setPostImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentInputs, setCommentInputs] = useState({})
  const [showComments, setShowComments] = useState({})
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll()
      setPosts(response.data || []) // Fixed: response.data instead of direct array
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([]) // Ensure posts is always an array
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim() && !postImage) return

    try {
      const formData = new FormData()
      formData.append('content', newPost)
      if (postImage) {
        formData.append('image', postImage)
      }

      const response = await postsAPI.create(formData)
      setPosts(prev => [response.data, ...prev])
      setNewPost('')
      setPostImage(null) // Clear selected image
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleImageChange = (e) => {
    setPostImage(e.target.files[0])
  }

  const handleLike = async (postId) => {
    try {
      await postsAPI.like(postId)
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: [...(post.likes || []), user._id],
              isLiked: true 
            }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleUnlike = async (postId) => {
    try {
      await postsAPI.unlike(postId)
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? {
              ...post,
              likes: (post.likes || []).filter(like => like.toString() !== user._id),
              isLiked: false
            }
          : post
      ))
    } catch (error) {
      console.error('Error unliking post:', error)
    }
  }

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return

    try {
      const response = await postsAPI.addComment(postId, commentText)
      const newComment = response.data;

      // Ensure the author field is populated for immediate rendering
      // If newComment.author is an ID string, or an object without a name property, replace it with the full user object.
      if (typeof newComment.author === 'string' || !newComment.author?.name) {
        newComment.author = user;
      }
      
      // Ensure createdAt is present for immediate timestamp rendering
      if (!newComment.createdAt) {
        newComment.createdAt = new Date().toISOString();
      }

      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      ))
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await postsAPI.deleteComment(postId, commentId)
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, comments: (post.comments || []).filter(comment => comment._id !== commentId) }
          : post
      ))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsAPI.delete(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  }

  const handleUpdatePost = async (updatedContent) => {
    if (!editingPost || !updatedContent.trim()) return;

    try {
      const response = await postsAPI.update(editingPost._id, { content: updatedContent });
      setPosts(prev => prev.map(post =>
        post._id === editingPost._id ? response.data : post
      ));
      setIsEditModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {isEditModalOpen && (
        <EditPostModal
          post={editingPost}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdatePost}
        />
      )}
      {/* Create Post */}
      {user?.role === 'resident' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex space-x-4">
            <img
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <form onSubmit={handleCreatePost} className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with your neighborhood..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="3"
              />
              <div className="flex flex-col space-y-4 mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {postImage && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(postImage)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPostImage(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {/* These buttons can be re-purposed or removed if not needed */}
                    <button type="button" className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Calendar className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim() && !postImage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = post.likes?.some(like => like.toString() === user?._id) || false
          
          return (
            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex space-x-3">
                  <img
                    src={post.author?.avatar ? `http://localhost:5000${post.author.avatar}` : `https://ui-avatars.com/api/?name=${post.author?.name}&background=3B82F6&color=fff`}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just posted'}
                    </p>
                  </div>
                </div>
                {post.author?._id === user?._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <img
                  src={`http://localhost:5000${post.image}`}
                  alt="Post content"
                  className="w-full max-w-md h-auto rounded-lg mb-4"
                />
              )}

              {/* Post Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => isLiked ? handleUnlike(post._id) : handleLike(post._id)}
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
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments?.length || 0}</span>
                </button>

                <button className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Share className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Add Comment Form */}
                  <div className="flex space-x-3 mb-4">
                    <img
                      src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post._id, commentInputs[post._id] || '')
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post._id, commentInputs[post._id] || '')}
                        disabled={!commentInputs[post._id]?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments?.map((comment) => (
                      <div key={comment._id} className="flex space-x-3">
                        <img
                          src={comment.author?.avatar ? `http://localhost:5000${comment.author.avatar}` : `https://ui-avatars.com/api/?name=${comment.author?.name}&background=3B82F6&color=fff`}
                          alt={comment.author?.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-semibold text-sm text-gray-900">{comment.author?.name}</span>
                                <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
                              </div>
                              {comment.author?._id === user?._id && (
                                <button
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                  className="text-gray-400 hover:text-red-600 text-sm ml-2"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share something with your neighborhood!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const EditPostModal = ({ post, onClose, onSave }) => {
  const [content, setContent] = useState(post?.content || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSave(content);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your post content..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows="5"
              required
            />
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !content.trim()}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feed
