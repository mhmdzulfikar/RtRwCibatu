import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLetters = async (req: Request, res: Response) => {
  try {
    const letters = await prisma.letterRequest.findMany({ orderBy: { dateRequested: 'desc' } });
    
    // API Data Leak Fix: Completely strip ALL PII for the public tracker list
    const safeLetters = letters.map(l => {
      return {
        id: l.id,
        applicantName: l.applicantName, // Frontend partially masks this
        purpose: l.purpose,
        status: l.status,
        dateRequested: l.dateRequested,
        referenceNo: l.referenceNo,
        rejectedReason: l.rejectedReason,
        // Intentionally omitting: nik, kk, birthPlace, birthDate, gender, phone, religion, profession, address
      };
    });
    
    res.json(safeLetters);
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

export const getLetterForPrint = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { nik } = req.body;
    
    const letter = await prisma.letterRequest.findUnique({ where: { id } });
    if (!letter) {
      return res.status(404).json({ error: 'Surat tidak ditemukan' });
    }
    
    const isAdmin = req.user?.role === 'admin';
    
    if (!isAdmin && letter.nik !== nik) {
       return res.status(403).json({ error: 'NIK tidak cocok. Anda tidak memiliki akses untuk mencetak surat ini.' });
    }
    
    res.json(letter);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data surat' });
  }
};
