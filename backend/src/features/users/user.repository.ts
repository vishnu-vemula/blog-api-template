import { UserModel, IUserDocument } from './user.model.js';
import { IUserCreate, IUserUpdate } from './user.types.js';

export class UserRepository {
  async create(userData: IUserCreate & { id: string }): Promise<IUserDocument> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ id, isActive: true });
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ username });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: IUserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find({ isActive: true }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments({ isActive: true }),
    ]);
    return { users, total };
  }

  async update(id: string, updateData: IUserUpdate): Promise<IUserDocument | null> {
    return await UserModel.findOneAndUpdate(
      { id, isActive: true },
      { $set: updateData },
      { new: true }
    );
  }

  async delete(id: string): Promise<IUserDocument | null> {
    return await UserModel.findOneAndUpdate(
      { id },
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async updatePassword(id: string, hashedPassword: string): Promise<IUserDocument | null> {
    return await UserModel.findOneAndUpdate(
      { id },
      { $set: { password: hashedPassword } },
      { new: true }
    );
  }
}

export const userRepository = new UserRepository();
