import express from 'express';
import {
  getMarketplaceItems,
  getMarketplaceItem,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMyMarketplaceItems,
  updateItemStatus,
  getMyMarketplaceItemsCount
} from '../controllers/marketplaceController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.route('/')
  .get(getMarketplaceItems)
  .post(protect, upload.array('images', 5), createMarketplaceItem);

router.get('/my-items', protect, getMyMarketplaceItems);
router.get('/my-items/count', protect, getMyMarketplaceItemsCount);

router.route('/:id')
  .get(getMarketplaceItem)
  .put(protect, updateMarketplaceItem)
  .delete(protect, deleteMarketplaceItem);

router.put('/:id/status', protect, updateItemStatus);

export default router;