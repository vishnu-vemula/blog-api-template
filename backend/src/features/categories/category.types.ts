// Category Types
export interface ICategory {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  blogCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
  parentId?: string;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  blogCount: number;
  createdAt: Date;
  updatedAt: Date;
}
