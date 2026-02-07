import { Router } from 'express';
import { likeController } from './like.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const toggleLikeValidation = [
  body('targetId').notEmpty().withMessage('Target ID is required'),
  body('targetType').isIn(['blog', 'comment']).withMessage('Target type must be blog or comment'),
];

// Public routes
router.get('/status/:targetType/:targetId', optionalAuthMiddleware, likeController.getLikeStatus.bind(likeController));
router.get('/target/:targetType/:targetId', likeController.getTargetLikers.bind(likeController));

// Protected routes
router.post('/toggle', authMiddleware, toggleLikeValidation, validateRequest, likeController.toggleLike.bind(likeController));
router.get('/my-likes', authMiddleware, likeController.getUserLikes.bind(likeController));

export default router;
