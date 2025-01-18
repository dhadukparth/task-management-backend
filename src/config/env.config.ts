import dotenv from 'dotenv';
dotenv.config();

const ENVIRONMENT_VARIABLES = {
  NODE_PORT: process.env.NODE_PORT,
  NODE_DB_CONNECTION_URI: process.env.NODE_DB_CONNECTION_URL,
  NODE_BACKEND_URL: process.env.NODE_BACKEND_URL,
  NODE_JWT_TOKEN: {
    TOKEN_EXPIRE: process.env.NODE_ACCESS_TOKEN_EXPIRES_IN,
    TOKEN_SECRET_KEY: process.env.NODE_ACCESS_TOKEN_SECRET
  },
  NODE_CRYPTO_JS: {
    SECRET_KEY: process.env.NODE_CRYPTO_JS_SECRET
  }
};

export default ENVIRONMENT_VARIABLES;
