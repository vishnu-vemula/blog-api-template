import { Request, Response, NextFunction } from 'express';
import { threadService } from './thread.service.js';
import { IThreadCreate, IThreadUpdate } from './thread.types.js';

export class ThreadController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const threadData: IThreadCreate = req.body;
      const thread = await threadService.create(authorId, threadData);
      res.status(201).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const threadId = req.params.threadId as string;
      const thread = await threadService.getById(threadId, true);
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await threadService.getAll(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.params.authorId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await threadService.getByAuthor(authorId, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMyThreads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await threadService.getMyThreads(authorId, page, limit);
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
      const threadId = req.params.threadId as string;
      const updateData: IThreadUpdate = req.body;
      const thread = await threadService.update(threadId, authorId, updateData);
      res.status(200).json({ success: true, data: thread });
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
      const threadId = req.params.threadId as string;
      await threadService.delete(threadId, authorId);
      res.status(200).json({ success: true, message: 'Thread deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const threadId = req.params.threadId as string;
      const { blogId } = req.body;
      const thread = await threadService.addBlog(threadId, authorId, blogId);
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }

  async removeBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const threadId = req.params.threadId as string;
      const blogId = req.params.blogId as string;
      const thread = await threadService.removeBlog(threadId, authorId, blogId);
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }

  async reorderBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const threadId = req.params.threadId as string;
      const { blogIds } = req.body;
      const thread = await threadService.reorderBlogs(threadId, authorId, blogIds);
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }

  async getThreadByBlogId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogId = req.params.blogId as string;
      const thread = await threadService.getThreadByBlogId(blogId);
      if (!thread) {
        res.status(200).json({ success: true, data: null });
        return;
      }
      res.status(200).json({ success: true, data: thread });
    } catch (error) {
      next(error);
    }
  }
}

export const threadController = new ThreadController();
