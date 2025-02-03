import { Request, Response } from 'express';
import STATUS_CODE from '../../../helper/statusCode';
import { ServerError } from '../../utils/response';

export const context = async ({ req, res }: { req: Request; res: Response }) => {
  try {
    return { req, res };
  } catch (error) {
    return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Internal Server Error', null);
  }
};
