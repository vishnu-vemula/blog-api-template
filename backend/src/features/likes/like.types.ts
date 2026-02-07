// Like Types
export interface ILike {
  _id?: string;
  id: string;
  userId: string;
  targetId: string; // Can be blogId or commentId
  targetType: 'blog' | 'comment';
  createdAt: Date;
}

export interface ILikeCreate {
  targetId: string;
  targetType: 'blog' | 'comment';
}

export interface ILikeResponse {
  id: string;
  userId: string;
  targetId: string;
  targetType: string;
  createdAt: Date;
}

export interface ILikeStatus {
  isLiked: boolean;
  likeCount: number;
}
