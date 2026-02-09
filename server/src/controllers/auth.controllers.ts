import type { Request, Response } from 'express';
import type { AuthRequest } from '../types';
import User from '../models/user.model';
import { compare, genSalt, hash } from 'bcryptjs';
import generateTokenAndSetCookies from '../utils/generateTokenAndSetCookies';
import isError from '../utils/isError.util';
import { AuthError, responseWithAuthError } from '../errors/auth.errors';
import ENV_VARS from '../utils/envVars.util';

export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    isError({ error, functionName: checkAuth.name, handler: 'controller' });
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
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
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } else {
      return responseWithAuthError(res, 400, AuthError.INVALID_REQUEST);
    }
  } catch (error) {
    isError({ error, functionName: signup.name, handler: 'controller' });
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;

    if (user) {
      const currentUser = await User.findOne({ email: user.email });

      if (!currentUser) {
        return responseWithAuthError(res, 401, AuthError.INVALID_CREDENTIALS);
      }

      const isPasswordCorrect = await compare(
        user.password,
        currentUser.password || ''
      );

      if (!isPasswordCorrect) {
        return responseWithAuthError(res, 401, AuthError.INVALID_CREDENTIALS);
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
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
};
export const logout = (req: Request, res: Response) => {
  const { NODE_ENV } = ENV_VARS;
  try {
    res.clearCookie('secret_token', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    res.status(200).json({ message: 'Logout successfully' });
  } catch (error) {
    isError({ error, functionName: logout.name, handler: 'controller' });
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
};
