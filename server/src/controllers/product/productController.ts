import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../../models/product/product';
import logger from '../../utils/logger';

/**
 * Create a new product
 * @route POST /api/products
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = req.body;
    
    // Create a new product
    const product = await Product.create({
      ...productData,
      createdBy: productData.createdBy || 'admin',
    });

    logger.info(`Product created: ${product.name}`);
    return res.status(201).json({ 
      message: 'Product created successfully', 
      product
    });
  } catch (error) {
    logger.error(`Error creating product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all products with pagination and filtering
 * @route GET /api/products
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      category = '',
      brand = '',
      minPrice = '',
      maxPrice = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Prepare query
    const query: any = {};
    
    // Apply text search if provided
    if (search) {
      query.$text = { $search: String(search) };
    }
    
    // Apply category filter
    if (category) {
      query.categories = String(category);
    }
    
    // Apply brand filter
    if (brand) {
      query.brand = String(brand);
    }
    
    // Apply price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Prepare sort options
    const sortOptions: any = {};
    sortOptions[String(sortBy)] = sortOrder === 'asc' ? 1 : -1;
    
    // Handle pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
      
    const totalProducts = await Product.countDocuments(query);
    
    return res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      totalProducts,
    });
  } catch (error) {
    logger.error(`Error getting products: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    logger.error(`Error getting product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a product
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    logger.info(`Product updated: ${product.name}`);
    return res.status(200).json({ 
      message: 'Product updated successfully', 
      product 
    });
  } catch (error) {
    logger.error(`Error updating product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    logger.info(`Product deleted: ${product.name}`);
    return res.status(200).json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get unique brands and categories
 * @route GET /api/products/filters
 */
export const getProductFilters = async (req: Request, res: Response) => {
  try {
    const brands = await Product.distinct('brand').exec();
    const categories = await Product.distinct('categories').exec();
    
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]).exec();
    
    return res.status(200).json({
      brands: brands.filter(Boolean), // Remove null values
      categories: categories.filter(Boolean),
      priceRange: priceRange.length > 0 
        ? { min: priceRange[0].minPrice, max: priceRange[0].maxPrice }
        : { min: 0, max: 0 }
    });
  } catch (error) {
    logger.error(`Error getting product filters: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 