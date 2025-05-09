import mongoose, { Document, Schema } from 'mongoose';

export interface CrawledProductDocument extends Document {
  name: string;
  brand?: string;
  price?: number;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, string>;
  images?: string[];
  primaryImage?: string;
  sourceUrl?: string;
  categories?: string[];
  keywords?: string[];
  sku?: string;
  barcode?: string;
  
  // Additional fields for catalog integration
  productCategoryId?: string;
  unitType?: string;
  currentAvailableStock?: number;
  pricePerUnit?: number;
  productType?: string;
  leadTime?: string;
  leadTimeUnit?: string;
  minimumOrderQuantity?: number;
  dailyCapacity?: number;
  isSustainableProduct?: boolean;
  
  weight?: number;
  weightUnit?: string;
  stock?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const crawledProductSchema = new Schema<CrawledProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
    },
    ingredients: [String],
    nutritionFacts: {
      type: Map,
      of: String,
    },
    images: [String],
    primaryImage: {
      type: String,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    categories: [String],
    keywords: [String],
    sku: {
      type: String,
      trim: true,
      index: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    
    // Additional catalog fields
    productCategoryId: {
      type: String,
    },
    unitType: {
      type: String,
      enum: ['units', 'kg', 'liters', 'packs', 'boxes', 'pallets', 'cases'],
      default: 'units',
    },
    currentAvailableStock: {
      type: Number,
      default: 0,
    },
    pricePerUnit: {
      type: Number,
      min: 0,
    },
    productType: {
      type: String,
      enum: ['finishedGood', 'rawMaterial', 'packaging', 'component'],
      default: 'finishedGood',
    },
    leadTime: {
      type: String,
    },
    leadTimeUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days',
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
    },
    dailyCapacity: {
      type: Number,
      default: 100,
    },
    isSustainableProduct: {
      type: Boolean,
      default: false,
    },
    
    weight: {
      type: Number,
      min: 0,
    },
    weightUnit: {
      type: String,
      enum: ['g', 'kg', 'oz', 'lb'],
      default: 'g',
    },
    stock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
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

// Add text indexes for search
crawledProductSchema.index(
  { 
    name: 'text', 
    brand: 'text', 
    description: 'text',
    sku: 'text',
    barcode: 'text'
  }, 
  { 
    weights: { 
      name: 10, 
      brand: 5, 
      sku: 8,
      barcode: 8,
      description: 3 
    } 
  }
);

export default mongoose.model<CrawledProductDocument>('CrawledProduct', crawledProductSchema); 