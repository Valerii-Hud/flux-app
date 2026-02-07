import type { Request, Response } from 'express';
import type { AuthRequest } from '../types';
import User from '../models/user.model';
import { genSalt, hash } from 'bcryptjs';
import generateTokenAndSetCookies from '../utils/generateTokenAndSetCookies';

export const checkAuth = (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (error) {}
};

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (user) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(user.password, salt);
      const newUser = await User.create({
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        password: hashedPassword,
      });
      generateTokenAndSetCookies(res, newUser._id);
      return res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    }
  } catch (error) {}
};

export const login = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const logout = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
