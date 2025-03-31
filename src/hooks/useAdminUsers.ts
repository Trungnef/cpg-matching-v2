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

interface UserProfileUpdate {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  verified?: boolean;
}

interface UseAdminUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUserStatus: (userId: string, status: User['status']) => Promise<void>;
  updateUserProfile: (userId: string, profileData: UserProfileUpdate) => Promise<void>;
}

export const useAdminUsers = (): UseAdminUsersReturn => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Refs for tracking state
  const hasRedirected = useRef(false);
  const authAttempts = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    checkAdminAuthentication();
  }, []);

  const checkAdminAuthentication = () => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUserData = localStorage.getItem('adminUser');
    
    if (hasRedirected.current || authAttempts.current > 3) {
      return;
    }
    
    authAttempts.current += 1;
    
    if (adminAuth === 'true' && adminUserData) {
      try {
        JSON.parse(adminUserData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Invalid admin user data in localStorage:', e);
        handleAuthFailure();
      }
    } else {
      handleAuthFailure();
    }
  };
  
  const handleAuthFailure = () => {
    if (hasRedirected.current) return;
    
    console.log('Admin authentication failed, redirecting to login page');
    hasRedirected.current = true;
    
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    
    setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 100);
  };

  const fetchUsers = async () => {
    if (hasRedirected.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (apiError) {
        console.error('Error calling database API:', apiError);
        
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
      
      if (err instanceof Error && 
        (err.message.includes('authentication required') || 
        err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when authenticated and when page is focused
  useEffect(() => {
    if (isAuthenticated && !hasRedirected.current) {
      // Initial fetch
      fetchUsers();

      // Add focus event listener to refresh data when tab is focused
      const handleFocus = () => {
        fetchUsers();
      };

      window.addEventListener('focus', handleFocus);

      // Cleanup
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isAuthenticated]);

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

  const updateUserProfile = async (userId: string, profileData: UserProfileUpdate) => {
    if (!isAuthenticated || hasRedirected.current) {
      return Promise.reject(new Error('Admin authentication required'));
    }
    
    try {
      await adminService.updateUserProfile(userId, profileData);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...profileData } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user profile');
      
      if (err instanceof Error && 
         (err.message.includes('authentication required') || 
          err.message.includes('Unauthorized'))) {
        handleAuthFailure();
      }
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    updateUserRole,
    updateUserStatus,
    updateUserProfile
  };
}; 