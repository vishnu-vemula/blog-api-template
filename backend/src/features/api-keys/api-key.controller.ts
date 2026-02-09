import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from './api-key.service';

export class ApiKeyController {
  async createApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // @ts-ignore - user is attached by auth middleware
      const userId = req.user.userId;
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
      }

      const { key, apiKey } = await apiKeyService.createApiKey(userId, name);

      res.status(201).json({
        success: true,
        data: {
          key, // Plain text key, show only once
          id: apiKey._id,
          name: apiKey.name,
          createdAt: apiKey.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const apiKeys = await apiKeyService.getUserApiKeys(userId);

      // Don't return the hashed key
      const safeApiKeys = apiKeys.map(k => ({
        id: k._id,
        name: k.name,
        prefix: k.prefix,
        lastUsed: k.lastUsed,
        createdAt: k.createdAt,
        isActive: k.isActive
      }));

      res.status(200).json({ success: true, data: safeApiKeys });
    } catch (error) {
      next(error);
    }
  }

  async deleteApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const { id } = req.params;

      if (typeof id !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid API key ID' });
        return;
      }

      await apiKeyService.deleteApiKey(userId, id);
      res.status(200).json({ success: true, message: 'API key deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const apiKeyController = new ApiKeyController();
