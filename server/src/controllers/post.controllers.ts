import { ErrorType, responseWithError } from '../errors/response.errors';
import Post from '../models/post .model';
import User from '../models/user.model';
import type { AuthRequest } from '../types';
import type { Response } from 'express';
import isError from '../utils/isError.util';
import { v2 as cloudinary } from 'cloudinary';
import Notification from '../models/notification.model';

export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    isError({
      error,
      functionName: getAllPosts.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const getLikedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);
    }
    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });
    res.status(200).json(likedPosts);
  } catch (error) {
    isError({
      error,
      functionName: getLikedPosts.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const getFollowingPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createAt: -1,
      })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    isError({
      error,
      functionName: getFollowingPosts.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });

    if (!user) return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });
    res.status(200).json(posts);
  } catch (error) {
    isError({
      error,
      functionName: getUserPosts.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  let { image } = req.body;

  const userId = req.user?._id?.toString();

  try {
    const user = await User.findById(userId);

    if (!user) return responseWithError(res, 404, ErrorType.USER_NOT_FOUND);

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    if (!text && !image) {
      return responseWithError(res, 404, ErrorType.POST_TEXT_IMAGE);
    }

    const newPost = new Post({
      image,
      text,
      user: userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    isError({
      error,
      functionName: createPost.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const likeUnlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return responseWithError(res, 404, ErrorType.POST_NOT_FOUND);
    }
    if (userId) {
      const userLikedPost = post.likes.includes(userId);

      if (userLikedPost) {
        await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
        await User.updateOne(
          { _id: userId },
          { $pull: { likedPosts: postId } }
        );
        res.status(200).json({ message: 'Post unliked successfully' });
      } else {
        await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
        await User.updateOne(
          { _id: userId },
          { $push: { likedPosts: postId } }
        );
        await post.save();

        const notification = new Notification({
          from: userId,
          to: post.user,
          type: 'like',
        });
        await notification.save();

        res.status(200).json({ message: 'Post liked successfully' });
      }
    }
  } catch (error) {
    isError({
      error,
      functionName: likeUnlikePost.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const commentPost = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!text) {
      return responseWithError(res, 400, ErrorType.COMMENT_TEXT_REQUIRED);
    }
    const post = await Post.findById(postId);

    if (!post) {
      return responseWithError(res, 400, ErrorType.POST_NOT_FOUND);
    }

    const comment = {
      text,
      user: userId,
    };

    const notification = new Notification({
      from: userId,
      to: post.user,
      type: 'comment',
    });

    post.comments.push(comment);
    await post.save();
    await notification.save();
    res.status(200).json(post);
  } catch (error) {
    isError({
      error,
      functionName: commentPost.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return responseWithError(res, 404, ErrorType.POST_NOT_FOUND);
    }

    if (post.user.toString() !== req.user?._id?.toString()) {
      return responseWithError(res, 401, ErrorType.POST_NOT_AUTHORIZED);
    }

    if (post.image) {
      const imageId = post.image.split('/').pop()?.split('.')[0];
      if (imageId && typeof imageId === 'string') {
        await cloudinary.uploader.destroy(imageId);
      }
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    isError({
      error,
      functionName: deletePost.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};
