import crypto from 'crypto';
import { ApiKeyModel, IApiKey } from './api-key.model';
import { UserModel } from '../users/user.model';

export class ApiKeyService {
  /**
   * Generates a new API key for a user.
   * Returns the plain text key (only shown once) and saves the hash.
   */
  async createApiKey(userId: string, name: string): Promise<{ key: string; apiKey: IApiKey }> {
    const user = await UserModel.findOne({ id: userId });
    if (!user) throw new Error('User not found');

    // Generate a random key
    const key = crypto.randomBytes(32).toString('hex');
    const prefix = key.substring(0, 7);
    
    // Hash the key for storage
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');

    const apiKey = await ApiKeyModel.create({
      user: user._id,
      name,
      key: hashedKey,
      prefix,
    });

    return { key, apiKey };
  }

  async getUserApiKeys(userId: string): Promise<IApiKey[]> {
    const user = await UserModel.findOne({ id: userId });
    if (!user) return [];
    
    return ApiKeyModel.find({ user: user._id }).sort({ createdAt: -1 });
  }

  async deleteApiKey(userId: string, apiKeyId: string): Promise<void> {
    const user = await UserModel.findOne({ id: userId });
    if (!user) return;

    await ApiKeyModel.findOneAndDelete({ _id: apiKeyId, user: user._id });
  }

  async validateApiKey(key: string): Promise<IApiKey | null> {
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    const apiKey = await ApiKeyModel.findOne({ key: hashedKey, isActive: true }).populate('user');
    
    if (apiKey) {
      apiKey.lastUsed = new Date();
      await apiKey.save();
    }
    
    return apiKey;
  }
}

export const apiKeyService = new ApiKeyService();
