import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Category from '../models/Category';

// Generate JWT token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });
};

// Create default categories for new users
const createDefaultCategories = async (userId: string) => {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
    { name: 'Freelance', type: 'income', icon: '💻', color: '#059669' },
    { name: 'Investment', type: 'income', icon: '📈', color: '#047857' },
    { name: 'Bonus', type: 'income', icon: '🎁', color: '#065f46' },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: '#f97316' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#eab308' },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#a855f7' },
    { name: 'Bills & Utilities', type: 'expense', icon: '🏠', color: '#3b82f6' },
    { name: 'Healthcare', type: 'expense', icon: '⚕️', color: '#06b6d4' },
    { name: 'Education', type: 'expense', icon: '📚', color: '#8b5cf6' },
    { name: 'Travel', type: 'expense', icon: '✈️', color: '#ec4899' }
  ];

  const categories = defaultCategories.map(cat => ({
    ...cat,
    user: userId,
    isDefault: true
  }));

  await Category.insertMany(categories);
};

// Register user
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

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Create default categories for the user
    await createDefaultCategories((user._id as any).toString());

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
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

// Login user
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

    // Find user by email and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
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

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
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

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = (req as any).user._id;
    const { name, avatar } = req.body;

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};
