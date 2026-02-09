import { Router } from 'express';
import { blogController } from './blog.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import { apiKeyMiddleware, requireApiKeyOrJwt } from '../../middleware/api-key.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Apply API Key middleware to all routes (optional auth)
router.use(optionalAuthMiddleware);
router.use(apiKeyMiddleware);

// Validation rules
const createBlogValidation = [
  body('title').notEmpty().trim().isLength({ max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 chars'),
  body('categoryId').optional().isString(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('isPublic').optional().isBoolean(),
];

const updateBlogValidation = [
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be less than 200 chars'),
  body('content').optional(),
  body('excerpt').optional().isLength({ max: 500 }),
  body('categoryId').optional().isString(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('isPublic').optional().isBoolean(),
];

// Protected routes (specific paths MUST come before /:blogId param route)
router.get('/user/my-blogs', requireApiKeyOrJwt, blogController.getMyBlogs.bind(blogController));
router.post('/', requireApiKeyOrJwt, createBlogValidation, validateRequest, blogController.create.bind(blogController));

// Public routes (specific paths before param routes)
router.get('/', blogController.getAll.bind(blogController));
router.get('/popular', blogController.getPopular.bind(blogController));
router.get('/tag/:tag', blogController.getByTag.bind(blogController));
router.get('/slug/:slug', blogController.getBySlug.bind(blogController));
router.get('/author/:authorId', optionalAuthMiddleware, blogController.getByAuthor.bind(blogController));

// Param routes LAST
router.get('/:blogId', blogController.getById.bind(blogController));
router.put('/:blogId', requireApiKeyOrJwt, updateBlogValidation, validateRequest, blogController.update.bind(blogController));
router.delete('/:blogId', requireApiKeyOrJwt, blogController.delete.bind(blogController));
router.post('/:blogId/publish', requireApiKeyOrJwt, blogController.publish.bind(blogController));
router.post('/:blogId/unpublish', requireApiKeyOrJwt, blogController.unpublish.bind(blogController));

export default router;
