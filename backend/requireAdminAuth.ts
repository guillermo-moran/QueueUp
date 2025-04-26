import { verifyAdminSession } from './adminAuth';
import { Request, Response, NextFunction } from 'express';

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || typeof authHeader !== 'string') {
    res.status(401).json({ error: 'Missing authorization token' });
    return;
  }

  // ✅ Extract token from "Bearer {token}"
  const token = authHeader.replace('Bearer ', '').trim();

  if (!verifyAdminSession(token)) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  next();
};
