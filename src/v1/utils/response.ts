export const ServerResponse = (status: number, message: string, data: any): object => {
  return {
    status: status,
    message: message,
    data: data
  };
};

export const ServerError = (status: number, message: string, error: any): object => {
  return {
    status,
    message,
    data: false,
    error: typeof error === 'object' ? JSON.stringify(error) : error
  };
};
