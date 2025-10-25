import express from 'express';
import { body, param } from 'express-validator';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
  markAsSettled
} from '../controllers/transactionController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET api/transactions/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', getDashboardData);

// @route   GET api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get('/', getTransactions);

// @route   GET api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid transaction ID')
], getTransaction);

// @route   POST api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', [
  body('type')
    .isIn(['income', 'expense', 'borrow', 'lend'])
    .withMessage('Type must be one of: income, expense, borrow, lend'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim(),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('contactPerson')
    .if(body('type').isIn(['borrow', 'lend']))
    .notEmpty()
    .withMessage('Contact person is required for borrow/lend transactions')
    .trim(),
  body('dueDate')
    .if(body('type').isIn(['borrow', 'lend']))
    .notEmpty()
    .withMessage('Due date is required for borrow/lend transactions')
    .isISO8601()
    .withMessage('Please provide a valid due date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('location')
    .optional()
    .trim()
], createTransaction);

// @route   PUT api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid transaction ID'),
  body('type')
    .optional()
    .isIn(['income', 'expense', 'borrow', 'lend'])
    .withMessage('Type must be one of: income, expense, borrow, lend'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .trim(),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
], updateTransaction);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid transaction ID')
], deleteTransaction);

// @route   PATCH api/transactions/:id/settle
// @desc    Mark borrow/lend transaction as settled
// @access  Private
router.patch('/:id/settle', [
  param('id').isMongoId().withMessage('Invalid transaction ID')
], markAsSettled);

export default router;