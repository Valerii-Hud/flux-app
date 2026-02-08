import type { Request, Response } from 'express';
import type { AuthRequest } from '../types';
import User from '../models/user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import generateTokenAndSetCookies from '../utils/generateTokenAndSetCookies';
import isError from '../utils/isError.util';

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
    } else {
      return res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    isError({ error, functionName: signup.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (user) {
      const currentUser = await User.findOne({ email: user.email });

      if (!currentUser) {
        return res.status(500).json({ error: 'Something went wrong' });
      }

      const isPasswordCorrect = await compare(
        user.password,
        currentUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      generateTokenAndSetCookies(res, currentUser._id);

      return res.status(200).json({
        _id: currentUser?._id,
        fullName: currentUser?.fullName,
        userName: currentUser?.userName,
        email: currentUser?.email,
        createdAt: currentUser?.createdAt,
        updatedAt: currentUser?.updatedAt,
        isVerified: currentUser?.isVerified,
      });
    }
  } catch (error) {
    isError({ error, functionName: login.name, handler: 'controller' });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const logout = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
