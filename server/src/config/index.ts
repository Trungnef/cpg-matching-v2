import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cpg_crawler',
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyCtx9QtgXeRR48qcQvXimNl9axBTU4-0ug',
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  logLevel: process.env.LOG_LEVEL || 'info',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    claudeModel: process.env.AWS_CLAUDE_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0',
    useAwsClaude: process.env.USE_AWS_CLAUDE === 'true' || false,
  },
  crawler: {
    // If proxy is enabled, the crawler will use the proxy server
    useProxy: process.env.USE_PROXY === 'true' || false,
    proxyUrl: process.env.PROXY_URL || '',
    proxyUsername: process.env.PROXY_USERNAME || '',
    proxyPassword: process.env.PROXY_PASSWORD || '',
    // Screenshot settings
    saveScreenshots: process.env.SAVE_SCREENSHOTS === 'true' || false,
    screenshotPath: process.env.SCREENSHOT_PATH || 'logs/screenshots',
    // User Agent
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    // Navigation timeout in milliseconds
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '90000', 10),
    // Max retries for navigation
    maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
    // Queue settings
    maxConcurrentTasks: parseInt(process.env.MAX_CONCURRENT_TASKS || '2', 10),
    queueRetryDelay: parseInt(process.env.QUEUE_RETRY_DELAY || '5000', 10),
  }
};

export default config; 