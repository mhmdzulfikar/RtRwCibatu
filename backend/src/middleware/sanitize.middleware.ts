import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/**
 * Sanitizes an object recursively by applying XSS filter to all strings.
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return xss(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitizedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitizedObj;
  }
  
  return obj;
};

/**
 * Middleware untuk membersihkan (sanitize) input pengguna dari potensi
 * serangan Cross-site scripting (XSS).
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeObject(req.query);
    for (const key in req.query) delete req.query[key];
    Object.assign(req.query, sanitizedQuery);
  }
  
  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitizeObject(req.params);
    for (const key in req.params) delete req.params[key];
    Object.assign(req.params, sanitizedParams);
  }
  
  next();
};
