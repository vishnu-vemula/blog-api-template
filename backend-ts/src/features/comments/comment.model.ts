import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from './comment.types.js';

export interface ICommentDocument extends Omit<IComment, '_id'>, Document {}

const commentSchema = new Schema<ICommentDocument>(
  {
    id: { type: String, required: true, unique: true },
    blogId: { type: String, required: true, index: true },
    authorId: { type: String, required: true, index: true },
    parentId: { type: String, default: null, index: true },
    content: { type: String, required: true, maxlength: 2000 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

commentSchema.index({ blogId: 1, createdAt: -1 });

export const CommentModel = mongoose.model<ICommentDocument>('Comment', commentSchema);
