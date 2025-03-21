import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

// Mở rộng interface Request để thêm trường user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware bảo vệ route
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret') as JwtPayload;

      // Lấy user từ token
      (req as any).user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware cho các role cụ thể
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({
        message: `Role ${(req as any).user.role} is not authorized to access this resource`
      });
    }
    next();
  };
};

// Middleware kiểm tra role
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware kiểm tra role manufacturer
export const manufacturer = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'manufacturer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a manufacturer' });
  }
};

// Middleware kiểm tra role brand
export const brand = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'brand' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a brand' });
  }
};

// Middleware kiểm tra role retailer
export const retailer = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'retailer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a retailer' });
  }
}; 