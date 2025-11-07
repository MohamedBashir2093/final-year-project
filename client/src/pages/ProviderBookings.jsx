import React, { useState, useEffect } from 'react'
import { bookingsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Calendar, Clock, User, Check, X, Clock4, Star, MapPin } from 'lucide-react'

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getProviderBookings()
      setBookings(response.data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status)
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusActions = (status) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm', status: 'confirmed', color: 'bg-green-600 hover:bg-green-700' },
          { label: 'Decline', status: 'cancelled', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'confirmed':
        return [
          { label: 'Start Work', status: 'in_progress', color: 'bg-purple-600 hover:bg-purple-700' }
        ]
      case 'in_progress':
        return [
          { label: 'Complete', status: 'completed', color: 'bg-green-600 hover:bg-green-700' }
        ]
      default:
        return []
    }
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
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage bookings for your services</p>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.map(booking => {
          const actions = getStatusActions(booking.status)
          
          return (
            <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.service?.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={booking.user?.avatar || `https://ui-avatars.com/api/?name=${booking.user?.name}&background=3B82F6&color=fff`}
                      alt={booking.user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{booking.user?.name}</p>
                      <p className="text-sm text-gray-500">{booking.user?.phone}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time} ({booking.duration} hour{booking.duration > 1 ? 's' : ''})</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.address?.street || 'Address not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Total: ${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Message */}
                  {booking.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Customer note: </span>
                        {booking.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  {actions.map(action => (
                    <button
                      key={action.status}
                      onClick={() => updateBookingStatus(booking._id, action.status)}
                      className={`px-4 py-2 text-white rounded-lg transition-colors ${action.color}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Completed Booking Review */}
              {booking.status === 'completed' && booking.userRating && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900">Customer Review</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-yellow-600">{booking.userRating}</span>
                    <span className="text-gray-600">/ 5</span>
                  </div>
                  {booking.userReview && (
                    <p className="text-sm text-gray-600">{booking.userReview}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">When residents book your services, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderBookings