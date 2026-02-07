import { Router } from 'express';
import { commentController } from './comment.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const createCommentValidation = [
  body('blogId').notEmpty().withMessage('Blog ID is required'),
  body('content').notEmpty().isLength({ max: 2000 }).withMessage('Content is required (max 2000 chars)'),
  body('parentId').optional().isString(),
];

const updateCommentValidation = [
  body('content').notEmpty().isLength({ max: 2000 }).withMessage('Content is required (max 2000 chars)'),
];

// Public routes
router.get('/blog/:blogId', commentController.getByBlog.bind(commentController));
router.get('/author/:authorId', commentController.getByAuthor.bind(commentController));
router.get('/:commentId', commentController.getById.bind(commentController));

// Protected routes
router.post('/', authMiddleware, createCommentValidation, validateRequest, commentController.create.bind(commentController));
router.put('/:commentId', authMiddleware, updateCommentValidation, validateRequest, commentController.update.bind(commentController));
router.delete('/:commentId', authMiddleware, commentController.delete.bind(commentController));

export default router;
