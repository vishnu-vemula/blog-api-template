import { CommentModel, ICommentDocument } from './comment.model.js';
import { ICommentCreate, ICommentUpdate } from './comment.types.js';

export class CommentRepository {
  async create(commentData: ICommentCreate & { id: string; authorId: string }): Promise<ICommentDocument> {
    const comment = new CommentModel(commentData);
    return await comment.save();
  }

  async findById(id: string): Promise<ICommentDocument | null> {
    return await CommentModel.findOne({ id, isDeleted: false });
  }

  async findByBlog(blogId: string, page: number = 1, limit: number = 20): Promise<{ comments: ICommentDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { blogId, parentId: null, isDeleted: false };
    const [comments, total] = await Promise.all([
      CommentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      CommentModel.countDocuments(query),
    ]);
    return { comments, total };
  }

  async findReplies(parentId: string): Promise<ICommentDocument[]> {
    return await CommentModel.find({ parentId, isDeleted: false }).sort({ createdAt: 1 });
  }

  async update(id: string, updateData: ICommentUpdate): Promise<ICommentDocument | null> {
    return await CommentModel.findOneAndUpdate(
      { id, isDeleted: false },
      { $set: { ...updateData, isEdited: true } },
      { new: true }
    );
  }

  async delete(id: string): Promise<ICommentDocument | null> {
    return await CommentModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true, content: '[Comment deleted]' } },
      { new: true }
    );
  }

  async countByBlog(blogId: string): Promise<number> {
    return await CommentModel.countDocuments({ blogId, isDeleted: false });
  }

  async updateLikeCount(id: string, increment: number): Promise<void> {
    await CommentModel.updateOne({ id }, { $inc: { likeCount: increment } });
  }

  async findByAuthor(authorId: string, page: number = 1, limit: number = 20): Promise<{ comments: ICommentDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { authorId, isDeleted: false };
    const [comments, total] = await Promise.all([
      CommentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      CommentModel.countDocuments(query),
    ]);
    return { comments, total };
  }
}

export const commentRepository = new CommentRepository();
