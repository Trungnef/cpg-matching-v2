import { useState, useEffect } from 'react';
import { productService } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  image: string;
  rating: number;
  numReviews: number;
  user: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  createProduct: (productData: Omit<Product, '_id' | 'user' | 'rating' | 'numReviews'>) => Promise<Product | null>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (err: any) {
      console.error(`Error getting product ${id}:`, err);
      setError(err.response?.data?.message || `Failed to get product with ID: ${id}`);
      return null;
    }
  };

  const createProduct = async (productData: Omit<Product, '_id' | 'user' | 'rating' | 'numReviews'>): Promise<Product | null> => {
    try {
      const product = await productService.createProduct(productData);
      setProducts([...products, product]);
      return product;
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || 'Failed to create product');
      return null;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      
      setProducts(products.map(product => 
        product._id === id ? updatedProduct : product
      ));
      
      return updatedProduct;
    } catch (err: any) {
      console.error(`Error updating product ${id}:`, err);
      setError(err.response?.data?.message || `Failed to update product with ID: ${id}`);
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
      return true;
    } catch (err: any) {
      console.error(`Error deleting product ${id}:`, err);
      setError(err.response?.data?.message || `Failed to delete product with ID: ${id}`);
      return false;
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
}; 