import jwt, { JwtPayload } from 'jsonwebtoken';
import ENVIRONMENT_VARIABLES from '../../config/env.config';
import STATUS_CODE from '../../helper/statusCode';

const jwtTokenSecret = ENVIRONMENT_VARIABLES.NODE_JWT_TOKEN.TOKEN_SECRET_KEY as string;

// Generate Access Token as a Promise
const generateToken = async (payload: any, expireTime: string = '60m'): Promise<string> => {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(payload, jwtTokenSecret, { expiresIn: expireTime }, (error, token) => {
        if (error) {
          reject(error);
        } else if (token) {
          resolve(token);
        }
      });
    });

    return token;
  } catch (error: any) {
    throw new Error(error?.message || 'Error generating token');
  }
};

// Verify Access Token as a Promise
const verifyToken = (
  token: string
): Promise<{ status: number; message: string; decoded?: JwtPayload | string }> => {
  return new Promise((resolve) => {
    try {
      jwt.verify(token, jwtTokenSecret, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return resolve({
              status: 401,
              message: 'Token has expired'
            });
          }
          return resolve({
            status: 400,
            message: 'Invalid token'
          });
        }
        resolve({
          status: STATUS_CODE.CODE_OK,
          message: 'Token is valid',
          decoded
        });
      });
    } catch (error: any) {
      resolve({
        status: 500,
        message: error?.message || 'Internal Server Error'
      });
    }
  });
};
export const AppTokens = {
  generateToken,
  verifyToken
};
