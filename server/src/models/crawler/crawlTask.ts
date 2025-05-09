import mongoose, { Document, Schema } from 'mongoose';

export interface CrawlTaskConfig {
  depth: number;
  maxPages: number;
  selectors?: {
    productContainer?: string;
    name?: string;
    price?: string;
    description?: string;
    image?: string;
    ingredients?: string;
    nutritionFacts?: string;
    brand?: string;
  };
}

export interface CrawlTaskDocument extends Document {
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  config: CrawlTaskConfig;
  error?: string;
  estimatedTime?: number; // Estimated crawling time in seconds
  autoSave: boolean; // Whether to automatically save to catalog
  aiProvider: string; // AI provider to use for processing (openai, gemini, claude, or default)
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const crawlTaskSchema = new Schema<CrawlTaskDocument>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    config: {
      depth: {
        type: Number,
        default: 1,
      },
      maxPages: {
        type: Number,
        default: 10,
      },
      selectors: {
        productContainer: String,
        name: String,
        price: String,
        description: String,
        image: String,
        ingredients: String,
        nutritionFacts: String,
        brand: String,
      },
    },
    error: {
      type: String,
    },
    estimatedTime: {
      type: Number,
    },
    autoSave: {
      type: Boolean,
      default: false,
    },
    aiProvider: {
      type: String,
      enum: ['default', 'openai', 'gemini', 'claude'],
      default: 'default',
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CrawlTaskDocument>('CrawlTask', crawlTaskSchema); 