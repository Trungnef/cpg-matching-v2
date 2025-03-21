import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  updateUserRole, 
  updateUserStatus 
} from '../controllers/adminController';
import { admin } from '../middleware/authMiddleware';

const router = express.Router();

// Apply admin middleware to all routes
router.use(admin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);

export default router; 