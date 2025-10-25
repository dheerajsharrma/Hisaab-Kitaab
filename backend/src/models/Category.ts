import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: 'income' | 'expense' | 'both';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    required: [true, 'Category type is required']
  },
  icon: {
    type: String,
    default: '📝'
  },
  color: {
    type: String,
    default: '#6366f1',
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure unique category names per user
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);