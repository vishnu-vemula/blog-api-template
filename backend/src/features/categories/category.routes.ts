import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const createCategoryValidation = [
  body('name').notEmpty().trim().isLength({ max: 100 }).withMessage('Name is required (max 100 chars)'),
  body('description').optional().isLength({ max: 500 }),
  body('parentId').optional().isString(),
];

const updateCategoryValidation = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('parentId').optional().isString(),
  body('isActive').optional().isBoolean(),
];

// Public routes
router.get('/', categoryController.getAll.bind(categoryController));
router.get('/tree', categoryController.getTree.bind(categoryController));
router.get('/slug/:slug', categoryController.getBySlug.bind(categoryController));
router.get('/:categoryId', categoryController.getById.bind(categoryController));

// Protected routes (admin only in real app)
router.post('/', authMiddleware, requireRole(['admin', 'superadmin']), createCategoryValidation, validateRequest, categoryController.create.bind(categoryController));
router.put('/:categoryId', authMiddleware, requireRole(['admin', 'superadmin']), updateCategoryValidation, validateRequest, categoryController.update.bind(categoryController));
router.delete('/:categoryId', authMiddleware, requireRole(['admin', 'superadmin']), categoryController.delete.bind(categoryController));

export default router;
