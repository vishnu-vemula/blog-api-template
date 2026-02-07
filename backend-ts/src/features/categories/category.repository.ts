import { CategoryModel, ICategoryDocument } from './category.model.js';
import { ICategoryCreate, ICategoryUpdate } from './category.types.js';

export class CategoryRepository {
  async create(categoryData: ICategoryCreate & { id: string; slug: string }): Promise<ICategoryDocument> {
    const category = new CategoryModel(categoryData);
    return await category.save();
  }

  async findById(id: string): Promise<ICategoryDocument | null> {
    return await CategoryModel.findOne({ id, isActive: true });
  }

  async findBySlug(slug: string): Promise<ICategoryDocument | null> {
    return await CategoryModel.findOne({ slug, isActive: true });
  }

  async findAll(page: number = 1, limit: number = 50): Promise<{ categories: ICategoryDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      CategoryModel.find({ isActive: true }).skip(skip).limit(limit).sort({ name: 1 }),
      CategoryModel.countDocuments({ isActive: true }),
    ]);
    return { categories, total };
  }

  async update(id: string, updateData: Partial<ICategoryUpdate & { slug?: string }>): Promise<ICategoryDocument | null> {
    return await CategoryModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
  }

  async delete(id: string): Promise<ICategoryDocument | null> {
    return await CategoryModel.findOneAndUpdate({ id }, { $set: { isActive: false } }, { new: true });
  }

  async updateBlogCount(id: string, increment: number): Promise<void> {
    await CategoryModel.updateOne({ id }, { $inc: { blogCount: increment } });
  }

  async findByParent(parentId: string | null): Promise<ICategoryDocument[]> {
    return await CategoryModel.find({ parentId, isActive: true }).sort({ name: 1 });
  }
}

export const categoryRepository = new CategoryRepository();
