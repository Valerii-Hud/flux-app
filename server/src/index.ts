import express from 'express';
import ENV_VARS from './utils/envVars.util';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import notificationRoutes from './routes/notification.routes';

import connectToMongoDB from './db/connectToMongoDB';

const app = express();

const { PORT, COOKIE_PARSER_SECRET, MONGO_URI } = ENV_VARS;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(COOKIE_PARSER_SECRET));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notification', notificationRoutes);

app.listen(PORT, () => {
  connectToMongoDB(MONGO_URI);
  console.log(`Server started at: http://localhost:${PORT}`);
});
