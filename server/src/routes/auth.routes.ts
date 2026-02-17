import express, { Router } from 'express';
import {
  checkAuth,
  login,
  logout,
  signup,
} from '../controllers/auth.controllers';
import {
  protectRoute,
  validateLogin,
  validateSignup,
} from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.get('/check-auth', protectRoute, checkAuth);

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', protectRoute, logout);

export default router;
