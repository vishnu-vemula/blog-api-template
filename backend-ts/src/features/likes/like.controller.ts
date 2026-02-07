import { Request, Response, NextFunction } from 'express';
import { likeService } from './like.service.js';
import { ILikeCreate } from './like.types.js';

export class LikeController {
  async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const likeData: ILikeCreate = req.body;
      const result = await likeService.toggleLike(userId, likeData);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getLikeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { targetId, targetType } = req.params;
      const result = await likeService.getLikeStatus(userId, targetId, targetType as 'blog' | 'comment');
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const targetType = req.query.targetType as string | undefined;
      const result = await likeService.getUserLikes(userId, targetType, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTargetLikers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { targetId, targetType } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await likeService.getTargetLikers(targetId, targetType as 'blog' | 'comment', page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const likeController = new LikeController();
