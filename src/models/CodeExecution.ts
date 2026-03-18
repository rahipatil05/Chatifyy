import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICodeExecution extends Document {
  language: string;
  code: string;
  output?: string;
  error?: string;
  createdAt: Date;
}

const CodeExecutionSchema = new Schema<ICodeExecution>(
  {
    language: { type: String, required: true },
    code: { type: String, required: true },
    output: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

const CodeExecution: Model<ICodeExecution> =
  mongoose.models.CodeExecution ||
  mongoose.model<ICodeExecution>("CodeExecution", CodeExecutionSchema);

export default CodeExecution;
