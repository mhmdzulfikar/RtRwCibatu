import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengumuman' });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const newAnnouncement = await prisma.announcement.create({
      data: {
        id: data.id,
        title: data.title,
        content: data.content,
        date: data.date,
        category: data.category,
        author: data.author,
        isPinned: data.isPinned || false,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt
      }
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan pengumuman' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pengumuman' });
  }
};
