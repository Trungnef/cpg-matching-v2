import axios from 'axios';

// Base URL của API - nên được cấu hình từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Tạo một instance axios với cấu hình chung
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API cho tính năng Web Crawler
export const crawlerApi = {
  // Tạo nhiệm vụ crawl mới
  createTask: (data: {
    url: string;
    config: {
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
    };
    userId: string;
    autoSave?: boolean;
    aiProvider?: 'default' | 'openai' | 'gemini' | 'claude';
  }) => {
    return api.post('/crawler/tasks', data);
  },

  // Lấy danh sách nhiệm vụ crawl
  getTasks: (page = 1, limit = 10, status?: string) => {
    return api.get('/crawler/tasks', {
      params: { page, limit, status },
    });
  },

  // Lấy chi tiết nhiệm vụ crawl
  getTask: (taskId: string) => {
    return api.get(`/crawler/tasks/${taskId}`);
  },

  // Lấy kết quả crawl
  getResults: (taskId: string) => {
    return api.get(`/crawler/results/${taskId}`);
  },

  // Xử lý kết quả crawl với AI
  processResult: (resultId: string) => {
    return api.post(`/crawler/process/${resultId}`);
  },

  // Thêm sản phẩm từ kết quả crawl vào catalog
  integrateProduct: (resultId: string, userId: string = 'admin', additionalParams = {}) => {
    const params = {
      userId,
      minimumOrderQuantity: 10,
      dailyCapacity: 100,
      unitType: 'units',
      currentAvailableStock: 50,
      leadTime: '3',
      leadTimeUnit: 'days',
      ...additionalParams
    };
    
    // Ensure numeric fields are properly formatted
    if (params.minimumOrderQuantity) {
      params.minimumOrderQuantity = Number(params.minimumOrderQuantity);
    }
    if (params.dailyCapacity) {
      params.dailyCapacity = Number(params.dailyCapacity);
    }
    if (params.currentAvailableStock) {
      params.currentAvailableStock = Number(params.currentAvailableStock);
    }
    
    return api.post(`/crawler/integrate/${resultId}`, params);
  },

  // Xóa nhiệm vụ crawl
  deleteTask: (taskId: string) => {
    return api.delete(`/crawler/tasks/${taskId}`);
  },

  // Get queue status
  getQueueStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crawler/queue`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Clear queue
  clearQueue: async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/crawler/queue`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  batchDeleteByStatus: async (status: string) => {
    return await api.delete(`/crawler/tasks/status/${status}`);
  },
};

// API cho quản lý sản phẩm
export const productApi = {
  // Lấy danh sách sản phẩm
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    return api.get('/products', { params });
  },

  // Lấy chi tiết sản phẩm
  getProduct: (productId: string) => {
    return api.get(`/products/${productId}`);
  },

  // Tạo sản phẩm mới
  createProduct: (data: any) => {
    return api.post('/products', data);
  },

  // Cập nhật sản phẩm
  updateProduct: (productId: string, data: any) => {
    return api.put(`/products/${productId}`, data);
  },

  // Xóa sản phẩm
  deleteProduct: (productId: string) => {
    return api.delete(`/products/${productId}`);
  },

  // Lấy dữ liệu bộ lọc (thương hiệu, danh mục, phạm vi giá)
  getFilters: () => {
    return api.get('/products/filters');
  },

  // New methods for catalog products
  getCatalogProducts: (params) => api.get('/catalog', { params }),
  getCatalogProductById: (id) => api.get(`/catalog/${id}`),
  updateCatalogProduct: (id, data) => {
    // Ensure all numeric fields are properly formatted
    const cleanData = { ...data };
    
    // Numeric fields
    const numericFields = [
      'price', 'pricePerUnit', 'currentAvailableStock', 
      'minimumOrderQuantity', 'dailyCapacity', 'weight'
    ];
    
    // Convert numeric fields to numbers
    numericFields.forEach(field => {
      if (cleanData[field] !== undefined && cleanData[field] !== null) {
        cleanData[field] = Number(cleanData[field]);
      }
    });
    
    // Remove empty values and null values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '' || cleanData[key] === null) {
        delete cleanData[key];
      }
    });
    
    console.log('Sending update request with data:', cleanData);
    return api.put(`/catalog/${id}`, cleanData);
  },
  deleteCatalogProduct: (id) => api.delete(`/catalog/${id}`),
  getCatalogFilters: () => api.get('/catalog/filters'),
};

export default api; 