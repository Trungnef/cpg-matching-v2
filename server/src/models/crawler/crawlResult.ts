import mongoose, { Document, Schema } from 'mongoose';

export interface ProductOption {
  name: string;          // Option name (e.g., "Size", "Color", "Configuration")
  value: string;         // Option value (e.g., "Large", "Blue", "512GB")
  price?: number;        // Absolute price for this option
  priceDelta?: number;   // Price difference from base price (e.g., +20.000đ)
  available?: boolean;   // Whether this option is available
  sku?: string;          // SKU for this specific option if available
}

export interface ProductVariant {
  id?: string;           // Variant ID if available
  sku?: string;          // Variant-specific SKU 
  name?: string;         // Variant name
  price?: number;        // Price for this specific variant
  options: ProductOption[]; // Combination of options that make up this variant
  available?: boolean;   // Whether this variant is available
  imageUrl?: string;     // Variant-specific image URL
}

export interface ProductData {
  barcode: any;
  origin: any;
  productName?: string;
  name?: string; // Alias for productName for compatibility
  brand?: string;
  manufacturer?: string; // Alias for brand for compatibility
  price?: number;
  currency?: string;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, string>;
  images?: string[];
  url?: string;
  sku?: string;
  category?: string;
  size?: string;
  metadata?: Record<string, any>;
  options?: {
    [optionName: string]: ProductOption[];  // Organized by option type (e.g., "Size", "Color")
  };
  variants?: ProductVariant[];              // Complete variants with combined options
  basePrice?: number;                       // Base price before options
  priceRange?: {                            // Price range information
    min: number;
    max: number;
  };
}

export interface AIAnalysis {
  categories?: string[];
  keywords?: string[];
  sentiment?: number;
  confidenceScore?: number;
  summary?: string;
}

export interface CrawlResultDocument extends Document {
  taskId: Schema.Types.ObjectId;
  status: string;
  rawHtml?: string;
  extractedContent?: string;
  processedData: ProductData;
  aiAnalysis?: AIAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

const crawlResultSchema = new Schema<CrawlResultDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'CrawlTask',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    rawHtml: {
      type: String,
    },
    extractedContent: {
      type: String,
    },
    processedData: {
      productName: String,
      brand: String,
      price: Number,
      description: String,
      ingredients: [String],
      nutritionFacts: {
        type: Map,
        of: String,
      },
      images: [String],
      url: String,
      metadata: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    aiAnalysis: {
      categories: [String],
      keywords: [String],
      sentiment: Number,
      confidenceScore: Number,
      summary: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CrawlResultDocument>('CrawlResult', crawlResultSchema); 