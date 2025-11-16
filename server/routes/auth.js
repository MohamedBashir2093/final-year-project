import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  updateAvatar,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/me/avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/reset-password', resetPassword);

export default router;