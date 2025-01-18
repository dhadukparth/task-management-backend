import { Request, Response } from 'express';

/**
 * Sets a cookie on the response object.
 * @param res - Express Response object.
 * @param name - Name of the cookie.
 * @param value - Value to store in the cookie.
 * @param options - Cookie options (e.g., httpOnly, secure, maxAge).
 * @returns A promise that resolves when the cookie is set.
 */
export async function setCookie(
  res: Response,
  name: string,
  value: string,
  options: Record<string, any> = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof value === 'object') {
        const convertString = JSON.stringify(value);
        res.cookie(name, convertString, options);
      } else {
        res.cookie(name, value, options);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a cookie value from the request object.
 * @param req - Express Request object.
 * @param name - Name of the cookie to retrieve.
 * @returns A promise that resolves with the cookie value or null if not found.
 */
export async function getCookie(req: Request, name: string): Promise<string | null> {
  return new Promise((resolve) => {
    const cookieValue = req.cookies[name] || null;
    try {
      const parsedValue = JSON.parse(cookieValue);
      resolve(parsedValue);
    } catch {
      resolve(cookieValue);
    }
  });
}

/**
 * Clears a cookie on the response object.
 * @param res - Express Response object.
 * @param name - Name of the cookie to clear.
 * @param options - Options for clearing the cookie (e.g., path).
 * @returns A promise that resolves when the cookie is cleared.
 */
export async function clearCookie(
  res: Response,
  name: string,
  options: Record<string, any> = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      res.clearCookie(name, options);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Checks if a cookie exists in the request object.
 * @param req - Express Request object.
 * @param name - Name of the cookie to check.
 * @returns A promise that resolves with true if the cookie exists, false otherwise.
 */
export async function hasCookie(req: Request, name: string): Promise<boolean> {
  return new Promise((resolve) => {
    const exists = !!req.cookies[name];
    resolve(exists);
  });
}

/**
 * Middleware to log all cookies in the request object.
 * @returns Express middleware function.
 */
export function logCookies() {
  return async (req: Request, _: Response, next: Function): Promise<void> => {
    console.log('Cookies:', req.cookies);
    next();
  };
}

export const AppCookies = {
  setCookie,
  getCookie,
  clearCookie,
  hasCookie,
  logCookies
};
