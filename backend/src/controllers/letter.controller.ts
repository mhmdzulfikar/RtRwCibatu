import { Request, Response } from 'express';
import prisma from '../config/database';

export const getLetters = async (req: Request, res: Response) => {
  try {
    const letters = await prisma.letterRequest.findMany({ orderBy: { dateRequested: 'desc' } });
    res.json(letters);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil request surat' });
  }
};

export const createLetter = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const newLetter = await prisma.letterRequest.create({ data });
    res.status(201).json(newLetter);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat request surat' });
  }
};

export const updateLetter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body as any;
    const updated = await prisma.letterRequest.update({
      where: { id },
      data
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal update surat' });
  }
};
