import express from 'express';
import ENV_VARS from './utils/envVars.util';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import connectToMongoDB from './db/connectToMongoDB';

const app = express();

const { PORT, COOKIE_PARSER_SECRET, MONGO_URI } = ENV_VARS;

app.use(express.json());
app.use(cookieParser(COOKIE_PARSER_SECRET));

app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
  connectToMongoDB(MONGO_URI);
  console.log(`Server started at: http://localhost:${PORT}`);
});
