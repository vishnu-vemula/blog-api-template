// User Types
export interface IUser {
  _id?: string;
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'author';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}
