import type { Request, Response, NextFunction } from 'express';
import * as EmailValidator from 'email-validator';
import { isUserExists } from '../utils/isUserExists';
import isError from '../utils/isError.util';
import type { AuthRequest } from '../types';
import { ErrorType, responseWithError } from '../errors/response.errors';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import ENV_VARS from '../utils/envVars.util';
import User from '../models/user.model';

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
        error: 'userName must be at least 3 chars and less then 16',
      });
    }

    if (trimmedPassword.length < 8) {
      return responseWithError(res, 400, ErrorType.MIN_PASSWORD_LENGTH);
    }

    if (trimmedFullName.length < 3 || trimmedFullName.length > 128) {
      return responseWithError(res, 400, ErrorType.MIN_MAX_FULLNAME_LENGTH);
    }

    if (!EmailValidator.validate(trimmedEmail)) {
      return responseWithError(res, 400, ErrorType.INCORRECT_EMAIL);
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
      return responseWithError(res, 400, ErrorType.INVALID_CREDENTIALS);
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
    responseWithError(res);
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
      return responseWithError(res, 400, ErrorType.ALL_FIELDS_ARE_REQUIRED);
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const fetchedByEmail = await isUserExists({
      data: trimmedEmail,
      key: 'email',
    });

    if (!fetchedByEmail) {
      return responseWithError(res, 400, ErrorType.INVALID_CREDENTIALS);
    }

    if (!EmailValidator.validate(trimmedEmail)) {
      return responseWithError(res, 400, ErrorType.INCORRECT_EMAIL);
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
    responseWithError(res);
  }
};

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.secret_token;

    const { JWT_SECRET } = ENV_VARS;
    if (!token) {
      return responseWithError(res, 401, ErrorType.NO_TOKEN_PROVIDED);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded) {
      return responseWithError(res, 401, ErrorType.INVALID_TOKEN);
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);
    }

    req.user = user;
    next();
  } catch (error) {
    isError({
      error,
      functionName: protectRoute.name,
      handler: 'middleware',
    });
    responseWithError(res);
  }
};
