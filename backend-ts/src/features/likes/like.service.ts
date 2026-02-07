import { v4 as uuidv4 } from 'uuid';
import { likeRepository } from './like.repository.js';
import { ILikeCreate, ILikeResponse, ILikeStatus } from './like.types.js';
import { ILikeDocument } from './like.model.js';
import { blogRepository } from '../blogs/blog.repository.js';
import { commentRepository } from '../comments/comment.repository.js';

export class LikeService {
  private toLikeResponse(like: ILikeDocument): ILikeResponse {
    return {
      id: like.id,
      userId: like.userId,
      targetId: like.targetId,
      targetType: like.targetType,
      createdAt: like.createdAt,
    };
  }

  async toggleLike(userId: string, likeData: ILikeCreate): Promise<{ action: 'liked' | 'unliked'; likeCount: number }> {
    // Verify target exists
    if (likeData.targetType === 'blog') {
      const blog = await blogRepository.findById(likeData.targetId);
      if (!blog) {
        throw new Error('Blog not found');
      }
    } else if (likeData.targetType === 'comment') {
      const comment = await commentRepository.findById(likeData.targetId);
      if (!comment) {
        throw new Error('Comment not found');
      }
    }

    // Check if already liked
    const existingLike = await likeRepository.findByUserAndTarget(userId, likeData.targetId, likeData.targetType);

    if (existingLike) {
      // Unlike
      await likeRepository.delete(userId, likeData.targetId, likeData.targetType);
      
      // Update target like count
      if (likeData.targetType === 'blog') {
        await blogRepository.updateLikeCount(likeData.targetId, -1);
      } else {
        await commentRepository.updateLikeCount(likeData.targetId, -1);
      }

      const likeCount = await likeRepository.countByTarget(likeData.targetId, likeData.targetType);
      return { action: 'unliked', likeCount };
    } else {
      // Like
      await likeRepository.create({
        ...likeData,
        id: uuidv4(),
        userId,
      });

      // Update target like count
      if (likeData.targetType === 'blog') {
        await blogRepository.updateLikeCount(likeData.targetId, 1);
      } else {
        await commentRepository.updateLikeCount(likeData.targetId, 1);
      }

      const likeCount = await likeRepository.countByTarget(likeData.targetId, likeData.targetType);
      return { action: 'liked', likeCount };
    }
  }

  async getLikeStatus(userId: string | undefined, targetId: string, targetType: 'blog' | 'comment'): Promise<ILikeStatus> {
    const likeCount = await likeRepository.countByTarget(targetId, targetType);
    
    if (!userId) {
      return { isLiked: false, likeCount };
    }

    const existingLike = await likeRepository.findByUserAndTarget(userId, targetId, targetType);
    return { isLiked: !!existingLike, likeCount };
  }

  async getUserLikes(userId: string, targetType: string | undefined, page: number, limit: number): Promise<{ likes: ILikeResponse[]; total: number; page: number; totalPages: number }> {
    const { likes, total } = await likeRepository.findByUser(userId, targetType, page, limit);
    return {
      likes: likes.map(this.toLikeResponse),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTargetLikers(targetId: string, targetType: 'blog' | 'comment', page: number, limit: number): Promise<{ likes: ILikeResponse[]; total: number; page: number; totalPages: number }> {
    const { likes, total } = await likeRepository.findUsersByTarget(targetId, targetType, page, limit);
    return {
      likes: likes.map(this.toLikeResponse),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const likeService = new LikeService();
