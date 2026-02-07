import { Request, Response, NextFunction } from 'express';
import { categoryService } from './category.service.js';
import { ICategoryCreate, ICategoryUpdate } from './category.types.js';

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData: ICategoryCreate = req.body;
      const category = await categoryService.create(categoryData);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params;
      const category = await categoryService.getById(categoryId);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await categoryService.getBySlug(slug);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await categoryService.getAll(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params;
      const updateData: ICategoryUpdate = req.body;
      const category = await categoryService.update(categoryId, updateData);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params;
      await categoryService.delete(categoryId);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getTree();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
