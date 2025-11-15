import React, { useState, useEffect } from 'react'
import { bookingsAPI, postsAPI, marketplaceAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Edit3, MapPin, Phone, Mail, Calendar, Star, Settings, LogOut, Heart, MessageCircle, ShoppingBag } from 'lucide-react'

const ResidentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    postsCount: 0,
    totalBookings: 0,
    marketplaceItems: 0
  })
  const [recentBooking, setRecentBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)

        // Fetch user's bookings
        const bookingsResponse = await bookingsAPI.getMyBookings()
        const bookings = bookingsResponse.data || []

        // Fetch posts count
        const postsCountResponse = await postsAPI.getMyPostsCount();
        const postsCount = postsCountResponse.data || 0;

        // Fetch marketplace items count
        const marketplaceItemsCountResponse = await marketplaceAPI.getMyItemsCount();
        const marketplaceItems = marketplaceItemsCountResponse.data || 0;

        // Calculate stats
        const totalBookings = bookings.length
        const mostRecentBooking = bookings.length > 0 ? bookings[0] : null;

        setStats({
          postsCount,
          totalBookings,
          marketplaceItems
        })
        setRecentBooking(mostRecentBooking);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=ffffff&color=3B82F6&size=80`}
            alt={user?.name}
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 mt-1">Here's your community activity overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Posts Made"
          value={stats.postsCount}
          icon={MessageCircle}
          color="bg-blue-500"
          subtitle="Community posts"
        />

        <StatsCard
          title="Active Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="bg-green-500"
          subtitle="Current services"
        />

        <StatsCard
          title="Marketplace Items"
          value={stats.marketplaceItems}
          icon={ShoppingBag}
          color="bg-purple-500"
          subtitle="Items posted"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/feed"
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <MessageCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900">View Feed</p>
              <p className="text-sm text-gray-600">See community posts</p>
            </div>
          </a>

          <a
            href="/services"
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <Star className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900">Find Services</p>
              <p className="text-sm text-gray-600">Book local help</p>
            </div>
          </a>

          <a
            href="/marketplace"
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
          >
            <ShoppingBag className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900">Marketplace</p>
              <p className="text-sm text-gray-600">Buy & sell locally</p>
            </div>
          </a>

          <a
            href="/profile"
            className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
          >
            <Settings className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900">My Profile</p>
              <p className="text-sm text-gray-600">Manage account</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentBooking ? (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {recentBooking.status === 'completed' ? 'Service Completed' : 'New Booking'}
                </p>
                <p className="text-sm text-gray-600">
                  {recentBooking.service?.title || 'Service'} with {recentBooking.provider?.name || 'Unknown Provider'}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(recentBooking.createdAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Start exploring services to see your activity here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResidentDashboard