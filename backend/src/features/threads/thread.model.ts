import mongoose, { Schema, Document } from 'mongoose';
import { IThread } from './thread.types.js';

export interface IThreadDocument extends Omit<IThread, '_id'>, Document {}

const threadSchema = new Schema<IThreadDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 500 },
    authorId: { type: String, required: true, index: true },
    blogIds: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    isPublic: { type: Boolean, default: true },
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

threadSchema.index({ authorId: 1, createdAt: -1 });

export const ThreadModel = mongoose.model<IThreadDocument>('Thread', threadSchema);
