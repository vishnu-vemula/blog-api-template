import { FollowModel, IFollowDocument } from './follow.model.js';

export class FollowRepository {
  async create(followData: { id: string; followerId: string; followingId: string }): Promise<IFollowDocument> {
    const follow = new FollowModel(followData);
    return await follow.save();
  }

  async delete(followerId: string, followingId: string): Promise<IFollowDocument | null> {
    return await FollowModel.findOneAndDelete({ followerId, followingId });
  }

  async findByPair(followerId: string, followingId: string): Promise<IFollowDocument | null> {
    return await FollowModel.findOne({ followerId, followingId });
  }

  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ follows: IFollowDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [follows, total] = await Promise.all([
      FollowModel.find({ followingId: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      FollowModel.countDocuments({ followingId: userId }),
    ]);
    return { follows, total };
  }

  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ follows: IFollowDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [follows, total] = await Promise.all([
      FollowModel.find({ followerId: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      FollowModel.countDocuments({ followerId: userId }),
    ]);
    return { follows, total };
  }

  async getFollowersCount(userId: string): Promise<number> {
    return await FollowModel.countDocuments({ followingId: userId });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return await FollowModel.countDocuments({ followerId: userId });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await FollowModel.findOne({ followerId, followingId });
    return !!follow;
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const follows = await FollowModel.find({ followerId: userId }).select('followingId');
    return follows.map((f) => f.followingId);
  }
}

export const followRepository = new FollowRepository();
