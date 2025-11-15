import React, { useState, useEffect } from 'react'
import { bookingsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Calendar, MapPin, Clock, DollarSign, User, MessageSquare, X, RefreshCw, Star } from 'lucide-react'
import RescheduleBookingModal from '../components/RescheduleBookingModal'
import LeaveReviewModal from '../components/LeaveReviewModal'

const ResidentBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingsAPI.getMyBookings()
      const bookingData = response.data || []
      setBookings(bookingData)
      setFilteredBookings(bookingData)
    } catch (err) {
      setError('Failed to load bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = (filter) => {
    setActiveFilter(filter)
    if (filter === 'all') {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filter))
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingsAPI.updateStatus(bookingId, 'cancelled')
      setBookings(prev => prev.map(booking =>
        booking._id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      ))
    } catch (err) {
      console.error('Error cancelling booking:', err)
    }
  }

  const handleRescheduleBooking = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

 
  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    fetchBookings();
  };
 
  const handleRescheduleSuccess = () => {
    fetchBookings()
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

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.replace('_', ' ')
  }

  const canCancel = (status) => ['pending', 'confirmed'].includes(status)
  const canReschedule = (status) => ['pending', 'confirmed'].includes(status)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const filterOptions = [
    { key: 'all', label: 'All Bookings', count: bookings.length },
    { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { key: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {isModalOpen && (
        <RescheduleBookingModal
          booking={selectedBooking}
          onClose={() => setIsModalOpen(false)}
          onReschedule={handleRescheduleSuccess}
        />
      )}
      {isModalOpen && (
        <RescheduleBookingModal
          booking={selectedBooking}
          onClose={() => setIsModalOpen(false)}
          onReschedule={handleRescheduleSuccess}
        />
      )}
      {isReviewModalOpen && (
        <LeaveReviewModal
          booking={selectedBooking}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewSubmit={handleReviewSuccess}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your service bookings</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map(option => (
            <button
              key={option.key}
              onClick={() => filterBookings(option.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === option.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{option.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilter === option.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 text-7xl mb-6">📅</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {activeFilter === 'all' ? 'No bookings yet' : `No ${activeFilter.replace('_', ' ')} bookings`}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {activeFilter === 'all'
              ? "You haven't booked any services yet. Browse our services to find local help!"
              : `You don't have any ${activeFilter.replace('_', ' ')} bookings.`
            }
          </p>
          {activeFilter === 'all' && (
            <a
              href="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md"
            >
              Browse Services
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const bookingDate = booking.bookingDateTime ? new Date(booking.bookingDateTime) : null
            const formattedDate = bookingDate ? bookingDate.toLocaleDateString() : 'Date not set'
            const formattedTime = bookingDate ? bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

            return (
              <div key={booking._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-8 border border-gray-100 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {booking.service?.title || 'Service Unavailable'}
                      </h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Provider:</span>
                        <span className="text-gray-900">{booking.provider?.name || 'Unknown'}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Date:</span>
                        <span className="text-gray-900">{formattedDate} {formattedTime && `at ${formattedTime}`}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Location:</span>
                        <span className="text-gray-900">{booking.address || 'Address not specified'}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Price:</span>
                        <span className="text-xl font-bold text-gray-900">${booking.totalPrice || '0'}</span>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-900">Your Message</span>
                        </div>
                        <p className="text-blue-800 italic">"{booking.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                {(canCancel(booking.status) || canReschedule(booking.status)) && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    {canReschedule(booking.status) && (
                      <button
                        onClick={() => handleRescheduleBooking(booking)}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {canCancel(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                )}

                {booking.status === 'completed' && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 text-lg mb-1">✅</div>
                      <span className="text-green-800 font-semibold">Service Completed Successfully</span>
                    </div>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => handleOpenReviewModal(booking)}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
                      >
                        <Star className="w-5 h-5" />
                        <span>Leave a Review</span>
                      </button>
                    </div>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-red-600 text-lg mb-1">❌</div>
                      <span className="text-red-800 font-semibold">Booking Cancelled</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ResidentBookings