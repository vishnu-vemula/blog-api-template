import mongoose, { Document, Schema } from 'mongoose';

export interface IApiKey extends Document {
  key: string; // Hashed key
  prefix: string; // First 7 chars of the original key
  name: string;
  user: mongoose.Types.ObjectId;
  lastUsed: Date;
  isActive: boolean;
  createdAt: Date;
}

const apiKeySchema = new Schema<IApiKey>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUsed: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ApiKeyModel = mongoose.model<IApiKey>('ApiKey', apiKeySchema);
