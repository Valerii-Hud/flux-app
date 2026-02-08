import jwt from 'jsonwebtoken';
import type mongoose from 'mongoose';
import ENV_VARS from './envVars.util';
import type { Response } from 'express';
import isError from './isError.util';
const generateTokenAndSetCookies = (
  res: Response,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const { JWT_SECRET, NODE_ENV } = ENV_VARS;

    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: '15d',
    });

    res.cookie('secret_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
    });
  } catch (error) {
    isError({
      error,
      functionName: generateTokenAndSetCookies.name,
      handler: 'util',
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export default generateTokenAndSetCookies;
