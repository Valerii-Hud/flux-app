import dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
  PORT: number;
  COOKIE_PARSER_SECRET: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

if (!process.env.COOKIE_PARSER_SECRET) {
  throw new Error('COOKIE_PARSER_SECRET is not defined');
}

if (process.env.JWT_SECRET.length < 64) {
  throw new Error('JWT_SECRET is too short');
}

if (process.env.COOKIE_PARSER_SECRET.length < 64) {
  throw new Error('COOKIE_PARSER_SECRET is too short');
}

const ENV_VARS: EnvVars = {
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_PARSER_SECRET: process.env.COOKIE_PARSER_SECRET,
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'production',
};

export default ENV_VARS;
