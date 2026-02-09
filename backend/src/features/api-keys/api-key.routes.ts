import { Router } from 'express';
import { apiKeyController } from './api-key.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Protect all routes
router.use(authMiddleware);

router.post('/', apiKeyController.createApiKey.bind(apiKeyController));
router.get('/', apiKeyController.getApiKeys.bind(apiKeyController));
router.delete('/:id', apiKeyController.deleteApiKey.bind(apiKeyController));

export default router;
