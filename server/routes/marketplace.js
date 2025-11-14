import express from 'express';
import {
  getMarketplaceItems,
  getMarketplaceItem,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMyMarketplaceItems,
  updateItemStatus
} from '../controllers/marketplaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

import upload from '../middleware/fileUpload.js';

router.route('/')
  .get(getMarketplaceItems)
  .post(protect, upload, createMarketplaceItem);

router.get('/my-items', protect, getMyMarketplaceItems);

router.route('/:id')
  .get(getMarketplaceItem)
  .put(protect, updateMarketplaceItem)
  .delete(protect, deleteMarketplaceItem);

router.put('/:id/status', protect, updateItemStatus);

export default router;