import { Request, Response } from 'express';
import prisma from '../config/database';

export const getPaymentRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.duesPaymentRequest.findMany({ orderBy: { dateSubmitted: 'desc' } });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil request pembayaran' });
  }
};

export const createPaymentRequest = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    let transferProofUrl = data.transferProofUrl; // fallback
    
    // If a file was uploaded, use the file path
    if (req.file) {
      transferProofUrl = `/uploads/${req.file.filename}`;
    }

    const reqPayment = await prisma.duesPaymentRequest.create({ 
      data: {
        ...data,
        id: data.id || `pay-${Date.now()}`,
        year: parseInt(data.year),
        amount: parseFloat(data.amount),
        transferProofUrl: transferProofUrl || ''
      }
    });
    res.status(201).json(reqPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat request pembayaran' });
  }
};

export const updatePaymentRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body as any;
    
    const paymentRequest = await prisma.duesPaymentRequest.findUnique({ where: { id } });
    if (!paymentRequest) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    const updated = await prisma.duesPaymentRequest.update({
      where: { id },
      data: { status: data.status }
    });

    // BUG FIX: If approved, update CitizenDues to "Lunas"
    if (data.status === 'approved') {
      const citizenDues = await prisma.citizenDues.findFirst({
        where: {
          citizenName: paymentRequest.citizenName,
          houseNumber: paymentRequest.houseNumber
        }
      });

      if (citizenDues) {
        let paymentHistory = {};
        if (citizenDues.paymentHistory) {
          try {
            paymentHistory = JSON.parse(citizenDues.paymentHistory);
          } catch (e) {}
        }
        
        // Update history
        const yearStr = paymentRequest.year.toString();
        if (!paymentHistory[yearStr as keyof typeof paymentHistory]) {
          (paymentHistory as any)[yearStr] = {};
        }
        (paymentHistory as any)[yearStr][paymentRequest.month] = 'Lunas';

        await prisma.citizenDues.update({
          where: { id: citizenDues.id },
          data: {
            paymentHistory: JSON.stringify(paymentHistory)
          }
        });

        // Optionally, create a FinancialTransaction
        await prisma.financialTransaction.create({
          data: {
            id: `tx-${Date.now()}`,
            description: `Iuran Warga - ${paymentRequest.citizenName} (${paymentRequest.month} ${paymentRequest.year})`,
            amount: paymentRequest.amount,
            type: 'masuk',
            date: new Date().toISOString().substring(0, 10),
            category: 'Iuran Bulanan',
            recordedBy: 'Sistem (Disetujui Admin)',
            rt: paymentRequest.rt,
            rw: paymentRequest.rw
          }
        });
      }
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal update request pembayaran' });
  }
};
