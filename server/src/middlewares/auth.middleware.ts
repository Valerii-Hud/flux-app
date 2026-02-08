import type { Request, Response, NextFunction } from 'express';
import * as EmailValidator from 'email-validator';
import { isUserExists } from '../utils/isUserExists';
import isError from '../utils/isError.util';
import type { AuthRequest } from '../types';
import { AuthError, responseWithAuthError } from '../errors/auth.errors';
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

    if (trimmedPassword.length < 8) {
      return responseWithAuthError(res, 400, AuthError.MIN_PASSWORD_LENGTH);
    }

    if (trimmedFullName.length < 3 || trimmedFullName.length > 128) {
      return responseWithAuthError(res, 400, AuthError.MIN_MAX_FULLNAME_LENGTH);
    }

    if (!EmailValidator.validate(trimmedEmail)) {
      return responseWithAuthError(res, 400, AuthError.INCORRECT_EMAIL);
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
      return responseWithAuthError(res, 400, AuthError.INVALID_CREDENTIALS);
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
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
};

export const validateLogin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return responseWithAuthError(res, 400, AuthError.ALL_FIELDS_ARE_REQUIRED);
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const fetchedByEmail = await isUserExists({
      data: trimmedEmail,
      key: 'email',
    });

    if (!fetchedByEmail) {
      return responseWithAuthError(res, 400, AuthError.INVALID_CREDENTIALS);
    }

    if (!EmailValidator.validate(trimmedEmail)) {
      return responseWithAuthError(res, 400, AuthError.INCORRECT_EMAIL);
    }

    const user = {
      password: trimmedPassword,
      email: trimmedEmail,
    };

    req.user = user;
    next();
  } catch (error) {
    isError({
      error,
      functionName: validateLogin.name,
      handler: 'middleware',
    });
    responseWithAuthError(res, 500, AuthError.INTERNAL_SERVER_ERROR);
  }
};
