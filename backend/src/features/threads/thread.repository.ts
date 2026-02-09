import { ThreadModel, IThreadDocument } from './thread.model.js';
import { IThreadUpdate } from './thread.types.js';

interface IThreadCreateInternal {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  blogIds: string[];
  status: 'draft' | 'published';
  isPublic: boolean;
}

export class ThreadRepository {
  async create(threadData: IThreadCreateInternal): Promise<IThreadDocument> {
    const thread = new ThreadModel(threadData);
    return await thread.save();
  }

  async findById(id: string): Promise<IThreadDocument | null> {
    return await ThreadModel.findOne({ id });
  }

  async findByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ threads: IThreadDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [threads, total] = await Promise.all([
      ThreadModel.find({ authorId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ThreadModel.countDocuments({ authorId }),
    ]);
    return { threads, total };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    includePrivate: boolean = false
  ): Promise<{ threads: IThreadDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};

    if (!includePrivate) {
      query.status = 'published';
      query.isPublic = true;
    }

    const [threads, total] = await Promise.all([
      ThreadModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      ThreadModel.countDocuments(query),
    ]);
    return { threads, total };
  }

  async update(id: string, updateData: Partial<IThreadUpdate>): Promise<IThreadDocument | null> {
    return await ThreadModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
  }

  async delete(id: string): Promise<IThreadDocument | null> {
    return await ThreadModel.findOneAndDelete({ id });
  }

  async addBlogToThread(threadId: string, blogId: string): Promise<IThreadDocument | null> {
    return await ThreadModel.findOneAndUpdate(
      { id: threadId },
      { $addToSet: { blogIds: blogId } },
      { new: true }
    );
  }

  async removeBlogFromThread(threadId: string, blogId: string): Promise<IThreadDocument | null> {
    return await ThreadModel.findOneAndUpdate(
      { id: threadId },
      { $pull: { blogIds: blogId } },
      { new: true }
    );
  }

  async reorderBlogs(threadId: string, blogIds: string[]): Promise<IThreadDocument | null> {
    return await ThreadModel.findOneAndUpdate(
      { id: threadId },
      { $set: { blogIds } },
      { new: true }
    );
  }

  async findThreadByBlogId(blogId: string): Promise<IThreadDocument | null> {
    return await ThreadModel.findOne({ blogIds: blogId });
  }
}

export const threadRepository = new ThreadRepository();
