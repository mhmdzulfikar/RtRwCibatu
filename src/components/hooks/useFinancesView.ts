import { useState, useEffect } from 'react';
import { CitizenDues, DuesPaymentRequest } from '../../types';

export interface UseFinancesViewProps {
  isAdmin: boolean;
  paymentRequests: DuesPaymentRequest[];
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
}

export function useFinancesView({ isAdmin, paymentRequests, onSubmitPaymentRequest }: UseFinancesViewProps) {
  // Navigation inside Finances Tab
  const [activeSubTab, setActiveSubTab] = useState<'laporan' | 'status-iuran' | 'persetujuan'>('laporan');

  // RW & RT defaults for scoping
  const [selectedRW] = useState('02');
  const [selectedRT] = useState('005');

  // Bayar Iuran Modal & Success Tip States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenDues | null>(null);
  const [isSuccessTip, setIsSuccessTip] = useState(false);

  useEffect(() => {
    if (!isAdmin && activeSubTab === 'persetujuan') {
      setActiveSubTab('laporan');
    }
  }, [activeSubTab, isAdmin]);

  const handlePayDuesClick = (citizen: CitizenDues) => {
    setSelectedCitizen(citizen);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    onSubmitPaymentRequest(request);
    setShowPaymentModal(false);
    setSelectedCitizen(null);
    setIsSuccessTip(true);
    setTimeout(() => {
      setIsSuccessTip(false);
    }, 5000);
  };

  const pendingRequests = paymentRequests.filter((p) => p.status === 'pending');

  return {
    activeSubTab,
    setActiveSubTab,
    selectedRW,
    selectedRT,
    showPaymentModal,
    setShowPaymentModal,
    selectedCitizen,
    setSelectedCitizen,
    isSuccessTip,
    setIsSuccessTip,
    handlePayDuesClick,
    handlePaymentSubmit,
    pendingRequests,
  };
}
