// Follow Types
export interface IFollow {
  _id?: string;
  id: string;
  followerId: string; // The user who is following
  followingId: string; // The user being followed
  createdAt: Date;
}

export interface IFollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface IFollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export interface IFollowUserSummary {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface IFollowListResponse {
  users: IFollowUserSummary[];
  total: number;
  page: number;
  totalPages: number;
}
