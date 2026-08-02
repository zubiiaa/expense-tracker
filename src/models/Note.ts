import mongoose, { Schema } from "mongoose";

export interface INote {
  title: string;
  category: string;
  content: string;
  date: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [120, "Title cannot be more than 120 characters"],
      trim: true,
    },
    category: { type: String, default: "Personal", trim: true },
    content: { type: String, default: "", trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
