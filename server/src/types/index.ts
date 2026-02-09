import type mongoose from 'mongoose';

import type { Request } from 'express';

export interface User {
  _id?: mongoose.Types.ObjectId;
  fullName?: string;
  userName?: string;
  email: string;
  password: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
  isVerified?: boolean;
}

export interface AuthRequest extends Request {
  user?: User;
}
