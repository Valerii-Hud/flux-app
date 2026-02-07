import dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
  PORT: number;
  COOKIE_PARSER_SECRET: string;
  MONGO_URI: string;
  JWT_SECRET: string;
}

const ENV_VARS: EnvVars = {
  PORT: Number(process.env.PORT) || 5000,
  COOKIE_PARSER_SECRET: process.env.COOKIE_PARSER_SECRET || '',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
};

export default ENV_VARS;
