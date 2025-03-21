import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa interface cho Inventory (thành phần của sản phẩm)
interface IInventoryItem extends Document {
  id: number;
  name: string;
  category: string;
  status: string;
  quantity: number;
  unit: string;
  threshold: number;
  location: string;
}

// Định nghĩa interface cho Product
export interface IProduct extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  image: string;
  rating: number;
  numReviews: number;
}

// Schema cho Inventory
const InventoryItemSchema = new Schema<IInventoryItem>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  threshold: { type: Number, required: true },
  location: { type: String, required: true }
});

// Schema cho Product
const productSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 