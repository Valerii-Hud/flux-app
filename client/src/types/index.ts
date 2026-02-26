export type Id = string;

interface MongooseTypes {
  _id?: Id;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends MongooseTypes {
  email?: string;
  password?: string;
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

export interface Comment extends MongooseTypes {
  text: string;
  user?: User;
}

export interface PostType extends MongooseTypes {
  user?: User;
  text?: string;
  image?: string;
  comments?: Comment[];
  likes?: Id[];
}

export interface Notification extends MongooseTypes {
  from: User;
  to: User;
  type: NotificationType;
  read: boolean;
}

export enum NotificationType {
  follow = 'follow',
  like = 'like',
  comment = 'comment',
}

type StaticEndpoint =
  // [Auth]
  | '/auth/signup'
  | '/auth/login'
  | '/auth/logout'
  | '/auth/check-auth'
  // [Posts]
  | '/posts/all'
  | '/posts/create'
  | '/posts/following'

  // [Users]
  | '/users/suggested'
  // [Notifications]
  | '/notifications/all';

type DynamicEndpoint = `/posts/${string}` | `/users/follow/${string}`;

export type Endpoint = StaticEndpoint | DynamicEndpoint;

export enum HttpMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
}

export type FeedType = 'all' | 'following';
