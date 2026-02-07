import type { Request, Response, NextFunction } from 'express';
import * as EmailValidator from 'email-validator';
import { isUserExists } from '../utils/isUserExists';
import isError from '../utils/isError.util';
import type { AuthRequest } from '../types';
export const validateSignup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, password, fullName, email } = req.body;

    if (!userName || !password || !fullName || !email) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedPassword = password.trim();

    if (trimmedUserName.length < 3 || trimmedUserName.length > 16) {
      return res.status(400).json({
        error: 'Username must be at least 3 chars and less then 16',
      });
    }

    const fetchedByEmail = await isUserExists({
      data: trimmedEmail,
      key: 'email',
    });

    const fetchedByUserName = await isUserExists({
      data: trimmedUserName,
      key: 'userName',
    });

    if (fetchedByEmail || fetchedByUserName) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (trimmedPassword.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 chars',
      });
    }

    if (trimmedFullName.length < 3 || trimmedFullName.length > 128) {
      return res.status(400).json({
        error: 'Fullname must be at least 3 chars and less then 128',
      });
    }

    if (!EmailValidator.validate(trimmedEmail)) {
      return res.status(400).json({
        error: 'Email is not correct',
      });
    }

    const user = {
      userName: trimmedUserName,
      password: trimmedPassword,
      fullName: trimmedFullName,
      email: trimmedEmail,
    };

    req.user = user;

    next();
  } catch (error) {
    isError({
      error,
      functionName: validateSignup.name,
      handler: 'middleware',
    });
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
