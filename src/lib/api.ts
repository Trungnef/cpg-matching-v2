import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Interface cho dữ liệu người dùng
interface UserData {
  name: string;
  email: string;
  password?: string;
  role: string;
  companyName: string;
  token?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: Record<string, unknown>;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
}

// Interface cho dữ liệu sản phẩm
interface ProductData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  image: string;
  rating?: number;
  numReviews?: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cấu hình Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Nếu token hết hạn, đăng xuất người dùng
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/auth?type=signin';
    }
    
    return Promise.reject(error);
  }
);

// Hàm helper để xử lý request
const handleRequest = async <T>(
  request: Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Server trả về response với status code nằm ngoài 2xx
      console.error('Response error:', error.response.data);
      throw error;
    } else if (axios.isAxiosError(error) && error.request) {
      // Request đã được gửi nhưng không nhận được response
      console.error('Request error:', error.request);
      throw new Error('No response received from server');
    } else {
      // Có lỗi khi setting up request
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error:', errorMessage);
      throw new Error('Error setting up request');
    }
  }
};

// User Services
export const userService = {
  login: async (email: string, password: string) => {
    return handleRequest(api.post('/users/login', { email, password }));
  },

  register: async (userData: UserData) => {
    return handleRequest(api.post('/users', userData));
  },

  getUserProfile: async () => {
    return handleRequest(api.get('/users/profile'));
  },

  updateUserProfile: async (userData: Partial<UserData>) => {
    return handleRequest(api.put('/users/profile', userData));
  }
};

// Product Services
export const productService = {
  getAllProducts: async () => {
    return handleRequest(api.get('/products'));
  },

  getProductById: async (id: string) => {
    return handleRequest(api.get(`/products/${id}`));
  },

  createProduct: async (productData: ProductData) => {
    return handleRequest(api.post('/products', productData));
  },

  updateProduct: async (id: string, productData: Partial<ProductData>) => {
    return handleRequest(api.put(`/products/${id}`, productData));
  },

  deleteProduct: async (id: string) => {
    return handleRequest(api.delete(`/products/${id}`));
  }
};

// Admin Services
export const adminService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized: Please log in as admin.');
        } else if (error.response?.status === 403) {
          throw new Error('Forbidden: Admin access required.');
        } else if (error.response?.status === 404) {
          throw new Error('Users API endpoint not found.');
        }
      }
      throw new Error('Failed to fetch users.');
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  },

  updateUser: async (userId: string, userData: Partial<UserData>) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: UserData['status']) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  }
};

export default api; 