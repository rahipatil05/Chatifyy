import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  snippetId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    snippetId: { type: String, required: true, index: true },
    userId: { type: String, required: true, default: "anonymous" },
    userName: { type: String, required: true, default: "Anonymous" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
