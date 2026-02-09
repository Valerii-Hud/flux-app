import type { Response } from 'express';

export enum AuthError {
  MIN_MAX_USER_LENGTH = 'Username must be at least 3 chars and less then 16',
  MIN_PASSWORD_LENGTH = 'Password must be at least 8 chars',
  MIN_MAX_FULLNAME_LENGTH = 'Fullname must be at least 3 chars and less then 128',
  INCORRECT_EMAIL = 'Email is not correct',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  ALL_FIELDS_ARE_REQUIRED = 'Please provide all fields',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  INVALID_REQUEST = 'Invalid Request',
  NO_TOKEN_PROVIDED = 'Unauthorized - No Token Provided',
  INVALID_TOKEN = 'Unauthorized - Invalid Token ',
  USER_NOT_FOUND = 'User Not Found',
}

export const responseWithAuthError = (
  res: Response,
  statusCode: number,
  error: AuthError
) => {
  return res.status(statusCode).json({ error: error });
};
