import { Request, Response } from 'express';
import prisma from '../config/database';

export const getCitizensDues = async (req: Request, res: Response) => {
  try {
    const dues = await prisma.citizenDues.findMany();
    res.json(dues);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data iuran' });
  }
};

export const updateCitizenDues = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body as any;
    const updated = await prisma.citizenDues.update({
      where: { id },
      data: { paymentHistory: data.paymentHistory }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengupdate iuran' });
  }
};
