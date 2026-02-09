import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);
  
  // Handle known errors
  const errorMessages: Record<string, number> = {
    'Email already registered': 409,
    'Username already taken': 409,
    'Invalid credentials': 401,
    'Account is deactivated': 403,
    'User not found': 404,
    'Blog not found': 404,
    'Category not found': 404,
    'Comment not found': 404,
    'Parent comment not found': 404,
    'Not authorized': 403,
    'Category with this name already exists': 409,
    'Blog not available': 404,
    'Current password is incorrect': 400,
    'Thread not found': 404,
    'Not authorized to update this thread': 403,
    'Not authorized to delete this thread': 403,
    'Not authorized to modify this thread': 403,
    'does not belong to you': 403,
    'is already in thread': 409,
    'is already in this thread': 409,
    'Blog is already in another thread': 409,
    'Reorder must contain the same blog IDs': 400,
    'Failed to update thread': 500,
    'Failed to add blog to thread': 500,
    'Failed to remove blog from thread': 500,
    'You cannot follow yourself': 400,
  };

  for (const [message, statusCode] of Object.entries(errorMessages)) {
    if (err.message.includes(message)) {
      res.status(statusCode).json({ success: false, message: err.message });
      return;
    }
  }

  // Handle MongoDB duplicate key error
  if (err.message.includes('duplicate key') || err.message.includes('E11000')) {
    res.status(409).json({ success: false, message: 'Resource already exists' });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
