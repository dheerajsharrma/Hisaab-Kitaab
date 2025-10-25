import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { mockUser } from '../utils/mockData';

interface AuthRequest extends Request {
  user?: any;
}

const demoAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as { 
        userId: string;
        email?: string;
        name?: string;
      };
      
      // Extract user data from the JWT token payload
      req.user = {
        id: decoded.userId,
        name: decoded.name || 'Demo User',
        email: decoded.email || 'demo@example.com',
        avatar: mockUser.avatar,
        createdAt: mockUser.createdAt
      };
      
      console.log(`✅ Demo auth middleware: Token valid, user authenticated as ${decoded.email || 'demo user'}`);
      next();
    } catch (jwtError) {
      console.log('❌ Demo auth middleware: Invalid token');
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }
  } catch (error) {
    console.error('Demo auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token validation failed' 
    });
  }
};

export { demoAuth, AuthRequest };