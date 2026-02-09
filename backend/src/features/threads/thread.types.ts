// Thread Types
export interface IThread {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  authorId: string;
  blogIds: string[]; // Ordered array of blog IDs in the thread
  status: 'draft' | 'published';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IThreadCreate {
  title: string;
  description?: string;
  blogIds?: string[];
  status?: 'draft' | 'published';
  isPublic?: boolean;
}

export interface IThreadUpdate {
  title?: string;
  description?: string;
  blogIds?: string[];
  status?: 'draft' | 'published';
  isPublic?: boolean;
}

export interface IThreadResponse {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  blogIds: string[];
  blogs?: IThreadBlogSummary[];
  status: string;
  isPublic: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IThreadBlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  status: string;
  order: number;
  createdAt: Date;
}

export interface IThreadListResponse {
  threads: IThreadResponse[];
  total: number;
  page: number;
  totalPages: number;
}
