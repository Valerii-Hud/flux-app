import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

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
  password?: string;
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

export const errorHandler = (error: unknown) => {
  return error instanceof AxiosError
    ? toast.error(error.response?.data.error)
    : toast.error('Something went wrong');
};
