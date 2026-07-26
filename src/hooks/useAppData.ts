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
      
      const duesRaw = await resDues.json();
      const parsedDues = duesRaw.map((d: any) => ({
        ...d,
        paymentHistory: typeof d.paymentHistory === 'string' ? JSON.parse(d.paymentHistory) : d.paymentHistory
      }));
      setCitizensDues(parsedDues);
      
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
  const handleAddAnnouncement = async (newAnn: Omit<Announcement, 'id' | 'date'>, file?: File) => {
    if (!requireAdminAccess()) return;
    
    const freshId = `ann-${Date.now()}`;
    const freshDate = new Date().toISOString().substring(0, 10);

    try {
      let options: RequestInit;

      if (file) {
        const formData = new FormData();
        formData.append('id', freshId);
        formData.append('title', newAnn.title);
        formData.append('content', newAnn.content);
        formData.append('date', freshDate);
        formData.append('category', newAnn.category);
        formData.append('author', newAnn.author);
        formData.append('isPinned', newAnn.isPinned.toString());
        if (newAnn.imageAlt) formData.append('imageAlt', newAnn.imageAlt);
        formData.append('image', file);

        options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
            // Don't set Content-Type for FormData, browser will set it with boundary
          },
          body: formData
        };
      } else {
        options = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            ...newAnn,
            id: freshId,
            date: freshDate
          })
        };
      }

      const res = await fetch(`${API_BASE}/announcements`, options);
      if (res.ok) fetchAllData(); // Refresh data
    } catch (e) {
      console.error('Gagal menambah pengumuman', e);
    }
  };
  const handleEditAnnouncement = async (id: string, updatedAnn: Partial<Announcement>, file?: File | null) => {
    if (!requireAdminAccess()) return;
    
    try {
      let options: RequestInit;

      if (file) {
        const formData = new FormData();
        if (updatedAnn.title) formData.append('title', updatedAnn.title);
        if (updatedAnn.content) formData.append('content', updatedAnn.content);
        if (updatedAnn.category) formData.append('category', updatedAnn.category);
        if (updatedAnn.author) formData.append('author', updatedAnn.author);
        if (updatedAnn.isPinned !== undefined) formData.append('isPinned', updatedAnn.isPinned.toString());
        if (updatedAnn.imageAlt) formData.append('imageAlt', updatedAnn.imageAlt);
        formData.append('image', file);

        options = {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: formData
        };
      } else {
        options = {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(updatedAnn)
        };
      }

      const res = await fetch(`${API_BASE}/announcements/${id}`, options);
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Gagal mengubah pengumuman', e);
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
  const handleSubmitPaymentRequest = async (newPayReq: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>, file?: File) => {
    try {
      const formData = new FormData();
      formData.append('citizenName', newPayReq.citizenName);
      formData.append('houseNumber', newPayReq.houseNumber);
      formData.append('month', newPayReq.month);
      formData.append('year', newPayReq.year.toString());
      formData.append('amount', newPayReq.amount.toString());
      formData.append('paymentMethod', newPayReq.paymentMethod);
      if (newPayReq.rt) formData.append('rt', newPayReq.rt);
      if (newPayReq.rw) formData.append('rw', newPayReq.rw);
      formData.append('status', 'pending');
      formData.append('dateSubmitted', new Date().toISOString().substring(0, 10));

      if (file) {
        formData.append('transferProof', file);
      }

      const res = await fetch(`${API_BASE}/payment-requests`, {
        method: 'POST',
        body: formData
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

  const handleAddCitizenDues = async (citizenName: string, houseNumber: string) => {
    if (!requireAdminAccess()) return;
    try {
      const res = await fetch(`${API_BASE}/citizens-dues`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ citizenName, houseNumber })
      });
      if (res.ok) fetchAllData();
    } catch (e) {
      console.error('Gagal menambah warga:', e);
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

  const handleFetchLetterForPrint = async (id: string, nik?: string) => {
    try {
      const res = await fetch(`${API_BASE}/letters/${id}/print`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ nik })
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
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
    handleEditAnnouncement,
    handleDeleteAnnouncement,
    handleAddTransaction,
    handleAddCitizenDues,
    handleSubmitPaymentRequest,
    handleApprovePaymentRequest,
    handleRejectPaymentRequest,
    handleSubmitLetterRequest,
    handleUpdateLetterStatus,
    handleFetchLetterForPrint,
  };
}
