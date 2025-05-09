import logger from '../../utils/logger';
import { CrawlTaskDocument } from '../../models/crawler/crawlTask';
import getCrawlerService from './crawlerService';
import config from '../../config';

/**
 * Queue service for managing crawl tasks asynchronously
 */
class QueueService {
  private taskQueue: CrawlTaskDocument[] = [];
  private isProcessing: boolean = false;
  private maxConcurrent: number = 1;
  private currentlyRunning: number = 0;
  private processingTasks: Set<string> = new Set();

  constructor() {
    // Parse max concurrent tasks from configuration
    this.maxConcurrent = config.crawler.maxConcurrentTasks || 1;
    logger.info(`Queue service initialized with max ${this.maxConcurrent} concurrent tasks`);
    
    // Start the queue processor on a regular interval
    setInterval(() => this.processQueue(), config.crawler.queueRetryDelay || 5000);
  }

  /**
   * Add a task to the queue
   * @param task The crawl task to add to the queue
   */
  public addTask(task: CrawlTaskDocument): void {
    const taskId = task._id ? task._id.toString() : 'unknown';
    logger.info(`Adding task to queue: ${taskId}`);
    
    // Check if task is already in queue
    const alreadyQueued = this.taskQueue.some(t => {
      const id = t._id ? t._id.toString() : '';
      return id === taskId;
    });
    const alreadyProcessing = this.processingTasks.has(taskId);
    
    if (!alreadyQueued && !alreadyProcessing) {
      this.taskQueue.push(task);
      logger.info(`Task added to queue. Current queue length: ${this.taskQueue.length}`);
    } else {
      logger.warn(`Task ${taskId} already in queue or being processed`);
    }
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process tasks in the queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    if (this.taskQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      // Process tasks until queue is empty or max concurrent reached
      while (this.taskQueue.length > 0 && this.currentlyRunning < this.maxConcurrent) {
        const task = this.taskQueue.shift();
        if (!task) break;
        
        // Track that we're processing this task
        const taskId = task._id ? task._id.toString() : 'unknown';
        this.processingTasks.add(taskId);
        this.currentlyRunning++;
        
        // Process task in background
        this.processTask(task).finally(() => {
          this.currentlyRunning--;
          this.processingTasks.delete(taskId);
          logger.info(`Task ${taskId} processing complete. ${this.currentlyRunning} tasks still running.`);
        });
      }
    } catch (error) {
      logger.error(`Error in queue processing: ${error}`);
    } finally {
      this.isProcessing = false;
      
      // If we still have tasks and capacity, continue processing
      if (this.taskQueue.length > 0 && this.currentlyRunning < this.maxConcurrent) {
        setImmediate(() => this.processQueue());
      }
    }
  }

  /**
   * Process a single task
   * @param task The task to process
   */
  private async processTask(task: CrawlTaskDocument): Promise<void> {
    const taskId = task._id ? task._id.toString() : 'unknown';
    logger.info(`Processing task from queue: ${taskId}`);
    
    try {
      const crawlerService = getCrawlerService();
      await crawlerService.executeCrawlTask(task);
    } catch (error) {
      logger.error(`Error processing task ${taskId}: ${error}`);
      
      // Update task status to failed if there was an error
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      await task.save();
    }
  }

  /**
   * Get current queue status
   */
  public getStatus(): { queueLength: number; currentlyRunning: number; processingTasks: string[] } {
    return {
      queueLength: this.taskQueue.length,
      currentlyRunning: this.currentlyRunning,
      processingTasks: Array.from(this.processingTasks)
    };
  }

  /**
   * Clear all pending tasks in the queue
   */
  public clearQueue(): number {
    const clearedCount = this.taskQueue.length;
    this.taskQueue = [];
    logger.info(`Queue cleared, removed ${clearedCount} tasks`);
    return clearedCount;
  }
}

// Singleton instance
let instance: QueueService | null = null;

// Export a function to get the instance (lazy initialization)
export default function getQueueService(): QueueService {
  if (!instance) {
    instance = new QueueService();
  }
  return instance;
} 