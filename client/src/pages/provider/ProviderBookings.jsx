import React, { useState, useEffect } from 'react';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // API call to fetch bookings
    const fetchBookings = async () => {
      // a fake API call
      const response = [
        { id: 1, service: 'Service 1', resident: 'Resident 1', date: '2024-12-01', time: '10:00', status: 'pending', review: null },
        { id: 2, service: 'Service 2', resident: 'Resident 2', date: '2024-12-02', time: '14:00', status: 'confirmed', review: null },
        { id: 3, service: 'Service 3', resident: 'Resident 3', date: '2024-11-20', time: '16:00', status: 'completed', review: { rating: 5, comment: 'Great service!' } },
        { id: 4, service: 'Service 4', resident: 'Resident 4', date: '2024-11-25', time: '11:00', status: 'canceled', review: null },
      ];
      setBookings(response);
    };

    fetchBookings();
  }, []);

  const handleUpdateBookingStatus = (id, status) => {
    // API call to update booking status
    console.log(`Updating booking ${id} to ${status}`);
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
      <ul>
        {upcomingBookings.map(booking => (
          <li key={booking.id} className="border p-4 mb-4 rounded">
            <p>Service: {booking.service}</p>
            <p>Resident: {booking.resident}</p>
            <p>Date: {booking.date} at {booking.time}</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'pending' && (
              <>
                <button onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Confirm</button>
                <button onClick={() => handleUpdateBookingStatus(booking.id, 'canceled')} className="bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Completed Bookings</h2>
      <ul>
        {completedBookings.map(booking => (
          <li key={booking.id} className="border p-4 mb-4 rounded">
            <p>Service: {booking.service}</p>
            <p>Resident: {booking.resident}</p>
            <p>Date: {booking.date} at {booking.time}</p>
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
