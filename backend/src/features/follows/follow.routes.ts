import { Router } from 'express';
import { followController } from './follow.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

const toggleFollowValidation = [
  body('userId').notEmpty().withMessage('userId is required'),
];

// Protected routes
router.post('/toggle', authMiddleware, toggleFollowValidation, validateRequest, followController.toggleFollow.bind(followController));

// Public routes (optionalAuth to check if current user follows them)
router.get('/status/:userId', optionalAuthMiddleware, followController.getFollowStatus.bind(followController));
router.get('/:userId/followers', optionalAuthMiddleware, followController.getFollowers.bind(followController));
router.get('/:userId/following', optionalAuthMiddleware, followController.getFollowing.bind(followController));

export default router;
