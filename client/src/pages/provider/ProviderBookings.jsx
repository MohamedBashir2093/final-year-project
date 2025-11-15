import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../lib/api';
import { Search, Calendar } from 'lucide-react';

const statusOptions = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, activeFilter, searchTerm, selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getProviderBookings();
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    // 1. Status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.status === activeFilter);
    }

    // 2. Search by customer name
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.user?.name?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 3. Date filter
    if (selectedDate) {
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.bookingDateTime).toISOString().split('T')[0];
        return bookingDate === selectedDate;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      console.error('Error updating booking status:', err);
      // You might want to show an error message to the user
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Bookings</h2>
        
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search by Customer Name */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors md:w-48"
            >
              {statusOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg">No bookings match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map(booking => {
              const { date, time } = formatDateTime(booking.bookingDateTime);
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.service?.title || 'Service Unavailable'}</h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center flex-wrap">
                          <span className="font-medium mr-2">👤 Resident:</span>
                          {booking.user?.name || 'Unknown User'}
                        </p>
                        <p className="flex items-center flex-wrap">
                          <span className="font-medium mr-2">📅 Date:</span>
                          {date} at {time}
                        </p>
                        <p className="flex items-center flex-wrap">
                          <span className="font-medium mr-2">📍 Address:</span>
                          {booking.address || 'No address provided'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>

                  {booking.message && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Message:</span> {booking.message}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons based on status */}
                  {booking.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, 'in_progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        🚀 Start Job
                      </button>
                    </div>
                  )}

                  {booking.status === 'in_progress' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        ✅ Finish
                      </button>
                    </div>
                  )}

                  {['completed', 'cancelled'].includes(booking.status) && (
                    <div className="text-center py-2">
                      <span className={`font-medium ${getStatusColor(booking.status).includes('green') ? 'text-green-600' : 'text-gray-600'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;
