import express from 'express';
import { body } from 'express-validator';
import {
  getCrawledProducts,
  getCrawledProductById,
  updateCrawledProduct,
  deleteCrawledProduct,
  getCrawledProductFilters
} from '../../controllers/product/crawledProductController';

const router = express.Router();

// Validation middleware for updating a crawled product
const validateCrawledProduct = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Product name is required')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('pricePerUnit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price per unit must be a positive number'),
  body('minimumOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),
  body('dailyCapacity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Daily capacity must be a positive integer'),
  body('currentAvailableStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available stock must be a positive integer'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array of strings'),
  body('productCategoryId')
    .optional()
    .isString()
    .withMessage('Product category ID must be a string'),
];

// Routes
router.get('/filters', getCrawledProductFilters);
router.get('/', getCrawledProducts);
router.get('/:id', getCrawledProductById);
router.put('/:id', validateCrawledProduct, updateCrawledProduct);
router.delete('/:id', deleteCrawledProduct);

export default router; 