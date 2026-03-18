import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStar extends Document {
  snippetId: string;
  userId: string;
  createdAt: Date;
}

const StarSchema = new Schema<IStar>(
  {
    snippetId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

StarSchema.index({ snippetId: 1, userId: 1 }, { unique: true });

const Star: Model<IStar> =
  mongoose.models.Star || mongoose.model<IStar>("Star", StarSchema);

export default Star;
