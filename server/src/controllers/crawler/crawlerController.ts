import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import CrawlTask from '../../models/crawler/crawlTask';
import CrawlResult from '../../models/crawler/crawlResult';
import getCrawlerService from '../../services/crawler/crawlerService';
import getAIService from '../../services/crawler/aiService';
import Product from '../../models/product/product';
import logger from '../../utils/logger';
import getQueueService from '../../services/crawler/queueService';
import { CrawledProduct } from '../../models/product';

/**
 * Calculate estimated crawl time in seconds
 */
const calculateEstimatedTime = (config: any): number => {
  // Base time per page in seconds
  const baseTimePerPage = 5;
  
  // Get configuration values with defaults
  const depth = config?.depth || 1;
  const maxPages = config?.maxPages || 1;
  const hasCustomSelectors = config?.selectors && Object.values(config.selectors).some(Boolean);
  
  // Calculate estimated time
  let estimatedTime = baseTimePerPage * Math.min(maxPages, 10); // Cap at 10 pages for estimation
  
  // Multiply by depth factor
  estimatedTime *= Math.sqrt(depth); // Using square root to avoid linear growth
  
  // Add time for custom selectors
  if (hasCustomSelectors) {
    const selectorCount = Object.values(config.selectors).filter(Boolean).length;
    estimatedTime += selectorCount * 2; // 2 seconds per selector
  }
  
  // Return rounded estimate
  return Math.round(estimatedTime);
};

/**
 * Create a new crawl task
 * @route POST /api/crawler/tasks
 */
