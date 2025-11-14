import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, bookingsAPI, authAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Calendar,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  MessageSquare,
  BarChart3
} from 'lucide-react';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesRes, bookingsRes, profileRes] = await Promise.all([
        servicesAPI.getMyServices(),
        bookingsAPI.getProviderBookings(),
        authAPI.getProfile()
      ]);

      const services = servicesRes.data.data || [];
      const bookings = bookingsRes.data.data || [];
      const profile = profileRes.data.data;

      // Calculate stats
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
      const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const averageRating = profile?.rating || 0;

      setStats({
        totalServices: services.length,
        totalBookings: bookings.length,
        completedBookings: completedBookings.length,
        totalRevenue,
        averageRating,
        pendingBookings: pendingBookings.length
      });

      // Get recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));

      // Get recent services (last 3)
      setRecentServices(services.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Services"
            value={stats.totalServices}
            icon={Briefcase}
            color="bg-blue-500"
            subtitle="Active listings"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="bg-green-500"
            subtitle={`${stats.pendingBookings} pending`}
          />
          <StatCard
            title="Completed"
            value={stats.completedBookings}
            icon={CheckCircle}
            color="bg-purple-500"
            subtitle="Successful bookings"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-yellow-500"
            subtitle="From completed services"
          />
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Rating</h3>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</span>
                <span className="text-gray-600">/ 5.0</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Based on completed services</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedBookings}</p>
              <p className="text-sm text-gray-600">reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <Link
                  to="/provider/bookings"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={booking.user.avatar || `https://ui-avatars.com/api/?name=${booking.user.name}&background=3B82F6&color=fff`}
                        alt={booking.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{booking.user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{booking.service.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(booking.bookingStart).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${booking.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h4>
                  <p className="text-gray-600">Your recent bookings will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Services</h3>
                <Link
                  to="/provider/services"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Manage services
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentServices.length > 0 ? (
                <div className="space-y-4">
                  {recentServices.map(service => (
                    <div key={service._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{service.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{service.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${service.price}</p>
                        <p className="text-xs text-gray-600">{service.priceType}</p>
                      </div>
                    </div>
                  ))}
                  {stats.totalServices > 3 && (
                    <div className="text-center pt-4">
                      <Link
                        to="/provider/services"
                        className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <span>View all {stats.totalServices} services</span>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No services listed</h4>
                  <p className="text-gray-600 mb-4">Start offering services to your community.</p>
                  <Link
                    to="/provider/services/new"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Service</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/provider/services/new"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Add New Service</span>
            </Link>
            <Link
              to="/provider/bookings"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Manage Bookings</span>
            </Link>
            <Link
              to="/provider/profile"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Update Profile</span>
            </Link>
            <Link
              to="/services"
              className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Eye className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Browse Services</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;