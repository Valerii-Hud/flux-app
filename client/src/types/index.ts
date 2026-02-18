export type Id = string;

export interface User {
  _id?: Id;
  userName: string;
  fullName: string;
  profileImage?: string;
  coverImage?: string;
  email?: string;
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
