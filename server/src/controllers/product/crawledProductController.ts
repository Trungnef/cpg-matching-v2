import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CrawledProduct } from '../../models/product';
import logger from '../../utils/logger';

/**
 * Get all crawled products with pagination and filtering
 * @route GET /api/catalog/products
 */
export const getCrawledProducts = async (req: Request, res: Response) => {
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
    const products = await CrawledProduct.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
      
    const totalProducts = await CrawledProduct.countDocuments(query);
    
    return res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      totalProducts,
    });
  } catch (error) {
    logger.error(`Error getting crawled products: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a crawled product by ID
 * @route GET /api/catalog/products/:id
 */
export const getCrawledProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await CrawledProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    logger.error(`Error getting crawled product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a crawled product
 * @route PUT /api/catalog/products/:id
 */
export const updateCrawledProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process updateData to handle any special types or conversions
    // Convert string numbers to actual numbers
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.pricePerUnit !== undefined) {
      updateData.pricePerUnit = Number(updateData.pricePerUnit);
    }
    if (updateData.currentAvailableStock !== undefined) {
      updateData.currentAvailableStock = Number(updateData.currentAvailableStock);
    }
    if (updateData.minimumOrderQuantity !== undefined) {
      updateData.minimumOrderQuantity = Number(updateData.minimumOrderQuantity);
    }
    if (updateData.dailyCapacity !== undefined) {
      updateData.dailyCapacity = Number(updateData.dailyCapacity);
    }
    
    // Handle null values and empty strings properly
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null) {
        if (['price', 'pricePerUnit', 'currentAvailableStock', 'minimumOrderQuantity', 'dailyCapacity'].includes(key)) {
          updateData[key] = undefined;
        }
      }
    });
    
    logger.info(`Updating crawled product: ${id} with data:`, updateData);
    
    const product = await CrawledProduct.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    logger.info(`Crawled product updated: ${product.name}`);
    return res.status(200).json({ 
      message: 'Product updated successfully', 
      product 
    });
  } catch (error: any) {
    logger.error(`Error updating crawled product: ${error.message || error}`);
    
    // Send more detailed error information to help with debugging
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid data format', 
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    });
  }
};

/**
 * Delete a crawled product
 * @route DELETE /api/catalog/products/:id
 */
export const deleteCrawledProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await CrawledProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    logger.info(`Crawled product deleted: ${product.name}`);
    return res.status(200).json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting crawled product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get unique brands, categories and price range for crawled products
 * @route GET /api/catalog/products/filters
 */
export const getCrawledProductFilters = async (req: Request, res: Response) => {
  try {
    const brands = await CrawledProduct.distinct('brand').exec();
    const categories = await CrawledProduct.distinct('categories').exec();
    
    const priceRange = await CrawledProduct.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' }
        }
      }
    ]);
    
    return res.status(200).json({
      brands: brands.filter(Boolean), // Filter out null/empty values
      categories: categories.filter(Boolean).flat(), // Flatten nested arrays and filter out null/empty
      priceRange: priceRange.length > 0 
        ? { 
            min: Math.floor(priceRange[0].min || 0), 
            max: Math.ceil(priceRange[0].max || 1000)
          }
        : { min: 0, max: 1000 }
    });
  } catch (error) {
    logger.error(`Error getting crawled product filters: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 