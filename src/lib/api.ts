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
    // Check if this is an admin request
    const isAdminRequest = config.url?.includes('/admin/');
    
    if (isAdminRequest) {
      // Use admin token for admin routes
      const adminAuth = localStorage.getItem('adminAuth');
      const adminUserData = localStorage.getItem('adminUser');
      
      if (adminAuth === 'true' && adminUserData) {
        try {
          const adminUser = JSON.parse(adminUserData);
          
          // Check if token is expired
          const now = Date.now();
          if (adminUser.expires && now > adminUser.expires) {
            console.error('Admin token expired, clearing admin session');
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('adminUser');
            // Let the request go through to receive 401 from the server
          } else {
            // Nếu là request admin, thêm token admin vào header
            // Use consistent capitalization for headers
            config.headers['AdminAuthorization'] = `Bearer ${adminUser.token || 'admin-token'}`;
            
            // Thêm admin info vào header để backend có thể xác thực
            config.headers['X-Admin-Role'] = adminUser.role || 'admin';
            config.headers['X-Admin-Email'] = adminUser.email || '';
            
            console.log('Admin request headers set:', {
              Authorization: config.headers['AdminAuthorization'],
              Role: config.headers['X-Admin-Role'],
              Email: config.headers['X-Admin-Email']
            });
          }
        } catch (e) {
          console.error('Error parsing admin user data:', e);
        }
      } else {
        console.warn('Admin request without valid admin authentication');
      }
    } else {
      // For regular user routes, use the normal token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      
      // Check if the request is for an admin route
      const requestUrl = error.config?.url || '';
      if (requestUrl.includes('/admin/')) {
        // For admin routes, just clear admin auth but don't redirect
        // Let the components handle redirection
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
      }
      
      // Store auth failure info in a safer way
      Object.defineProperty(error, 'authFailure', {
        value: true,
        writable: false,
        configurable: true
      });
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
  // Hàm trợ giúp tạo mock data
  getMockUsers: () => {
    return [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
        company: 'Admin Company',
        status: 'active',
        lastActive: 'Now',
        verified: true
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Manufacturer',
        company: 'Manufacturing Inc.',
        status: 'active',
        lastActive: '2 hours ago',
        verified: true
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Brand',
        company: 'Brand Co.',
        status: 'active',
        lastActive: '1 day ago',
        verified: true
      },
      {
        id: '4',
        name: 'Michael Wong',
        email: 'michael@example.com',
        role: 'Retailer',
        company: 'Retail Solutions',
        status: 'inactive',
        lastActive: '5 days ago',
        verified: false
      },
      {
        id: '5',
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Brand',
        company: 'Fashion Brand',
        status: 'pending',
        lastActive: 'Never',
        verified: false
      }
    ];
  },
  
  getAllUsers: async () => {
    try {
      // Check for admin authentication first
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth !== 'true') {
        throw new Error('Admin authentication required');
      }
      
      console.log('Making API request to get all users from database...');
      const response = await api.get('/admin/users');
      
      // Define interface for MongoDB user data
      interface MongoDBUser {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        role?: string;
        companyName?: string;
        status?: string;
        updatedAt?: string;
      }
      
      // Map MongoDB data to frontend format
      const users = response.data.map((user: MongoDBUser) => ({
        id: user._id || user.id,
        name: user.name || 'Unknown',
        email: user.email || '',
        role: user.role || 'unknown',
        company: user.companyName || '',
        status: user.status || 'inactive',
        lastActive: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Never',
        verified: user.status === 'active'
      }));
      
      console.log('Database users retrieved:', users.length);
      return users;
    } catch (error) {
      console.error('Error fetching users from database:', error);
      
      // Remove mock data fallback - always use real database
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear admin auth but don't redirect directly
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUser');
          throw new Error('Unauthorized: Please log in as admin.');
        } else if (error.response?.status === 403) {
          throw new Error('Forbidden: Admin access required.');
        } else if (error.response?.status === 404) {
          throw new Error('Users API endpoint not found.');
        }
      }
      
      // Propagate the error without falling back to mock data
      throw error;
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