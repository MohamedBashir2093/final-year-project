import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { authAPI, bookingsAPI, servicesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ProviderDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    activeServices: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Fetch bookings
        const bookingsResponse = await bookingsAPI.getProviderBookings();
        const bookings = bookingsResponse.data || [];

        // Fetch services
        const servicesResponse = await servicesAPI.getMyServices();
        const services = Array.isArray(servicesResponse) ? servicesResponse : servicesResponse.data || [];

        // Calculate stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const totalEarnings = bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const activeServices = services.filter(s => s.isActive !== false).length;
        const profileResponse = await authAPI.getProfile();
        const averageRating = profileResponse.data?.rating || 0;

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalEarnings,
          activeServices,
          averageRating
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  // Check if we're on a sub-route (services, bookings, profile)
  const isSubRoute = location.pathname.includes('/provider-dashboard/services') ||
                     location.pathname.includes('/provider-dashboard/bookings') ||
                     location.pathname.includes('/provider-dashboard/profile');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-20">
      <div className="max-w-7xl mx-auto">
        {!isSubRoute ? (
          <DashboardOverview stats={stats} loading={loading} user={user} />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

const DashboardOverview = ({ stats, loading, user }) => {
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's your business summary.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
            alt={user?.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! Here's your business summary.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="text-blue-500 text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Bookings</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
            <div className="text-yellow-500 text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed Bookings</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
            </div>
            <div className="text-green-500 text-3xl">✅</div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Services</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeServices}</p>
            </div>
            <div className="text-blue-500 text-3xl">🛠️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-purple-600">{stats.averageRating.toFixed(1)} ⭐</p>
            </div>
            <div className="text-purple-500 text-3xl">⭐</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NavLink
            to="services"
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span className="text-blue-500 text-2xl">📋</span>
            <div>
              <p className="font-semibold text-gray-900">Manage Services</p>
              <p className="text-sm text-gray-600">Add or edit your services</p>
            </div>
          </NavLink>

          <NavLink
            to="bookings"
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <span className="text-green-500 text-2xl">📅</span>
            <div>
              <p className="font-semibold text-gray-900">View Bookings</p>
              <p className="text-sm text-gray-600">Check your appointments</p>
            </div>
          </NavLink>

          <NavLink
            to="profile"
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <span className="text-purple-500 text-2xl">👤</span>
            <div>
              <p className="font-semibold text-gray-900">Update Profile</p>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
