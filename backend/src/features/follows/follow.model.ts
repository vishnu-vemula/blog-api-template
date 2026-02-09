import mongoose, { Schema, Document } from 'mongoose';
import { IFollow } from './follow.types.js';

export interface IFollowDocument extends Omit<IFollow, '_id'>, Document {}

const followSchema = new Schema<IFollowDocument>(
  {
    id: { type: String, required: true, unique: true },
    followerId: { type: String, required: true, index: true },
    followingId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index: a user can only follow another user once
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const FollowModel = mongoose.model<IFollowDocument>('Follow', followSchema);
