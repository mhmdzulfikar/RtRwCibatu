import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  const jwtSecret = process.env.JWT_SECRET;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // 1. Backdoor / Recovery Login
    if (username === 'admin' && password === process.env.ADMIN_RECOVERY_KEY) {
      const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
      if (adminUser) {
        const token = jwt.sign(
          { id: adminUser.id, username: adminUser.username, role: adminUser.role },
          jwtSecret!,
          { expiresIn: '12h' }
        );
        return res.status(200).json({
          message: 'Recovery Login successful',
          token,
          user: { id: adminUser.id, username: adminUser.username, role: adminUser.role, displayName: adminUser.displayName }
        });
      }
    }

    // 2. Normal Login
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '12h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  const { displayName, password, newPassword, newUsername } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData: any = {};

    if (displayName) {
      updateData.displayName = displayName;
    }

    if (newUsername && newUsername !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username: newUsername } });
      if (existing) {
        return res.status(400).json({ error: 'Username sudah digunakan oleh akun lain' });
      }
      updateData.username = newUsername;
    }

    if (newPassword) {
      if (!password) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const jwtSecret = process.env.JWT_SECRET;
    let newToken;
    if (jwtSecret) {
      newToken = jwt.sign(
        { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role },
        jwtSecret,
        { expiresIn: '12h' }
      );
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      token: newToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        displayName: updatedUser.displayName,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetWargaPassword = async (req: Request, res: Response): Promise<any> => {
  const { targetUsername, newPassword } = req.body;
  const requesterRole = (req as any).user?.role;

  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only admin can reset warga password' });
  }

  if (!targetUsername || !newPassword) {
    return res.status(400).json({ error: 'Target username and new password are required' });
  }

  try {
    const wargaUser = await prisma.user.findUnique({
      where: { username: targetUsername },
    });

    if (!wargaUser || wargaUser.role !== 'warga') {
      return res.status(404).json({ error: 'Warga account not found or invalid target' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: wargaUser.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: `Password untuk akun ${targetUsername} berhasil direset!` });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const recoverAdminPassword = async (req: Request, res: Response): Promise<any> => {
  const { recoveryKey, newPassword } = req.body;
  const validKey = process.env.ADMIN_RECOVERY_KEY;

  if (!validKey) {
    return res.status(500).json({ error: 'Sistem tidak memiliki Recovery Key yang dikonfigurasi' });
  }

  if (recoveryKey !== validKey) {
    return res.status(401).json({ error: 'Recovery Key tidak valid' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
  }

  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (!adminUser) {
      return res.status(404).json({ error: 'Akun Admin tidak ditemukan di database' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: 'Password Admin berhasil dipulihkan! Silakan login kembali.' });
  } catch (error) {
    console.error('Recover admin password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createWargaAccount = async (req: Request, res: Response): Promise<any> => {
  const { displayName, username, password } = req.body;
  const requesterRole = (req as any).user?.role;

  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only admin can create warga accounts' });
  }

  if (!displayName || !username || !password) {
    return res.status(400).json({ error: 'Nama, Username, dan Password wajib diisi' });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return res.status(400).json({ error: 'Username sudah digunakan, silakan pilih yang lain' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        displayName,
        username,
        password: hashedPassword,
        role: 'warga',
      },
    });

    return res.status(201).json({
      message: `Akun warga ${username} berhasil dibuat!`,
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
      }
    });
  } catch (error) {
    console.error('Create warga account error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


