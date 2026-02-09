import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category.types.js';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '', maxlength: 500 },
    parentId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    blogCount: { type: Number, default: 0 },
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

categorySchema.index({ parentId: 1 });

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);
