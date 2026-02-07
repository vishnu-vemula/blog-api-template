// Comment Types
export interface IComment {
  _id?: string;
  id: string;
  blogId: string;
  authorId: string;
  parentId?: string; // For nested comments/replies
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentCreate {
  blogId: string;
  content: string;
  parentId?: string;
}

export interface ICommentUpdate {
  content: string;
}

export interface ICommentResponse {
  id: string;
  blogId: string;
  authorId: string;
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  parentId?: string;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  likeCount: number;
  replies?: ICommentResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentListResponse {
  comments: ICommentResponse[];
  total: number;
  page: number;
  totalPages: number;
}
