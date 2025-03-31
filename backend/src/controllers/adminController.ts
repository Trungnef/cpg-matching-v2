import { Request, Response } from 'express';
import User from '../models/User';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log('Database query: Fetching all users');
    const users = await User.find({}, '-password');
    console.log(`Successfully fetched ${users.length} users from database`);
    
    // Return data in a consistent format
    res.json(users);
  } catch (error) {
    console.error('Database error when fetching users:', error);
    
    // Send more detailed error for debugging
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Error fetching users from database', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ message: 'Unknown error fetching users' });
    }
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    Object.assign(user, req.body);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sử dụng User.findByIdAndUpdate thay vì assign trực tiếp
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Update user status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sử dụng User.findByIdAndUpdate thay vì assign trực tiếp
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    // Validate the user ID
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Validate the profile data
    if (Object.keys(profileData).length === 0) {
      return res.status(400).json({ message: 'No profile data provided' });
    }
    
    console.log(`Updating profile for user ${userId}:`, profileData);
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: profileData }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User profile updated successfully');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Error updating user profile', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ message: 'Unknown error updating user profile' });
    }
  }
}; 