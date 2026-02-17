import express, { Router } from 'express';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controllers';
import { protectRoute } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.get('/profile/:userName', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/follow/:userId', protectRoute, followUnfollowUser);
router.put('/update', protectRoute, updateUserProfile);

export default router;
