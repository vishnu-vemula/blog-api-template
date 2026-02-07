import { LikeModel, ILikeDocument } from './like.model.js';
import { ILikeCreate } from './like.types.js';

export class LikeRepository {
  async create(likeData: ILikeCreate & { id: string; userId: string }): Promise<ILikeDocument> {
    const like = new LikeModel(likeData);
    return await like.save();
  }

  async findByUserAndTarget(userId: string, targetId: string, targetType: string): Promise<ILikeDocument | null> {
    return await LikeModel.findOne({ userId, targetId, targetType });
  }

  async delete(userId: string, targetId: string, targetType: string): Promise<ILikeDocument | null> {
    return await LikeModel.findOneAndDelete({ userId, targetId, targetType });
  }

  async countByTarget(targetId: string, targetType: string): Promise<number> {
    return await LikeModel.countDocuments({ targetId, targetType });
  }

  async findByUser(userId: string, targetType?: string, page: number = 1, limit: number = 20): Promise<{ likes: ILikeDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, string> = { userId };
    if (targetType) query.targetType = targetType;

    const [likes, total] = await Promise.all([
      LikeModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      LikeModel.countDocuments(query),
    ]);
    return { likes, total };
  }

  async findUsersByTarget(targetId: string, targetType: string, page: number = 1, limit: number = 20): Promise<{ likes: ILikeDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [likes, total] = await Promise.all([
      LikeModel.find({ targetId, targetType }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      LikeModel.countDocuments({ targetId, targetType }),
    ]);
    return { likes, total };
  }
}

export const likeRepository = new LikeRepository();
