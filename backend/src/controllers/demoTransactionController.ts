import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mockTransactions, mockDashboardData } from '../utils/mockData';

// Get dashboard analytics (mock data)
export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'month' } = req.query;

    res.json({
      success: true,
      data: {
        ...mockDashboardData,
        period
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

// Get all transactions (mock data)
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      search
    } = req.query;

    let filteredTransactions = [...mockTransactions];

    // Apply filters
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    if (category) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.category.toLowerCase().includes((category as string).toLowerCase())
      );
    }
    if (search) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.description.toLowerCase().includes((search as string).toLowerCase()) ||
        (t.contactPerson && t.contactPerson.toLowerCase().includes((search as string).toLowerCase()))
      );
    }

    // Apply pagination
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedTransactions = filteredTransactions.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredTransactions.length,
        pages: Math.ceil(filteredTransactions.length / Number(limit))
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

// Get single transaction (mock data)
export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = mockTransactions.find(t => t._id === id);
    
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

// Create transaction (demo - just returns success)
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const newTransaction = {
      _id: Date.now().toString(), // Simple ID for demo
      user: '507f1f77bcf86cd799439011',
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully (Demo Mode)',
      data: newTransaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction'
    });
  }
};

// Update transaction (demo - just returns success)
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = mockTransactions.find(t => t._id === id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const updatedTransaction = {
      ...transaction,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Transaction updated successfully (Demo Mode)',
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction'
    });
  }
};

// Delete transaction (demo - just returns success)
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = mockTransactions.find(t => t._id === id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully (Demo Mode)'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction'
    });
  }
};

// Mark as settled (demo - just returns success)
export const markAsSettled = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = mockTransactions.find(t => t._id === id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const settledTransaction = {
      ...transaction,
      isSettled: true,
      settlementDate: new Date().toISOString(),
      status: 'completed'
    };

    res.json({
      success: true,
      message: 'Transaction marked as settled (Demo Mode)',
      data: settledTransaction
    });
  } catch (error) {
    console.error('Mark as settled error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking transaction as settled'
    });
  }
};