import STATUS_CODE from '../../helper/statusCode';
import { cookieStorage } from '../services/cookies-storage';
import { ServerError } from '../utils/response';
import { AppTokens } from '../utils/tokens';

export const isAuthentication = async (context: any) => {
  try {
    if (!context || !context.req) {
      console.error('Context is missing in middleware.');
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Context is undefined', null);
    }

    const { req } = context;
    const accessToken = cookieStorage.getSingleCookie(req, '_at');

    if (!accessToken) {
      return false;
    }

    const decodedToken = AppTokens.verifyToken(accessToken);
    if (!decodedToken) {
      return false;
    }

    req.user = decodedToken; // Attach user to context

    return true;
  } catch (error) {
    return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Internal Server Error', null);
  }
};
