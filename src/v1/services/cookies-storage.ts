import { Request, Response } from 'express';

/**
 * Get all cookies from the request.
 */
const getAllCookies = (req: Request): Record<string, string> => {
  return req.cookies || {};
};
/**
 * Get a single cookie by name.
 * If the value is a JSON object, parse it before returning.
 */
const getSingleCookie = (req: Request, name: string): any => {
  try {
    const value = req.cookies[name];

    if (!value) return undefined;

    // Try parsing as JSON, return raw value if parsing fails
    return typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
      ? JSON.parse(value)
      : value;
  } catch (error) {
    return undefined;
  }
};

/**
 * Create a new cookie.
 */
export const createCookie = (
  res: Response,
  name: string,
  value: string,
  expire: number = 24 * 60 * 60 * 1000, // Default 1 day
  options: Record<string, any> = {}
): void => {
  let setValue = value;
  if (typeof value === 'object') {
    setValue = JSON.stringify(value);
  }

  res.cookie(name, setValue, {
    maxAge: expire,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options
  });
};

/**
 * Remove a single cookie by name.
 */
const removeSingleCookie = (res: Response, name: string): void => {
  res.clearCookie(name);
};

/**
 * Remove all cookies by clearing each one.
 */
const removeAllCookies = (req: Request, res: Response): void => {
  Object.keys(req.cookies || {}).forEach((cookieName) => {
    res.clearCookie(cookieName);
  });
};

export const cookieStorage = {
  getAllCookies,
  getSingleCookie,
  createCookie,
  removeSingleCookie,
  removeAllCookies
};
