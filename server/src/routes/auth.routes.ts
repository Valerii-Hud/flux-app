import express, { Router } from 'express';
import {
  checkAuth,
  login,
  logout,
  signup,
} from '../controllers/auth.controllers';
import { validateLogin, validateSignup } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.get('/check-auth', checkAuth);

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;
