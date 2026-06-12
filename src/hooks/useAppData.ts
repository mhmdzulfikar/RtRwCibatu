import { useState, useEffect } from 'react';
import {
  Announcement,
  FinancialTransaction,
  CitizenDues,
  LetterRequest,
  DuesPaymentRequest
} from '../types';

import { hydrateAnnouncementPhotos } from '../data';
import { getAuthToken } from '../security';

const API_BASE = 'http://localhost:3001/api';

export function useAppData(requireAdminAccess: () => boolean) {
  // Central Database States (Sekarang akan diambil dari Backend!)
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [citizensDues, setCitizensDues] = useState<CitizenDues[]>([]);
  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<DuesPaymentRequest[]>([]);

  // Fetch semua data dari backend saat pertama kali aplikasi dimuat
  const fetchAllData = async () => {
    try {
      const [resAnn, resTx, resDues, resPayReq, resLetReq] = await Promise.all([
        fetch(`${API_BASE}/announcements`),
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/citizens-dues`),
        fetch(`${API_BASE}/payment-requests`),
        fetch(`${API_BASE}/letters`),
      ]);

      const dataAnn = await resAnn.json();
      setAnnouncements(hydrateAnnouncementPhotos(dataAnn)); // Tetap pasang foto dummy

      setTransactions(await resTx.json());
      setCitizensDues(await resDues.json());
      setPaymentRequests(await resPayReq.json());
      setLetterRequests(await resLetReq.json());
    } catch (error) {
      console.error('Gagal mengambil data dari backend. Pastikan server backend berjalan.', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ----------------------------------------------------
  // ANNOUNCEMENTS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddAnnouncement = async (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    if (!requireAdminAccess()) return;
    
    const fresh = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10)
    };

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(fresh)
      });
      if (res.ok) fetchAllData(); // Refresh data
    } catch (e) {
      console.error('Gagal menambah pengumuman', e);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!requireAdminAccess()) return;
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Gagal menghapus pengumuman', e);
    }
  };

  // ----------------------------------------------------
  // TRANSACTIONS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddTransaction = async (newTx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => {
    if (!requireAdminAccess()) return;
    const fresh = {
      ...newTx,
      id: `tx-${Date.now()}`,
      recordedBy: 'Admin RT / Bendahara'
    };

    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(fresh)
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Gagal menambah transaksi', e);
    }
  };

  // ----------------------------------------------------
  // DUES / PAYMENT DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitPaymentRequest = async (newPayReq: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    const fresh = {
      ...newPayReq,
      id: `pay-${Date.now()}`,
      status: 'pending',
      dateSubmitted: new Date().toISOString().substring(0, 10)
    };
    try {
      const res = await fetch(`${API_BASE}/payment-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fresh)
      });
      
      if (res.ok) {
        // Optimistic UI update (atau bisa fetchAllData() saja)
        fetchAllData(); 
      }
    } catch (e) {
      console.error('Gagal membuat request', e);
    }
  };

  const handleApprovePaymentRequest = async (id: string) => {
    if (!requireAdminAccess()) return;
    try {
      await fetch(`${API_BASE}/payment-requests/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectPaymentRequest = async (id: string) => {
    if (!requireAdminAccess()) return;
    try {
      await fetch(`${API_BASE}/payment-requests/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // LETTERS (SURAT DOMISILI) DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitLetterRequest = async (newLetter: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => {
    const fresh = {
      ...newLetter,
      id: `req-${Date.now().toString().substring(10)}`,
      status: 'submitted',
      dateRequested: new Date().toISOString().substring(0, 10)
    };
    try {
      await fetch(`${API_BASE}/letters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fresh)
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLetterStatus = async (
    id: string,
    status: LetterRequest['status'],
    updateData?: { referenceNo?: string; rejectedReason?: string }
  ) => {
    if (!requireAdminAccess()) return;
    try {
      await fetch(`${API_BASE}/letters/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status, ...updateData })
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // CALCULATIONS
  // ----------------------------------------------------
  const calculateTotalBalance = () => {
    const sumIn = transactions.filter(t => t.type === 'masuk').reduce((s, t) => s + t.amount, 0);
    const sumOut = transactions.filter(t => t.type === 'keluar').reduce((s, t) => s + t.amount, 0);
    return sumIn - sumOut;
  };

  const totalBalance = calculateTotalBalance();

  return {
    announcements,
    transactions,
    citizensDues,
    letterRequests,
    paymentRequests,
    totalBalance,
    handleAddAnnouncement,
    handleDeleteAnnouncement,
    handleAddTransaction,
    handleSubmitPaymentRequest,
    handleApprovePaymentRequest,
    handleRejectPaymentRequest,
    handleSubmitLetterRequest,
    handleUpdateLetterStatus,
  };
}
