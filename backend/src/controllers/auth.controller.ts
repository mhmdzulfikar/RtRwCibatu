import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = (req: Request, res: Response): any => {
  const { username, password } = req.body;

  const validAdminUsername = process.env.ADMIN_USERNAME || '';
  const validAdminPassword = process.env.ADMIN_PASSWORD || '';
  const validWargaUsername = process.env.WARGA_USERNAME || '';
  const validWargaPassword = process.env.WARGA_PASSWORD || '';
  
  const jwtSecret = process.env.JWT_SECRET;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let role = '';
  let displayName = '';

  if (username === validAdminUsername && password === validAdminPassword) {
    role = 'admin';
    displayName = 'Pengurus RT 005';
  } else if (username === validWargaUsername && password === validWargaPassword) {
    role = 'warga';
    displayName = 'Warga RT 005';
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured in environment variables');
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Generate JWT token (expires in 12 hours)
  const token = jwt.sign(
    { username, role },
    jwtSecret,
    { expiresIn: '12h' }
  );

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      username,
      role,
      displayName
    }
  });
};
