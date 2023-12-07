import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './db-data.js';

declare global {
    namespace Express {
      interface Request {
        user?: any; // Adjust the type according to your decoded token structure
      }
    }
  }

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token validation failed' });
  }

  return;
}