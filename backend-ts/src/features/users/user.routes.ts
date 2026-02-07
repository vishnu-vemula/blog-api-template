import { Router } from 'express';
import { userController } from './user.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('username').isLength({ min: 3, max: 30 }).trim().withMessage('Username must be 3-30 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
];

const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Public routes
router.post('/register', registerValidation, validateRequest, userController.register.bind(userController));
router.post('/login', loginValidation, validateRequest, userController.login.bind(userController));

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile.bind(userController));
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, userController.updateProfile.bind(userController));
router.delete('/profile', authMiddleware, userController.deleteAccount.bind(userController));
router.put('/change-password', authMiddleware, changePasswordValidation, validateRequest, userController.changePassword.bind(userController));

// Public user browsing
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:userId', userController.getUserById.bind(userController));

export default router;
