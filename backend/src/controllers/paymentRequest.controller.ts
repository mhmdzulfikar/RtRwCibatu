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
    const reqPayment = await prisma.duesPaymentRequest.create({ data });
    res.status(201).json(reqPayment);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat request pembayaran' });
  }
};

export const updatePaymentRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body as any;
    const updated = await prisma.duesPaymentRequest.update({
      where: { id },
      data: { status: data.status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Gagal update request pembayaran' });
  }
};
