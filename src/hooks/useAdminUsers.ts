import { useState, useEffect } from 'react';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await adminService.updateUserRole(userId, role);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      throw err;
    }
  };

  const updateUserStatus = async (userId: string, status: User['status']) => {
    try {
      await adminService.updateUserStatus(userId, status);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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