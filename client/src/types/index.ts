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

export type Endpoint =
  | '/auth/signup'
  | '/auth/login'
  | '/auth/logout'
  | '/auth/check-auth'
  | '/posts/all'
  | '/posts/following';

export enum HttpMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
}

export type FeedType = 'all' | 'following';
