// Blog Types
export interface IBlog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string; // Rich text stored as HTML/JSON string
  excerpt: string;
  coverImage?: string;
  authorId: string;
  categoryId?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogCreate {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  isPublic?: boolean;
}

export interface IBlogUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isPublic?: boolean;
}

export interface IBlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  authorId: string;
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  status: string;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogListResponse {
  blogs: IBlogResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBlogFilters {
  authorId?: string;
  categoryId?: string;
  tags?: string[];
  status?: string;
  search?: string;
}
