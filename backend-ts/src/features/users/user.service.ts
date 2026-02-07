import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userRepository } from './user.repository.js';
import { IUserCreate, IUserUpdate, IUserLogin, IUserResponse, IAuthResponse, ITokenPayload } from './user.types.js';
import { IUserDocument } from './user.model.js';

export class UserService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  private toUserResponse(user: IUserDocument): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private generateToken(user: IUserDocument): string {
    const payload: ITokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
  }

  async register(userData: IUserCreate): Promise<IAuthResponse> {
    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await userRepository.create({
      ...userData,
      id: uuidv4(),
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user: this.toUserResponse(user), token };
  }

  async login(credentials: IUserLogin): Promise<IAuthResponse> {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user: this.toUserResponse(user), token };
  }

  async getProfile(userId: string): Promise<IUserResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toUserResponse(user);
  }

  async updateProfile(userId: string, updateData: IUserUpdate): Promise<IUserResponse> {
    const user = await userRepository.update(userId, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toUserResponse(user);
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await userRepository.delete(userId);
    if (!user) {
      throw new Error('User not found');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(userId, hashedPassword);
  }

  async getAllUsers(page: number, limit: number): Promise<{ users: IUserResponse[]; total: number; page: number; totalPages: number }> {
    const { users, total } = await userRepository.findAll(page, limit);
    return {
      users: users.map(this.toUserResponse),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(userId: string): Promise<IUserResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.toUserResponse(user);
  }
}

export const userService = new UserService();
