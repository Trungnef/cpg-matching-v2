import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

// Define a custom Request type that includes the user property
interface RequestWithUser extends Request {
  user: {
    _id: mongoose.Types.ObjectId | string;
  };
}

// Helper function để tạo JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '30d'
  });
};

// @desc    Đăng nhập người dùng & lấy token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem có email hay không
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const userId = user._id.toString();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      phone: user.phone,
      website: user.website,
      address: user.address,
      companyDescription: user.companyDescription,
      status: user.status,
      token: generateToken(userId)
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, companyName, phone, website, address, companyDescription } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Tạo người dùng mới
    const user = await User.create({
      name,
      email,
      password,
      role,
      companyName,
      phone,
      website,
      address,
      companyDescription
    });

    if (user) {
      const userId = user._id.toString();

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone,
        website: user.website,
        address: user.address,
        companyDescription: user.companyDescription,
        status: user.status,
        token: generateToken(userId)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};

// @desc    Lấy thông tin người dùng
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as RequestWithUser).user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone,
        website: user.website,
        address: user.address,
        companyDescription: user.companyDescription,
        status: user.status
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// @desc    Cập nhật thông tin người dùng
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as RequestWithUser).user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.companyName = req.body.companyName || user.companyName;
      user.phone = req.body.phone || user.phone;
      user.website = req.body.website || user.website;
      user.address = req.body.address || user.address;
      user.companyDescription = req.body.companyDescription || user.companyDescription;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const userId = updatedUser._id.toString();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyName: updatedUser.companyName,
        phone: updatedUser.phone,
        website: updatedUser.website,
        address: updatedUser.address,
        companyDescription: updatedUser.companyDescription,
        token: generateToken(userId)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
}; 