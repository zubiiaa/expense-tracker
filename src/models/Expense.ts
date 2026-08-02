import mongoose, { Schema } from "mongoose";

export type TransactionType = "debit" | "credit";

export interface IExpense {
  date: Date;
  expense_name: string;
  category: string;
  amount: number;
  type: TransactionType;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: {
      type: Date,
      required: [true, "Please provide a date for this transaction"],
      default: Date.now,
    },
    expense_name: {
      type: String,
      required: [true, "Please provide a name for this transaction"],
      maxlength: [100, "Name cannot be more than 100 characters"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      maxlength: [50, "Category cannot be more than 50 characters"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please specify the amount"],
      min: [0, "Amount cannot be negative"],
    },
    type: {
      type: String,
      enum: ["debit", "credit"],
      default: "debit",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
