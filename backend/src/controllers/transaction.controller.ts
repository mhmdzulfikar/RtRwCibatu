import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.financialTransaction.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data keuangan' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const newTx = await prisma.financialTransaction.create({ data });
    res.status(201).json(newTx);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambah transaksi' });
  }
};
