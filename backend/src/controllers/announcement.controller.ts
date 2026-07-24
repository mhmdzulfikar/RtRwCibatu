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
    let imageUrl = data.imageUrl; // fallback

    // Jika ada file gambar fisik yang diunggah
    if (req.file) {
      imageUrl = `/uploads/kegiatan/${req.file.filename}`;
    }

    // Parsing isPinned karena FormData mengirim semuanya sebagai string
    const isPinned = data.isPinned === 'true' || data.isPinned === true;

    const newAnnouncement = await prisma.announcement.create({
      data: {
        id: data.id,
        title: data.title,
        content: data.content,
        date: data.date,
        category: data.category,
        author: data.author,
        isPinned: isPinned,
        imageUrl: imageUrl,
        imageAlt: data.imageAlt
      }
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan pengumuman' });
  }
};

import fs from 'fs';
import path from 'path';

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body as any;
    
    // Cari pengumuman lama
    const oldAnnouncement = await prisma.announcement.findUnique({ where: { id } });
    if (!oldAnnouncement) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    }

    let imageUrl = oldAnnouncement.imageUrl; // By default, keep the old one

    // Jika ada file gambar fisik baru yang diunggah
    if (req.file) {
      imageUrl = `/uploads/kegiatan/${req.file.filename}`;
      
      // Hapus foto lama jika ada dan formatnya lokal (dimulai dengan /uploads/)
      if (oldAnnouncement.imageUrl && oldAnnouncement.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../', oldAnnouncement.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // Parsing isPinned karena FormData mengirim semuanya sebagai string
    const isPinned = data.isPinned === 'true' || data.isPinned === true;

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        author: data.author,
        isPinned: isPinned,
        imageUrl: imageUrl,
        imageAlt: data.imageAlt || oldAnnouncement.imageAlt
      }
    });
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pengumuman' });
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
