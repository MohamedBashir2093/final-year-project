import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marketplaceAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, MapPin, Calendar, User, Heart, Share, MessageCircle, Phone } from 'lucide-react'

const MarketplaceItemDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItemDetails()
  }, [id])

  const fetchItemDetails = async () => {
    try {
      setLoading(true)
      const response = await marketplaceAPI.getById(id)
      setItem(response.data)
    } catch (err) {
      setError('Failed to load item details')
      console.error('Error fetching item details:', err)
    } finally {
      setLoading(false)
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'like_new': return 'bg-blue-100 text-blue-800'
      case 'good': return 'bg-yellow-100 text-yellow-800'
      case 'fair': return 'bg-orange-100 text-orange-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCondition = (condition) => {
    return condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Marketplace
        </button>
      </div>
    )
  }

  const isOwner = user && item.seller && user._id === item.seller._id

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          {item.images && item.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              <img
                src={`http://localhost:5000${item.images[0]}`}
                alt={item.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${image}`}
                      alt={`${item.title} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Share className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-blue-600">${item.price}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                {formatCondition(item.condition)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Item Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Listed</span>
              </div>
              <p className="text-gray-700">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Category</span>
              </div>
              <p className="text-gray-700 capitalize">{item.category.replace('_', ' ')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Quantity</span>
              </div>
              <p className="text-gray-700">{item.quantity}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center space-x-4">
              <img
                src={item.seller?.avatar ? `http://localhost:5000${item.seller.avatar}` : `https://ui-avatars.com/api/?name=${item.seller?.name}&background=3B82F6&color=fff`}
                alt={item.seller?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{item.seller?.name}</p>
                <p className="text-sm text-gray-600">Seller</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwner && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Seller</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <a href={`mailto:${item.seller?.email}`} className="text-blue-600 hover:underline">{item.seller?.email}</a>
                  </div>
                  {item.seller?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <a href={`tel:${item.seller?.phone}`} className="text-blue-600 hover:underline">{item.seller?.phone}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">This is your listing</p>
              <p className="text-blue-600 text-sm mt-1">Manage your item from your dashboard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketplaceItemDetails