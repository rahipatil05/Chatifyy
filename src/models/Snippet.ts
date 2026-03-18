import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISnippet extends Document {
  title: string;
  language: string;
  code: string;
  userName: string;
  userId: string;
  createdAt: Date;
}

const SnippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    userName: { type: String, required: true, default: "Anonymous" },
    userId: { type: String, required: true, default: "anonymous" },
  },
  { timestamps: true }
);

const Snippet: Model<ISnippet> =
  mongoose.models.Snippet || mongoose.model<ISnippet>("Snippet", SnippetSchema);

export default Snippet;
