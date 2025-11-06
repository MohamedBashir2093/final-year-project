import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByProvider,
  addReview
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('service_provider'), createService);

router.route('/:id')
  .get(getService)
  .put(protect, updateService)
  .delete(protect, deleteService);

router.get('/provider/:providerId', getServicesByProvider);
router.post('/:id/reviews', protect, addReview);

export default router;