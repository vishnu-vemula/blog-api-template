import { v4 as uuidv4 } from 'uuid';
import { followRepository } from './follow.repository.js';
import { userRepository } from '../users/user.repository.js';
import { IFollowStatus, IFollowUserSummary, IFollowListResponse } from './follow.types.js';

export class FollowService {
  async toggleFollow(followerId: string, followingId: string): Promise<{ followed: boolean }> {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const targetUser = await userRepository.findById(followingId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    const existing = await followRepository.findByPair(followerId, followingId);

    if (existing) {
      await followRepository.delete(followerId, followingId);
      return { followed: false };
    } else {
      await followRepository.create({
        id: uuidv4(),
        followerId,
        followingId,
      });
      return { followed: true };
    }
  }

  async getFollowStatus(currentUserId: string | undefined, targetUserId: string): Promise<IFollowStatus> {
    const [followersCount, followingCount, isFollowing] = await Promise.all([
      followRepository.getFollowersCount(targetUserId),
      followRepository.getFollowingCount(targetUserId),
      currentUserId ? followRepository.isFollowing(currentUserId, targetUserId) : Promise.resolve(false),
    ]);

    return { isFollowing, followersCount, followingCount };
  }

  async getFollowers(
    userId: string,
    page: number,
    limit: number,
    currentUserId?: string
  ): Promise<IFollowListResponse> {
    const { follows, total } = await followRepository.getFollowers(userId, page, limit);

    // Get the follower user details
    const currentFollowingIds = currentUserId
      ? new Set(await followRepository.getFollowingIds(currentUserId))
      : new Set<string>();

    const users: IFollowUserSummary[] = [];
    for (const follow of follows) {
      const user = await userRepository.findById(follow.followerId);
      if (user) {
        users.push({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          bio: user.bio,
          isFollowing: currentUserId ? currentFollowingIds.has(user.id) : undefined,
        });
      }
    }

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFollowing(
    userId: string,
    page: number,
    limit: number,
    currentUserId?: string
  ): Promise<IFollowListResponse> {
    const { follows, total } = await followRepository.getFollowing(userId, page, limit);

    const currentFollowingIds = currentUserId
      ? new Set(await followRepository.getFollowingIds(currentUserId))
      : new Set<string>();

    const users: IFollowUserSummary[] = [];
    for (const follow of follows) {
      const user = await userRepository.findById(follow.followingId);
      if (user) {
        users.push({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          bio: user.bio,
          isFollowing: currentUserId ? currentFollowingIds.has(user.id) : undefined,
        });
      }
    }

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const followService = new FollowService();
