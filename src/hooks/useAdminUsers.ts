import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastActive: string;
  verified: boolean;
}

interface UseAdminUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUserStatus: (userId: string, status: User['status']) => Promise<void>;
}

export const useAdminUsers = (): UseAdminUsersReturn => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Sử dụng useRef để theo dõi trạng thái đã chuyển hướng
  const hasRedirected = useRef(false);
  // State để theo dõi số lần thử xác thực
  const authAttempts = useRef(0);

  // Kiểm tra xác thực khi mount component
  useEffect(() => {
    checkAdminAuthentication();
  }, []);

  // Hàm kiểm tra xác thực admin
  const checkAdminAuthentication = () => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUserData = localStorage.getItem('adminUser');
    
    // Nếu đã chuyển hướng hoặc đã thử quá 3 lần, không làm gì thêm
    if (hasRedirected.current || authAttempts.current > 3) {
      return;
    }
    
    // Tăng số lần thử
    authAttempts.current += 1;
    
    if (adminAuth === 'true' && adminUserData) {
      try {
        // Kiểm tra xem dữ liệu JSON có hợp lệ không
        JSON.parse(adminUserData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Invalid admin user data in localStorage:', e);
        // Dữ liệu không hợp lệ, xóa và chuyển về login
        handleAuthFailure();
      }
    } else {
      // Không có dữ liệu xác thực, chuyển về login
      handleAuthFailure();
    }
  };
  
  // Hàm xử lý khi xác thực thất bại
  const handleAuthFailure = () => {
    if (hasRedirected.current) return;
    
    console.log('Admin authentication failed, redirecting to login page');
    hasRedirected.current = true;
    
    // Xóa dữ liệu xác thực nếu có
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    
    // Đặt một timeout ngắn để tránh vòng lặp chuyển hướng
    setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 100);
  };

  // Cập nhật fetchUsers để xử lý lỗi 401 tốt hơn
  const fetchUsers = async () => {
    // Không thực hiện nếu đã chuyển hướng
    if (hasRedirected.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use database directly without mock data fallback
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (apiError) {
        console.error('Error calling database API:', apiError);
        
        // If unauthorized, check authentication and redirect to login
        if (apiError instanceof Error && apiError.message.includes('Unauthorized')) {
          handleAuthFailure();
          throw apiError;
        } else {
          throw apiError;
        }
      }
    } catch (err) {
      console.error('Error fetching users from database:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users from database');
      
      // If authentication error, handle logout
      if (err instanceof Error && 
        (err.message.includes('authentication required') || 
        err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAuthenticated || hasRedirected.current) {
      return Promise.reject(new Error('Admin authentication required'));
    }
    
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      
      if (err instanceof Error && 
         (err.message.includes('authentication required') || 
          err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
      throw err;
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    if (!isAuthenticated || hasRedirected.current) {
      return Promise.reject(new Error('Admin authentication required'));
    }
    
    try {
      await adminService.updateUserRole(userId, role);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      
      if (err instanceof Error && 
         (err.message.includes('authentication required') || 
          err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
      throw err;
    }
  };

  const updateUserStatus = async (userId: string, status: User['status']) => {
    if (!isAuthenticated || hasRedirected.current) {
      return Promise.reject(new Error('Admin authentication required'));
    }
    
    try {
      await adminService.updateUserStatus(userId, status);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      
      if (err instanceof Error && 
         (err.message.includes('authentication required') || 
          err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
      throw err;
    }
  };

  // Chỉ gọi fetchUsers khi isAuthenticated thay đổi thành true
  useEffect(() => {
    if (isAuthenticated && !hasRedirected.current) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    updateUserRole,
    updateUserStatus
  };
}; 