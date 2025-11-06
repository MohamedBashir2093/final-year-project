import React, { useState, useEffect } from 'react'
import { postsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, Heart, Share, MoreHorizontal, Image, Calendar } from 'lucide-react'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
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
    if (!newPost.trim()) return

    try {
      const response = await postsAPI.create({ content: newPost })
      setPosts(prev => [response.data, ...prev])
      setNewPost('')
    } catch (error) {
      console.error('Error creating post:', error)
    }
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
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-4">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
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
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button type="button" className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

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

                <button className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments?.length || 0}</span>
                </button>

                <button className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Share className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
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

export default Feed