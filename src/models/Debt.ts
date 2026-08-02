import mongoose, { Schema } from "mongoose";

// owe = you owe them, owed = they owe you
export type DebtDirection = "owe" | "owed";

export interface IDebt {
  name: string;
  amount: number;
  detail: string;
  date: Date;
  direction: DebtDirection;
}

const DebtSchema = new Schema<IDebt>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount cannot be negative"],
    },
    detail: { type: String, default: "", trim: true },
    date: { type: Date, default: Date.now },
    direction: {
      type: String,
      enum: ["owe", "owed"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Debt || mongoose.model<IDebt>("Debt", DebtSchema);
