import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../features/api-keys/api-key.service.js';
import { UserModel } from '../features/users/user.model.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      authType?: 'jwt' | 'api-key';
    }
  }
}

export const apiKeyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return next(); // No API key, proceed (optional auth) or let subsequent middleware handle it
    }

    const validKey = await apiKeyService.validateKey(apiKey);

    if (validKey) {
      const user = await UserModel.findOne({ id: validKey.userId });
      if (user) {
        req.user = user;
        req.authType = 'api-key';
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireApiKeyOrJwt = async (req: Request, res: Response, next: NextFunction) => {
  // If user is already authenticated via JWT (previous middleware) or API Key (apiKeyMiddleware), proceed
  if (req.user) {
    return next();
  }

  // If no user, unauthorized
  res.status(401).json({ success: false, message: 'Unauthorized. Please provide a valid token or API Key.' });
};
