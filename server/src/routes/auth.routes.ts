import express, { Router } from 'express';
import {
  checkAuth,
  login,
  logout,
  signup,
} from '../controllers/auth.controllers';

const router: Router = express.Router();

router.get('/check-auth', checkAuth);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
