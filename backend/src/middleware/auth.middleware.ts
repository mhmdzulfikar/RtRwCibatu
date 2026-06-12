import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend express Request interface to include user
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is missing');
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach user info to the request
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
