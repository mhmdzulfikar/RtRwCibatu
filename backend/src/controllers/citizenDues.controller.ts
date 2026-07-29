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

export const createCitizenDues = async (req: Request, res: Response): Promise<any> => {
  try {
    const { citizenName, houseNumber } = req.body;
    
    if (!citizenName || !houseNumber) {
      return res.status(400).json({ error: 'Nama dan Nomor Blok Rumah wajib diisi' });
    }

    const newId = `dues-${Date.now()}`;
    
    // Inisialisasi default payment history untuk tahun 2026
    const defaultHistory = {
      "2026": {
        "Januari": "Belum", "Februari": "Belum", "Maret": "Belum",
        "April": "Belum", "Mei": "Belum", "Juni": "Belum",
        "Juli": "Belum", "Agustus": "Belum", "September": "Belum",
        "Oktober": "Belum", "November": "Belum", "Desember": "Belum"
      }
    };

    const newDues = await prisma.citizenDues.create({
      data: {
        id: newId,
        citizenName,
        houseNumber,
        rt: "005",
        rw: "02",
        paymentHistory: JSON.stringify(defaultHistory)
      }
    });

    return res.status(201).json(newDues);
  } catch (error) {
    console.error('Gagal membuat data iuran:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
