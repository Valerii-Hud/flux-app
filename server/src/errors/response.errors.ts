import type { Response } from 'express';

export enum ErrorType {
  //! [Auth]:

  MIN_MAX_USER_LENGTH = 'Username must be at least 3 chars and less than 16',
  MIN_PASSWORD_LENGTH = 'Password must be at least 8 chars',
  MIN_MAX_FULLNAME_LENGTH = 'Fullname must be at least 3 chars and less than 128',
  INCORRECT_EMAIL = 'Email is not correct',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  ALL_FIELDS_ARE_REQUIRED = 'Please provide all fields',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  INVALID_REQUEST = 'Invalid Request',
  NO_TOKEN_PROVIDED = 'Unauthorized - No Token Provided',
  INVALID_TOKEN = 'Unauthorized - Invalid Token ',

  //! [User]:
  FOLLOW_UNFOLLOW_YOURSELF = 'You cannot follow/unfollow yourself',
  INVALID_USER_ID = 'User Id is not valid',
  CURRENT_PASSWORD_OR_NEW_PASSWORD_INCORRECT = 'Please provide both current password and new password',
  CURRENT_PASSWORD_INCORRECT = 'Current password is incorrect',
  USER_NOT_FOUND = 'User Not Found',

  //! [Post]:
  POST_TEXT_IMAGE = 'Post must have text or image',
  POST_NOT_FOUND = 'Post not found',
  POST_NOT_AUTHORIZED = 'You are not authorized to delete this post',
  COMMENT_TEXT_REQUIRED = 'Text field is required',
}

type StatusCode = 400 | 401 | 404 | 500;

export const responseWithError = (
  res: Response,
  statusCode: StatusCode = 500,
  error: ErrorType = ErrorType.INTERNAL_SERVER_ERROR
) => {
  return res.status(statusCode).json({ error: error });
};
