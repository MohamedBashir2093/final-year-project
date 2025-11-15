import express from 'express';
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBooking,
  updateBookingStatus,
  addBookingReview,
  updateBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/my-services', protect, getProviderBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking);

router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/review', protect, addBookingReview);

export default router;