export type ServerResponseType = {
  status: number;
  message: string;
  data: any;
  error: any;
};

export const ServerResponse = (status: number, message: string, data: any): ServerResponseType => {
  return {
    status: status,
    message: message,
    data: data,
    error: null
  };
};

export type ServerErrorType = {
  status: number;
  message: string;
  data: false;
  error: any;
};

export const ServerError = (
  status: number,
  message: string,
  error: any,
  data: any = null
): ServerErrorType => {
  return {
    status,
    message,
    data,
    error: typeof error === 'object' ? JSON.stringify(error) : error
  };
};
