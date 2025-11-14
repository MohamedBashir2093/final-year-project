import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../lib/api';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getProviderBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
      <ul>
        {upcomingBookings.map(booking => (
          <li key={booking._id} className="border p-4 mb-4 rounded">
            <p>Service: {booking.service.title}</p>
            <p>Resident: {booking.customer.name}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'pending' && (
              <>
                <button onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Confirm</button>
                <button onClick={() => handleUpdateBookingStatus(booking._id, 'canceled')} className="bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Completed Bookings</h2>
      <ul>
        {completedBookings.map(booking => (
          <li key={booking._id} className="border p-4 mb-4 rounded">
            <p>Service: {booking.service.title}</p>
            <p>Resident: {booking.customer.name}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
            <p>Status: {booking.status}</p>
            {booking.review && (
              <div className="mt-2">
                <h4 className="font-bold">Rating: {booking.review.rating}/5</h4>
                <p>Review: {booking.review.comment}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderBookings;
