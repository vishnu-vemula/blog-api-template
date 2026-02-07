import { BlogModel, IBlogDocument } from './blog.model.js';
import { IBlogUpdate, IBlogFilters } from './blog.types.js';

interface IBlogCreateInternal {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  authorId: string;
  categoryId?: string;
  tags: string[];
  status: 'draft' | 'published';
  isPublic: boolean;
}

export class BlogRepository {
  async create(blogData: IBlogCreateInternal): Promise<IBlogDocument> {
    const blog = new BlogModel(blogData);
    return await blog.save();
  }

  async findById(id: string): Promise<IBlogDocument | null> {
    return await BlogModel.findOne({ id });
  }

  async findBySlug(slug: string): Promise<IBlogDocument | null> {
    return await BlogModel.findOne({ slug });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: IBlogFilters = {},
    includePrivate: boolean = false
  ): Promise<{ blogs: IBlogDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};

    if (!includePrivate) {
      query.status = 'published';
      query.isPublic = true;
    }

    if (filters.authorId) query.authorId = filters.authorId;
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.status) query.status = filters.status;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const [blogs, total] = await Promise.all([
      BlogModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      BlogModel.countDocuments(query),
    ]);
    return { blogs, total };
  }

  async findByAuthor(authorId: string, page: number = 1, limit: number = 10): Promise<{ blogs: IBlogDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      BlogModel.find({ authorId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      BlogModel.countDocuments({ authorId }),
    ]);
    return { blogs, total };
  }

  async update(id: string, updateData: Partial<IBlogUpdate & { slug?: string }>): Promise<IBlogDocument | null> {
    return await BlogModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
  }

  async delete(id: string): Promise<IBlogDocument | null> {
    return await BlogModel.findOneAndDelete({ id });
  }

  async incrementViewCount(id: string): Promise<void> {
    await BlogModel.updateOne({ id }, { $inc: { viewCount: 1 } });
  }

  async updateLikeCount(id: string, increment: number): Promise<void> {
    await BlogModel.updateOne({ id }, { $inc: { likeCount: increment } });
  }

  async updateCommentCount(id: string, increment: number): Promise<void> {
    await BlogModel.updateOne({ id }, { $inc: { commentCount: increment } });
  }

  async findPopular(limit: number = 10): Promise<IBlogDocument[]> {
    return await BlogModel.find({ status: 'published', isPublic: true })
      .sort({ viewCount: -1, likeCount: -1 })
      .limit(limit);
  }

  async findByTag(tag: string, page: number = 1, limit: number = 10): Promise<{ blogs: IBlogDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { tags: tag, status: 'published', isPublic: true };
    const [blogs, total] = await Promise.all([
      BlogModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      BlogModel.countDocuments(query),
    ]);
    return { blogs, total };
  }
}

export const blogRepository = new BlogRepository();
