import dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
  PORT: number;
  COOKIE_PARSER_SECRET: string;
  MONGO_URI: string;
}

const ENV_VARS: EnvVars = {
  PORT: Number(process.env.PORT) || 5000,
  COOKIE_PARSER_SECRET: process.env.COOKIE_PARSER_SECRET || '',
  MONGO_URI: process.env.MONGO_URI || '',
};

export default ENV_VARS;
