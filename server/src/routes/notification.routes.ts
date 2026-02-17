import type { Router } from 'express';
import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware';
import {
  deleteAllNotifications,
  getAllNotifications,
} from '../controllers/notification.controller';

const router: Router = express.Router();

router.get('/all', protectRoute, getAllNotifications);
router.delete('/all', protectRoute, deleteAllNotifications);

export default router;
