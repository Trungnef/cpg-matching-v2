import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  brand?: string;
  price?: number;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, string>;
  images?: string[];
  sourceUrl?: string;
  categories?: string[];
  keywords?: string[];
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  stock?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
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
    sourceUrl: {
      type: String,
      trim: true,
    },
    categories: [String],
    keywords: [String],
    sku: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
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
productSchema.index(
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

export default mongoose.model<ProductDocument>('Product', productSchema); 