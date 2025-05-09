import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductFilters
} from '../../controllers/product/productController';
import catalogRoutes from './catalog';

const router = express.Router();

// Validation middleware for creating/updating a product
const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array of strings'),
];

// Routes
router.get('/filters', getProductFilters);
router.post('/', validateProduct, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

// Mount catalog routes
router.use('/catalog', catalogRoutes);

export default router; 