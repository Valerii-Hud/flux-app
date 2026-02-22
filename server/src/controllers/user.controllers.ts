import type { Response } from 'express';
import type { AuthRequest } from '../types';
import { ErrorType, responseWithError } from '../errors/response.errors';
import isError from '../utils/isError.util';
import User from '../models/user.model';
import { v2 as cloudinary } from 'cloudinary';

import Notification from '../models/notification.model';
import { compare, genSalt, hash } from 'bcryptjs';
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select('-password');

    if (!user) {
      return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);
    }

    res.status(200).json(user);
  } catch (error) {
    isError({
      error,
      functionName: getUserProfile.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};
export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const usersFollowedByMe = await User.findById(userId).select('following');

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe?.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    isError({
      error,
      functionName: getSuggestedUsers.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const followUnfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (typeof userId !== 'string') {
      return responseWithError(res, 400, ErrorType.INVALID_USER_ID);
    }

    const currentUser = await User.findById(req.user?._id);
    const userToModify = await User.findById(userId);

    if (userId === req.user?._id?.toString()) {
      return responseWithError(res, 400, ErrorType.FOLLOW_UNFOLLOW_YOURSELF);
    }

    if (!userToModify || !currentUser) {
      return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);
    }

    const isFollowing =
      currentUser.following?.map((id) => id.toString()).includes(userId) ??
      false;

    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user?._id },
      });
      await User.findByIdAndUpdate(req.user?._id, {
        $pull: { following: userId },
      });
      res.status(200).json({
        message: `User ${userToModify.userName} unfollowed successfully`,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user?._id },
      });
      await User.findByIdAndUpdate(req.user?._id, {
        $push: { following: userId },
      });

      const newNotification = new Notification({
        type: 'follow',
        from: req.user?._id,
        to: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({
        message: `User ${userToModify.userName} followed successfully`,
      });
    }
  } catch (error) {
    isError({
      error,
      functionName: followUnfollowUser.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const { fullName, email, userName, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImage, coverImage } = req.body;
  const userId = req.user?._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return responseWithError(
        res,
        400,
        ErrorType.CURRENT_PASSWORD_OR_NEW_PASSWORD_INCORRECT
      );
    }

    if (currentPassword && newPassword) {
      const isMatch = await compare(currentPassword, user.password);
      if (!isMatch) {
        return responseWithError(
          res,
          400,
          ErrorType.CURRENT_PASSWORD_INCORRECT
        );
      }
      if (newPassword.length < 8) {
        return responseWithError(res, 400, ErrorType.MIN_PASSWORD_LENGTH);
      }

      const salt = await genSalt(10);
      user.password = await hash(newPassword, salt);

      async function updateImage(
        image: string,
        imageType: 'profileImage' | 'coverImage'
      ) {
        if (image) {
          if (user && user[imageType]) {
            const fileName = user[imageType].split('/').pop();

            if (fileName) {
              const publicId = fileName.split('.')[0];
              if (publicId) await cloudinary.uploader.destroy(publicId);
            }
          }
          const uploadedResponse = await cloudinary.uploader.upload(image);
          switch (imageType) {
            case 'profileImage':
              profileImage = uploadedResponse.secure_url;
              break;
            case 'coverImage':
              coverImage = uploadedResponse.secure_url;
              break;
          }
        }
      }

      if (profileImage) {
        await updateImage(profileImage, 'profileImage');
      }
      if (coverImage) {
        await updateImage(profileImage, 'coverImage');
      }
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();

    user.password = '';

    return res.status(200).json(user);
  } catch (error) {
    isError({
      error,
      functionName: updateUserProfile.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};
