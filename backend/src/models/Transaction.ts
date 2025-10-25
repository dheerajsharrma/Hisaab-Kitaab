import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'income' | 'expense' | 'borrow' | 'lend';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: Date;
  status: TransactionStatus;
  // For borrowing/lending
  contactPerson?: string;
  contactPhone?: string;
  dueDate?: Date;
  isSettled?: boolean;
  settlementDate?: Date;
  // Additional metadata
  tags?: string[];
  location?: string;
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'borrow', 'lend'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  // Borrowing/Lending specific fields
  contactPerson: {
    type: String,
    trim: true,
    required: function(this: ITransaction) {
      return this.type === 'borrow' || this.type === 'lend';
    }
  },
  contactPhone: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: function(this: ITransaction) {
      return this.type === 'borrow' || this.type === 'lend';
    }
  },
  isSettled: {
    type: Boolean,
    default: function(this: ITransaction) {
      return this.type !== 'borrow' && this.type !== 'lend';
    }
  },
  settlementDate: {
    type: Date
  },
  // Additional fields
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  receipt: {
    type: String, // URL to receipt image
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1 });
TransactionSchema.index({ user: 1, category: 1 });
TransactionSchema.index({ user: 1, isSettled: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);