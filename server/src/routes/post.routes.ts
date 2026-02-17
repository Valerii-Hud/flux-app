import express, { Router } from 'express';
import { protectRoute } from '../middlewares/auth.middleware';
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from '../controllers/post.controllers';

const router: Router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/likes/:userId', protectRoute, getLikedPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/user/:userName', protectRoute, getUserPosts);

router.post('/create', protectRoute, createPost);
router.post('/like/:postId', protectRoute, likeUnlikePost);
router.post('/comment/:postId', protectRoute, commentPost);

router.delete('/:postId', protectRoute, deletePost);

export default router;
