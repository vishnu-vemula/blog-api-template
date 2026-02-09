import { Router } from 'express';
import { threadController } from './thread.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const createThreadValidation = [
  body('title').notEmpty().trim().isLength({ max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 chars'),
  body('blogIds').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('isPublic').optional().isBoolean(),
];

const updateThreadValidation = [
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be less than 200 chars'),
  body('description').optional().isLength({ max: 500 }),
  body('blogIds').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('isPublic').optional().isBoolean(),
];

const addBlogValidation = [
  body('blogId').notEmpty().withMessage('blogId is required'),
];

const reorderValidation = [
  body('blogIds').isArray().withMessage('blogIds must be an array'),
];

// Protected routes (specific paths first to avoid param conflicts)
router.get('/user/my-threads', authMiddleware, threadController.getMyThreads.bind(threadController));
router.post('/', authMiddleware, createThreadValidation, validateRequest, threadController.create.bind(threadController));

// Public routes
router.get('/', threadController.getAll.bind(threadController));
router.get('/author/:authorId', threadController.getByAuthor.bind(threadController));
router.get('/blog/:blogId', threadController.getThreadByBlogId.bind(threadController));
router.get('/:threadId', threadController.getById.bind(threadController));
router.put('/:threadId', authMiddleware, updateThreadValidation, validateRequest, threadController.update.bind(threadController));
router.delete('/:threadId', authMiddleware, threadController.delete.bind(threadController));
router.post('/:threadId/blogs', authMiddleware, addBlogValidation, validateRequest, threadController.addBlog.bind(threadController));
router.delete('/:threadId/blogs/:blogId', authMiddleware, threadController.removeBlog.bind(threadController));
router.put('/:threadId/reorder', authMiddleware, reorderValidation, validateRequest, threadController.reorderBlogs.bind(threadController));

export default router;
