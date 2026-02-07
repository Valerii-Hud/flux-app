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
    const { JWT_SECRET } = ENV_VARS;
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: '15d',
    });

    res.cookie('secret_token', token);
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
