import { useState, useEffect } from 'react';
import {
  Announcement,
  FinancialTransaction,
  CitizenDues,
  LetterRequest,
  DuesPaymentRequest
} from '../types';

import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CITIZENS_DUES,
  INITIAL_LETTER_REQUESTS,
  INITIAL_PAYMENT_REQUESTS,
  hydrateAnnouncementPhotos
} from '../data';

// Helper helper to write states easily
const saveStateToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write key to local storage', error);
  }
};

export function useAppData(requireAdminAccess: () => boolean) {
  // Central Database States (Backed up by localStorage for persistent testing)
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [citizensDues, setCitizensDues] = useState<CitizenDues[]>([]);
  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<DuesPaymentRequest[]>([]);

  // Hydrate central states from localStorage on startup
  useEffect(() => {
    try {
      const storedAnn = localStorage.getItem('rt005_announcements');
      if (storedAnn) {
        const parsedAnnouncements = JSON.parse(storedAnn) as Announcement[];
        const announcementsWithPhotos = hydrateAnnouncementPhotos(parsedAnnouncements);
        setAnnouncements(announcementsWithPhotos);
        if (JSON.stringify(parsedAnnouncements) !== JSON.stringify(announcementsWithPhotos)) {
          localStorage.setItem('rt005_announcements', JSON.stringify(announcementsWithPhotos));
        }
      }
      else {
        const announcementsWithPhotos = hydrateAnnouncementPhotos(INITIAL_ANNOUNCEMENTS);
        setAnnouncements(announcementsWithPhotos);
        localStorage.setItem('rt005_announcements', JSON.stringify(announcementsWithPhotos));
      }

      const storedTx = localStorage.getItem('rt005_transactions');
      if (storedTx) setTransactions(JSON.parse(storedTx));
      else {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem('rt005_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      }

      const storedDues = localStorage.getItem('rt005_citizens_dues');
      if (storedDues) setCitizensDues(JSON.parse(storedDues));
      else {
        setCitizensDues(INITIAL_CITIZENS_DUES);
        localStorage.setItem('rt005_citizens_dues', JSON.stringify(INITIAL_CITIZENS_DUES));
      }

      const storedLetters = localStorage.getItem('rt005_letter_requests');
      if (storedLetters) setLetterRequests(JSON.parse(storedLetters));
      else {
        setLetterRequests(INITIAL_LETTER_REQUESTS);
        localStorage.setItem('rt005_letter_requests', JSON.stringify(INITIAL_LETTER_REQUESTS));
      }

      const storedPayments = localStorage.getItem('rt005_payment_requests');
      if (storedPayments) setPaymentRequests(JSON.parse(storedPayments));
      else {
        setPaymentRequests(INITIAL_PAYMENT_REQUESTS);
        localStorage.setItem('rt005_payment_requests', JSON.stringify(INITIAL_PAYMENT_REQUESTS));
      }
    } catch (e) {
      console.error('Failed to load local storage database. Falling back to memory.', e);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setCitizensDues(INITIAL_CITIZENS_DUES);
      setLetterRequests(INITIAL_LETTER_REQUESTS);
      setPaymentRequests(INITIAL_PAYMENT_REQUESTS);
    }
  }, []);

  // ----------------------------------------------------
  // ANNOUNCEMENTS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    if (!requireAdminAccess()) return;

    const fresh: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...announcements];
    setAnnouncements(updated);
    saveStateToStorage('rt005_announcements', updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!requireAdminAccess()) return;

    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveStateToStorage('rt005_announcements', updated);
  };

  // ----------------------------------------------------
  // TRANSACTIONS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddTransaction = (newTx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => {
    if (!requireAdminAccess()) return;

    const fresh: FinancialTransaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      recordedBy: 'Admin RT / Bendahara'
    };
    const updated = [fresh, ...transactions];
    setTransactions(updated);
    saveStateToStorage('rt005_transactions', updated);
  };

  // ----------------------------------------------------
  // DUES / PAYMENT SUBMISSION AND VERIFICATION DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitPaymentRequest = (newPayReq: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    const fresh: DuesPaymentRequest = {
      ...newPayReq,
      id: `pay-${Date.now()}`,
      status: 'pending',
      dateSubmitted: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...paymentRequests];
    setPaymentRequests(updated);
    saveStateToStorage('rt005_payment_requests', updated);

    // Also change that citizen's month history status from 'Belum' to 'Pending' so they see it in transition!
    const updatedDuesList = citizensDues.map(c => {
      // Match by name or house number and respect optional RT/RW when provided
      const nameMatch = c.citizenName.toLowerCase().trim() === newPayReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === newPayReq.houseNumber.toLowerCase().trim();
      const rtMatch = newPayReq.rt ? c.rt === newPayReq.rt : true;
      const rwMatch = newPayReq.rw ? c.rw === newPayReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[newPayReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [newPayReq.year]: {
              ...yearObj,
              [newPayReq.month]: 'Pending' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);
  };

  const handleApprovePaymentRequest = (id: string) => {
    if (!requireAdminAccess()) return;

    const targetReq = paymentRequests.find(p => p.id === id);
    if (!targetReq) return;

    // 1. Mark status as approved
    const updatedRequests = paymentRequests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    setPaymentRequests(updatedRequests);
    saveStateToStorage('rt005_payment_requests', updatedRequests);

    // 2. Turn month status inside citizensDues from 'Pending' to 'Lunas'
    const updatedDuesList = citizensDues.map(c => {
      const nameMatch = c.citizenName.toLowerCase().trim() === targetReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === targetReq.houseNumber.toLowerCase().trim();
      const rtMatch = targetReq.rt ? c.rt === targetReq.rt : true;
      const rwMatch = targetReq.rw ? c.rw === targetReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[targetReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [targetReq.year]: {
              ...yearObj,
              [targetReq.month]: 'Lunas' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);

    // 3. Automatically append an income financial transaction into transactions logbook!
    handleAddTransaction({
      description: `Iuran Bulanan ${targetReq.month} 2026 - ${targetReq.citizenName} (${targetReq.houseNumber})`,
      amount: targetReq.amount,
      type: 'masuk',
      date: new Date().toISOString().substring(0, 10),
      category: 'Iuran Bulanan'
    });
  };

  const handleRejectPaymentRequest = (id: string) => {
    if (!requireAdminAccess()) return;

    const targetReq = paymentRequests.find(p => p.id === id);
    if (!targetReq) return;

    // 1. Mark status as rejected
    const updatedRequests = paymentRequests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r);
    setPaymentRequests(updatedRequests);
    saveStateToStorage('rt005_payment_requests', updatedRequests);

    // 2. Set month status inside citizensDues back to 'Belum' from 'Pending'
    const updatedDuesList = citizensDues.map(c => {
      const nameMatch = c.citizenName.toLowerCase().trim() === targetReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === targetReq.houseNumber.toLowerCase().trim();
      const rtMatch = targetReq.rt ? c.rt === targetReq.rt : true;
      const rwMatch = targetReq.rw ? c.rw === targetReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[targetReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [targetReq.year]: {
              ...yearObj,
              [targetReq.month]: 'Belum' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);
  };

  // ----------------------------------------------------
  // LETTERS (SURAT DOMISILI) DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitLetterRequest = (newLetter: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => {
    const fresh: LetterRequest = {
      ...newLetter,
      id: `req-${Date.now().toString().substring(10)}`, // short layout
      status: 'submitted',
      dateRequested: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...letterRequests];
    setLetterRequests(updated);
    saveStateToStorage('rt005_letter_requests', updated);
  };

  const handleUpdateLetterStatus = (
    id: string,
    status: LetterRequest['status'],
    updateData?: { referenceNo?: string; rejectedReason?: string }
  ) => {
    if (!requireAdminAccess()) return;

    const updated = letterRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(updateData?.referenceNo ? { referenceNo: updateData.referenceNo } : {}),
          ...(updateData?.rejectedReason ? { rejectedReason: updateData.rejectedReason } : {})
        };
      }
      return r;
    });
    setLetterRequests(updated);
    saveStateToStorage('rt005_letter_requests', updated);
  };

  // ----------------------------------------------------
  // MATHEMATICS CALCULATIONS FOR TREASURY
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
