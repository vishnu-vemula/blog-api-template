import { Request, Response, NextFunction } from 'express';
import { blogService } from './blog.service.js';
import { IBlogCreate, IBlogUpdate, IBlogFilters } from './blog.types.js';

export class BlogController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const blogData: IBlogCreate = req.body;
      const blog = await blogService.create(authorId, blogData);
      res.status(201).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { blogId } = req.params;
      const blog = await blogService.getById(blogId, true);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBySlug(slug, true);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: IBlogFilters = {};

      if (req.query.categoryId) filters.categoryId = req.query.categoryId as string;
      if (req.query.tags) filters.tags = (req.query.tags as string).split(',');
      if (req.query.search) filters.search = req.query.search as string;

      const result = await blogService.getAll(page, limit, filters);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { authorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const requesterId = req.user?.userId;

      const result = await blogService.getByAuthor(authorId, page, limit, requesterId);
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
      const { blogId } = req.params;
      const updateData: IBlogUpdate = req.body;
      const blog = await blogService.update(blogId, authorId, updateData);
      res.status(200).json({ success: true, data: blog });
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
      const { blogId } = req.params;
      await blogService.delete(blogId, authorId);
      res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { blogId } = req.params;
      const blog = await blogService.publish(blogId, authorId);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async unpublish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { blogId } = req.params;
      const blog = await blogService.unpublish(blogId, authorId);
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  async getPopular(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const blogs = await blogService.getPopular(limit);
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      next(error);
    }
  }

  async getByTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tag } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await blogService.getByTag(tag, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMyBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.userId;
      if (!authorId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const result = await blogService.getMyBlogs(authorId, page, limit, status);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
