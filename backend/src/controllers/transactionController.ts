import { Response } from 'express';
import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Get all transactions for user
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search,
      isSettled
    } = req.query;

    // Build query
    const query: any = { user: userId };
    
    if (type) query.type = type;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (isSettled !== undefined) query.isSettled = isSettled === 'true';
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }
    
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
};

// Get single transaction
export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const transaction = await Transaction.findOne({ _id: id, user: userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
};

// Create transaction
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔍 Creating transaction...');
    console.log('📝 Request body:', req.body);
    console.log('👤 User:', req.user);
    console.log('👤 User ID:', req.user?._id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user?._id;
    if (!userId) {
      console.log('❌ No user ID found!');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    console.log('✅ User ID confirmed:', userId);
    const transactionData = { ...req.body, user: userId };
    console.log('📦 Transaction data:', transactionData);

    const transaction = new Transaction(transactionData);
    await transaction.save();
    
    console.log('✅ Transaction saved successfully!', transaction._id);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction'
    });
  }
};

// Update transaction
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user?._id;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction'
    });
  }
};

// Delete transaction
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction'
    });
  }
};

// Get dashboard analytics
export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { period = 'month' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Aggregate data using MongoDB aggregation pipeline
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId as string),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get category-wise expenses
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId as string),
          type: 'expense',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      user: userId
    })
      .sort({ date: -1 })
      .limit(5)
      .select('type category amount description date');

    // Get borrowing/lending summary
    const borrowLendSummary = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId as string),
          $or: [{ type: 'borrow' }, { type: 'lend' }],
          isSettled: false
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format response data
    const statsMap = stats.reduce((acc, item) => {
      acc[item._id] = {
        total: item.totalAmount,
        count: item.count
      };
      return acc;
    }, {} as any);

    const borrowLendMap = borrowLendSummary.reduce((acc, item) => {
      acc[item._id] = {
        total: item.totalAmount,
        count: item.count
      };
      return acc;
    }, {} as any);

    res.json({
      success: true,
      data: {
        period,
        income: statsMap.income || { total: 0, count: 0 },
        expenses: statsMap.expense || { total: 0, count: 0 },
        balance: (statsMap.income?.total || 0) - (statsMap.expense?.total || 0),
        borrowing: borrowLendMap.borrow || { total: 0, count: 0 },
        lending: borrowLendMap.lend || { total: 0, count: 0 },
        expensesByCategory,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
};

// Mark borrow/lend as settled
export const markAsSettled = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: id, 
        user: userId,
        $or: [{ type: 'borrow' }, { type: 'lend' }]
      },
      { 
        isSettled: true, 
        settlementDate: new Date(),
        status: 'completed'
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not a borrow/lend transaction'
      });
    }

    res.json({
      success: true,
      message: 'Transaction marked as settled',
      data: transaction
    });
  } catch (error) {
    console.error('Mark as settled error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking transaction as settled'
    });
  }
};