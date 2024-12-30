import dotenv from 'dotenv';
dotenv.config();

const ENVIRONMENT_VARIABLES = {
  NODE_PORT: process.env.PORT,
  NODE_DB_CONNECTION_URI: process.env.DB_CONNECTION_URL,
  NODE_BACKEND_URL: process.env.BACKEND_URL,
  NODE_JWT_TOKEN: {
    TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRES_IN,
    TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET
  },
};

export default ENVIRONMENT_VARIABLES;
