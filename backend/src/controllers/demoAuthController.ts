import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { mockUser } from '../utils/mockData';

// Simple in-memory storage for demo users (in production, this would be a database)
const demoUsers = new Map<string, any>();

// Generate JWT token with extended expiration and include user data
const generateToken = (userData: any): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
  // Include user data in the token payload for easy retrieval
  return jwt.sign({ 
    userId: userData.id,
    email: userData.email,
    name: userData.name
  }, jwtSecret, { expiresIn: '365d' });
};

// Demo login (accepts any email/password but uses actual email)
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Check if user exists in our demo storage, otherwise create a default user with the provided email
    let userData = demoUsers.get(email.toLowerCase().trim());
    
    if (!userData) {
      // Create a new demo user with the provided email
      userData = {
        id: mockUser._id,
        name: email.split('@')[0], // Use email prefix as name if not registered
        email: email.toLowerCase().trim(),
        avatar: mockUser.avatar,
        createdAt: new Date().toISOString()
      };
      demoUsers.set(email.toLowerCase().trim(), userData);
    }

    const token = generateToken(userData);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Demo register (creates demo user)
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        errors: [
          { path: 'name', msg: name ? '' : 'Name is required' },
          { path: 'email', msg: email ? '' : 'Email is required' },
          { path: 'password', msg: password ? '' : 'Password is required' }
        ].filter(err => err.msg)
      });
    }

    // Create demo user with provided name and email
    const userData = {
      id: mockUser._id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: mockUser.avatar,
      createdAt: new Date().toISOString()
    };

    // Store the user data for future logins
    demoUsers.set(email.toLowerCase().trim(), userData);

    const token = generateToken(userData);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Get user data from the token (set by demo auth middleware)
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt || mockUser.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};
