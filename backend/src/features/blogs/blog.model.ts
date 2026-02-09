import mongoose, { Schema, Document } from 'mongoose';
import { IBlog } from './blog.types.js';

export interface IBlogDocument extends Omit<IBlog, '_id'>, Document {}

const blogSchema = new Schema<IBlogDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true }, // Rich text as HTML/JSON
    excerpt: { type: String, required: true, maxlength: 500 },
    coverImage: { type: String, default: '' },
    authorId: { type: String, required: true, index: true },
    categoryId: { type: String, default: null, index: true },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    isPublic: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
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

blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });

export const BlogModel = mongoose.model<IBlogDocument>('Blog', blogSchema);
