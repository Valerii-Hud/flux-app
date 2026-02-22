export type Id = string;

export interface User {
  email: string;
  password: string;
  _id?: Id;
  userName?: string;
  fullName?: string;
  profileImage?: string;
  coverImage?: string;
  isVerified?: boolean;
  bio?: string;
  link?: string;
  followers?: Id[] | User[];
  following?: Id[] | User[];
  likedPosts?: Id[];
}

export interface Comment {
  _id?: Id;
  text: string;
  user?: User;
}

export interface PostType {
  _id: Id;
  user: User;
  text?: string;
  image?: string;
  comments?: Comment[];
  likes: Id[];
}

type StaticEndpoint =
  | '/auth/signup'
  | '/auth/login'
  | '/auth/logout'
  | '/auth/check-auth'
  | '/posts/all'
  | '/posts/following';

type DynamicEndpoint = `/posts/${string}`;

export type Endpoint = StaticEndpoint | DynamicEndpoint;

export enum HttpMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
}

export type FeedType = 'all' | 'following';
