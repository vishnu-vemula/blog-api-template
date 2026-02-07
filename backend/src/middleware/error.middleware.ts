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
