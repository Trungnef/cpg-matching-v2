import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/', registerUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router; 