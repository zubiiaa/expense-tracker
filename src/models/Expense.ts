import mongoose, { Schema } from 'mongoose';

export interface IExpense {
  date: Date;
  expense_name: string;
  category: string;
  amount: number;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: {
      type: Date,
      required: [true, 'Please provide a date for this expense'],
      default: Date.now,
    },
    expense_name: {
      type: String,
      required: [true, 'Please provide a name for this expense'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category for this expense'],
      maxlength: [50, 'Category cannot be more than 50 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the amount for this expense'],
      min: [0, 'Amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
