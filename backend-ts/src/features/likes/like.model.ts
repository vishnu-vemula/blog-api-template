import mongoose, { Schema, Document } from 'mongoose';
import { ILike } from './like.types.js';

export interface ILikeDocument extends Omit<ILike, '_id'>, Document {}

const likeSchema = new Schema<ILikeDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    targetId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['blog', 'comment'], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (_, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index to ensure one like per user per target
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export const LikeModel = mongoose.model<ILikeDocument>('Like', likeSchema);
