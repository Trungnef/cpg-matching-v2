import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from './config';
import logger from './utils/logger';
import crawlerRoutes from './routes/crawler';
import productRoutes from './routes/product';
import catalogRoutes from './routes/product/catalog';

// Create Express app
const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/crawler', crawlerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/catalog', catalogRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', env: config.nodeEnv });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  })
  .catch((error) => {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

export default app; 