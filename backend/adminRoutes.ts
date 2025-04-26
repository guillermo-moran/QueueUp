import { Request, Response } from 'express';
import { isAdminSetup, saveAdmin, validateAdmin, createAdminSession } from './adminAuth';

// Create Admin
export const handleAdminSetup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  if (await isAdminSetup()) {
    return res.status(400).json({ error: 'Admin already exists' });
  }

  await saveAdmin(username, password);

  // After setup, immediately create session token
  const token = createAdminSession();
  res.json({ token });
};

// Login Admin
export const handleAdminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const valid = await validateAdmin(username, password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createAdminSession();
  res.json({ token });
};
