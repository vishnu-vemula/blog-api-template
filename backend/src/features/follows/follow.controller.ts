import { Request, Response, NextFunction } from 'express';
import { followService } from './follow.service.js';

export class FollowController {
  async toggleFollow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const followerId = req.user?.userId;
      if (!followerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ success: false, message: 'userId is required' });
        return;
      }
      const result = await followService.toggleFollow(followerId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getFollowStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.userId;
      const targetUserId = req.params.userId as string;
      const status = await followService.getFollowStatus(currentUserId, targetUserId);
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const currentUserId = req.user?.userId;
      const result = await followService.getFollowers(userId, page, limit, currentUserId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const currentUserId = req.user?.userId;
      const result = await followService.getFollowing(userId, page, limit, currentUserId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const followController = new FollowController();
