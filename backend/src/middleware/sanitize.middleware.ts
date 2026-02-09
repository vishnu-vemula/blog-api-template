import { Request, Response, NextFunction } from 'express';

/**
 * Recursive function to remove keys starting with '$' or containing '.' (standard NoSQL injection vectors)
 * Modifies the object in-place to avoid Express 5 'req.query' assignment issues.
 */
const sanitize = (obj: any) => {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    for (const item of obj) {
      sanitize(item);
    }
    return;
  }

  // Handle Objects
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      sanitize(obj[key]);
    }
  }
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    if (req.query) sanitize(req.query);
    next();
  } catch (error) {
    next(error);
  }
};
