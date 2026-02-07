import { Request, Response, NextFunction } from 'express';
import { commentService } from './comment.service.js';
import { ICommentCreate, ICommentUpdate } from './comment.types.js';

export class CommentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const commentData: ICommentCreate = req.body;
      const comment = await commentService.create(authorId, commentData);
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const commentId = req.params.commentId as string;
      const comment = await commentService.getById(commentId);
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async getByBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogId = req.params.blogId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await commentService.getByBlog(blogId, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const commentId = req.params.commentId as string;
      const updateData: ICommentUpdate = req.body;
      const comment = await commentService.update(commentId, authorId, updateData);
      res.status(200).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const commentId = req.params.commentId as string;
      await commentService.delete(commentId, authorId);
      res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.params.authorId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await commentService.getByAuthor(authorId, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
