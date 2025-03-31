import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  updateUserRole, 
  updateUserStatus, 
  updateUserProfile 
} from '../controllers/adminController';
import { admin, protectAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Debug middleware to log admin route access attempts
router.use((req, res, next) => {
  console.log(`Admin route access: ${req.method} ${req.originalUrl}`);
  console.log('Authorization headers:', {
    adminAuth: req.headers['adminauthorization'] || 'not provided',
    adminRole: req.headers['x-admin-role'] || 'not provided', 
    adminEmail: req.headers['x-admin-email'] || 'not provided'
  });
  next();
});

// Apply admin middlewares to all routes - first authenticate the admin, then check role
router.use(protectAdmin);
router.use(admin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/profile', updateUserProfile);

export default router; 