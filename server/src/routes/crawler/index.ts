import express from 'express';
import { body } from 'express-validator';
import * as crawlerController from '../../controllers/crawler/crawlerController';

const router = express.Router();

// Validation middleware for creating a crawl task
const validateCrawlTask = [
  body('url')
    .isURL()
    .withMessage('Invalid URL'),
  body('config.depth')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Depth must be between 1 and 5'),
  body('config.maxPages')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Max pages must be between 1 and 50'),
  body('autoSave')
    .optional()
    .isBoolean()
    .withMessage('Auto save must be a boolean value'),
];

// Crawler task routes
router.post('/tasks', validateCrawlTask, crawlerController.createCrawlTask);
router.get('/tasks', crawlerController.getCrawlTasks);
router.get('/tasks/:id', crawlerController.getCrawlTaskById);
router.get('/results/:taskId', crawlerController.getCrawlResults);
router.post('/process/:resultId', crawlerController.processCrawlResult);
router.delete('/tasks/:id', crawlerController.deleteCrawlTask);
router.post('/integrate/:resultId', crawlerController.integrateProduct);

// Queue management routes
router.get('/queue', crawlerController.getQueueStatus);
router.delete('/queue', crawlerController.clearQueue);

export default router; 