export const createCrawlTask = async (req: Request, res: Response) => {
  try {
    const { url, config, userId = 'admin', autoSave = false, aiProvider = 'default' } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }
    
    // Basic validation for config
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ message: 'Invalid configuration' });
    }
    
    // Set defaults for config if not provided
    config.depth = config.depth || 1;
    config.maxPages = config.maxPages || 10;
    
    // Calculate estimated time based on config
    const estimatedTime = calculateEstimatedTime(config);
    
    // Create a new task
    const task = await CrawlTask.create({
      url,
      status: 'pending',
      config,
      estimatedTime,
      autoSave,
      aiProvider,
      createdBy: userId
    });
    
    logger.info(`Crawl task created for URL: ${url}`);
    
    // Add task to the queue instead of executing immediately
    const queueService = getQueueService();
    queueService.addTask(task);
    
    const queueStatus = queueService.getStatus();
    
    return res.status(201).json({ 
      message: 'Crawl task created successfully',
      queuePosition: queueStatus.queueLength,
      currentlyRunning: queueStatus.currentlyRunning,
      task,
      estimatedTime
    });
  } catch (error) {
    logger.error(`Error creating crawl task: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all crawl tasks
 * @route GET /api/crawler/tasks
 */
export const getCrawlTasks = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    const options = {
      sort: { createdAt: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    };
    
    const tasks = await CrawlTask.find(query, null, options);
    const totalTasks = await CrawlTask.countDocuments(query);
    
    return res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / Number(limit)),
      currentPage: Number(page),
      totalTasks,
    });
  } catch (error) {
    logger.error(`Error getting crawl tasks: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a crawl task by ID
 * @route GET /api/crawler/tasks/:id
 */
export const getCrawlTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await CrawlTask.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Crawl task not found' });
    }
    
    return res.status(200).json(task);
  } catch (error) {
    logger.error(`Error getting crawl task: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get crawl results for a task
 * @route GET /api/crawler/results/:taskId
 */
export const getCrawlResults = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    
    const results = await CrawlResult.find({ taskId }).sort({ createdAt: -1 });
    if (!results.length) {
      return res.status(404).json({ message: 'No results found for this task' });
    }
    
    return res.status(200).json(results);
  } catch (error) {
    logger.error(`Error getting crawl results: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Process crawl result with AI
 * @route POST /api/crawler/process/:resultId
 */
export const processCrawlResult = async (req: Request, res: Response) => {
  try {
    const { resultId } = req.params;
    const { aiProvider } = req.body;
    
    const result = await CrawlResult.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Crawl result not found' });
    }
    
    // Process the result with AI using the getter function
    const aiService = getAIService();
    const { processedData, aiAnalysis } = await aiService.processProductData(
      result.processedData,
      result.rawHtml,
      aiProvider
    );
    
    // Update the result with AI-processed data
    result.processedData = processedData;
    result.aiAnalysis = aiAnalysis;
    await result.save();
    
    return res.status(200).json({
      message: 'Crawl result processed successfully',
      processedData,
      aiAnalysis,
    });
  } catch (error) {
    logger.error(`Error processing crawl result: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a crawl task and its results
 * @route DELETE /api/crawler/tasks/:id
 */
export const deleteCrawlTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await CrawlTask.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Crawl task not found' });
    }
    
    // Delete task and its results
    await CrawlTask.findByIdAndDelete(id);
    await CrawlResult.deleteMany({ taskId: id });
    
    return res.status(200).json({ message: 'Crawl task and results deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting crawl task: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Integrate a crawled product into the product catalog
 * @route POST /api/crawler/integrate/:resultId
 */
export const integrateProduct = async (req: Request, res: Response) => {
  try {
    const { resultId } = req.params;
    const { 
      userId = 'admin', 
      productCategoryId = null,
      minimumOrderQuantity = 10,
      dailyCapacity = 100,
      unitType = 'units',
      currentAvailableStock = 50,
      leadTime = '3',
      leadTimeUnit = 'days'
    } = req.body;
    
    // Find the crawl result
    const result = await CrawlResult.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Crawl result not found' });
    }
    
    // Check if result has been processed with AI
    if (!result.aiAnalysis) {
      return res.status(400).json({ 
        message: 'This result needs to be processed with AI before integration' 
      });
    }
    
    // Extract product data
    const { processedData, aiAnalysis } = result;
    
    // Generate a SKU if not available
    const productSKU = processedData.sku || 
      `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a new product from the crawled data
    const crawledProduct = await CrawledProduct.create({
      // Core product data from crawling
      name: processedData.productName || 'Unknown Product',
      brand: processedData.brand,
      price: processedData.price ? Number(processedData.price) : undefined,
      description: processedData.description,
      ingredients: processedData.ingredients || [],
      nutritionFacts: processedData.nutritionFacts || {},
      images: processedData.images || [],
      primaryImage: processedData.images && processedData.images.length > 0 ? 
        processedData.images[0] : undefined,
      sourceUrl: processedData.url,
      categories: aiAnalysis.categories || [],
      keywords: aiAnalysis.keywords || [],
      sku: productSKU,
      barcode: processedData.barcode,
      
      // Additional catalog fields
      productCategoryId,
      minimumOrderQuantity: Number(minimumOrderQuantity),
      dailyCapacity: Number(dailyCapacity),
      unitType,
      currentAvailableStock: Number(currentAvailableStock),
      pricePerUnit: processedData.price ? Number(processedData.price) : undefined,
      productType: 'finishedGood',
      leadTime,
      leadTimeUnit,
      isSustainableProduct: false,
      
      // System fields
      metadata: processedData.metadata || {},
      isActive: true,
      createdBy: userId
    });
    
    // Also create a standard product for backwards compatibility
    const product = await Product.create({
      name: processedData.productName || 'Unknown Product',
      brand: processedData.brand,
      price: processedData.price,
      description: processedData.description,
      ingredients: processedData.ingredients,
      nutritionFacts: processedData.nutritionFacts,
      images: processedData.images,
      sourceUrl: processedData.url,
      categories: aiAnalysis.categories,
      keywords: aiAnalysis.keywords,
      sku: productSKU,
      metadata: processedData.metadata,
      isActive: true,
      createdBy: userId
    });
    
    logger.info(`Product integrated from crawl result: ${crawledProduct.name}`);
    
    return res.status(201).json({
      message: 'Product added to catalog successfully',
      product: crawledProduct
    });
  } catch (error) {
    logger.error(`Error integrating product: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get the current queue status
 * @route GET /api/crawler/queue/status
 */
export const getQueueStatus = async (req: Request, res: Response) => {
  try {
    const queueService = getQueueService();
    const status = queueService.getStatus();
    
    // Get task details for currently processing tasks
    const processingTaskIds = status.processingTasks;
    const processingTasks = await CrawlTask.find({
      _id: { $in: processingTaskIds }
    }).select('url status createdAt');
    
    return res.status(200).json({
      ...status,
      processingTaskDetails: processingTasks
    });
  } catch (error) {
    logger.error(`Error getting queue status: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Clear the crawler queue
 * @route POST /api/crawler/queue/clear
 */
export const clearQueue = async (req: Request, res: Response) => {
  try {
    const queueService = getQueueService();
    const clearedCount = queueService.clearQueue();
    
    return res.status(200).json({
      message: `Queue cleared successfully. Removed ${clearedCount} tasks.`
    });
  } catch (error) {
    logger.error(`Error clearing queue: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 