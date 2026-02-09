import { Document } from 'mongoose';

export interface IApiKey {
  _id?: string;
  userId: string;
  name: string;
  key: string; // We will store a hash, but for the interface it's a string
  prefix: string; // First few chars to identify/display
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApiKeyDto {
  name: string;
}
