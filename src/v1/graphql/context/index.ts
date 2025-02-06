import { Request, Response } from 'express';
import STATUS_CODE from '../../../helper/statusCode';
import { isAuthentication } from '../../middleware/isAuthentication';
import { ServerError } from '../../utils/response';

export type GraphQlContext = {
  req: Request;
  res: Response;
};

export default async ({ req, res }: GraphQlContext) => {
  try {
    await isAuthentication({ req, res });

    return { req, res };
  } catch (error) {
    return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Internal Server Error', null);
  }
};
