import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../features/api-keys/api-key.service.js';
import { IUserDocument } from '../features/users/user.model.js';
import { ITokenPayload } from '../features/users/user.types.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
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

    const validKey = await apiKeyService.validateApiKey(apiKey);

    if (validKey && validKey.user) {
      // validKey.user is populated, so we cast it
      const user = validKey.user as unknown as IUserDocument;
      
      req.user = {
        userId: user.id, // The explicit 'id' field from User model
        email: user.email,
        role: user.role
      };
      req.authType = 'api-key';
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
