import express from 'express';
import ENV_VARS from './utils/envVars.util';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import notificationRoutes from './routes/notification.routes';

import connectToMongoDB from './db/connectToMongoDB';

const app = express();

const {
  PORT,
  COOKIE_PARSER_SECRET,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = ENV_VARS;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(COOKIE_PARSER_SECRET));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.listen(PORT, () => {
  connectToMongoDB(MONGO_URI, true);
  console.log(`Server started at: http://localhost:${PORT}`);
});
