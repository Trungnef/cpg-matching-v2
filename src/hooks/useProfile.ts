import { useState, useEffect } from 'react';
import { userService } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

interface ProfileData {
  name: string;
  email: string;
  companyName: string;
  role: string;
  avatar?: string;
  [key: string]: any; // Cho phép thêm các trường khác tùy theo role
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedData: Partial<ProfileData>) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const { user, updateUserProfile } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<void> => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await userService.getUserProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<ProfileData>): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await userService.updateUserProfile(updatedData);
      
      // Cập nhật trạng thái local
      setProfile(updatedProfile);
      
      // Cập nhật thông tin trong UserContext
      await updateUserProfile(updatedProfile);
      
      return true;
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.response?.data?.message || 'Failed to update user profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile on component mount or when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile
  };
}; 