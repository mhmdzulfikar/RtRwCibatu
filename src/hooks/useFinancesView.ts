import { useState, useEffect } from 'react';
import { CitizenDues, DuesPaymentRequest } from '../types';

export interface UseFinancesViewProps {
  isAdmin: boolean;
  paymentRequests: DuesPaymentRequest[];
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
}

export function useFinancesView({ isAdmin, paymentRequests, onSubmitPaymentRequest }: UseFinancesViewProps) {
  // Navigation inside Finances Tab
  const [activeSubTab, setActiveSubTab] = useState<'laporan' | 'status-iuran' | 'persetujuan'>('laporan');

  // RW & RT defaults for scoping (Grouped)
  const [scope] = useState({
    rw: '02',
    rt: '005',
  });

  // Bayar Iuran Modal & Success Tip States (Grouped)
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    selectedCitizen: null as CitizenDues | null,
    showSuccessTip: false,
  });

  const updatePaymentModal = (updates: Partial<typeof paymentModal>) => {
    setPaymentModal((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (!isAdmin && activeSubTab === 'persetujuan') {
      setActiveSubTab('laporan');
    }
  }, [activeSubTab, isAdmin]);

  const handlePayDuesClick = (citizen: CitizenDues) => {
    updatePaymentModal({ selectedCitizen: citizen, isOpen: true });
  };

  const handlePaymentSubmit = (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    onSubmitPaymentRequest(request);
    updatePaymentModal({ isOpen: false, selectedCitizen: null, showSuccessTip: true });
    
    setTimeout(() => {
      updatePaymentModal({ showSuccessTip: false });
    }, 5000);
  };

  const pendingRequests = paymentRequests.filter((p) => p.status === 'pending');

  return {
    activeSubTab,
    setActiveSubTab,
    scope,
    paymentModal,
    updatePaymentModal,
    handlePayDuesClick,
    handlePaymentSubmit,
    pendingRequests,
  };
}
