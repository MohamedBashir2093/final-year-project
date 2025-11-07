import React, { useState, useEffect } from 'react'
import { servicesAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Star, User, Calendar, MessageSquare } from 'lucide-react'

const ProviderReviews = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchServicesWithReviews()
  }, [])

  const fetchServicesWithReviews = async () => {
    try {
      const response = await servicesAPI.getMyServices()
      const servicesWithReviews = (response.data || []).filter(service => 
        service.reviews && service.reviews.length > 0
      )
      setServices(servicesWithReviews)
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const allReviews = services.flatMap(service => 
    service.reviews.map(review => ({
      ...review,
      serviceTitle: service.title,
      serviceCategory: service.category
    }))
  )

  const overallRating = allReviews.length > 0 
    ? (allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length).toFixed(1)
    : 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-2">Customer feedback for your services</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <span className={`text-3xl font-bold ${getRatingColor(overallRating)}`}>
              {overallRating}
            </span>
          </div>
          <p className="text-gray-600">Overall Rating</p>
          <p className="text-sm text-gray-500">{allReviews.length} reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {services.length}
          </div>
          <p className="text-gray-600">Services with Reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {user.rating || 0}
          </div>
          <p className="text-gray-600">Your Provider Rating</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {allReviews.length > 0 ? (
          allReviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name}&background=3B82F6&color=fff`}
                      alt={review.user?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.user?.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                      {review.serviceCategory}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{review.serviceTitle}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{review.rating}.0</span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">Customer Feedback</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Reviews from your customers will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderReviews