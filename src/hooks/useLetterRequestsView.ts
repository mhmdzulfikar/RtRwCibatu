import { useState } from 'react';
import { LetterRequest } from '../types';
import { maskSensitiveNumber } from '../security';

export interface UseLetterRequestsViewProps {
  isAdmin: boolean;
  isWarga?: boolean;
  onUpdateStatus: (id: string, status: LetterRequest['status'], updateData?: { referenceNo?: string; rejectedReason?: string }) => void;
  onFetchLetterForPrint?: (id: string, nik?: string) => Promise<LetterRequest | null>;
}

export function useLetterRequestsView({ isAdmin, isWarga, onUpdateStatus, onFetchLetterForPrint }: UseLetterRequestsViewProps) {
  const [viewState, setViewState] = useState({
    showApplyForm: false,
    selectedLetter: null as LetterRequest | null,
    rejectingId: null as string | null,
    rejectionReasonText: '',
  });

  const updateViewState = (updates: Partial<typeof viewState>) => setViewState((p) => ({ ...p, ...updates }));

  const { showApplyForm, selectedLetter, rejectingId, rejectionReasonText } = viewState;

  const triggerRejectSubmit = (id: string) => {
    if (!viewState.rejectionReasonText.trim()) {
      alert('Harap berikan alasan penolakan.');
      return;
    }
    onUpdateStatus(id, 'rejected', { rejectedReason: viewState.rejectionReasonText });
    updateViewState({ rejectingId: null, rejectionReasonText: '' });
  };

  const triggerApproveSign = (req: LetterRequest) => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonthRoman = romanMonths[new Date().getMonth()];
    const randNum = Math.floor(Math.random() * 80) + 10;
    const refNo = `${randNum}/SRT-DOM/${currentMonthRoman}/${new Date().getFullYear()}`;

    onUpdateStatus(req.id, 'ready', { referenceNo: refNo });
  };

  // NIK masking for EVERYONE (shows first 6 digits, masks the rest)
  const getSafeNik = (value: string) => {
    if (value.length < 6) return '*'.repeat(value.length);
    return value.slice(0, 6) + '*'.repeat(value.length - 6);
  };

  // Name masking for public visitors (Admin and Warga see full name)
  const getSafeName = (name: string) => {
    if (isAdmin || isWarga) return name;
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      const word = parts[0];
      if (word.length <= 2) return word;
      return `${word[0]}${'*'.repeat(word.length - 2)}${word[word.length - 1]}`;
    }
    
    const lastWord = parts[parts.length - 1];
    if (lastWord.length <= 2) {
      parts[parts.length - 1] = '*'.repeat(lastWord.length);
    } else {
      parts[parts.length - 1] = `${lastWord[0]}${'*'.repeat(lastWord.length - 2)}${lastWord[lastWord.length - 1]}`;
    }
    
    return parts.join(' ');
  };

  const handlePrintClick = async (req: LetterRequest) => {
    if (!onFetchLetterForPrint) {
      updateViewState({ selectedLetter: req });
      return;
    }

    if (isAdmin) {
      const fullLetter = await onFetchLetterForPrint(req.id);
      if (fullLetter) {
        updateViewState({ selectedLetter: fullLetter });
      } else {
        alert('Gagal mengambil data surat.');
      }
    } else {
      // Extra layer of security for Warga
      const inputNik = window.prompt('🔒 Kemanan Privasi\nMasukkan NIK asli pemohon untuk mencetak/melihat surat ini:');
      if (inputNik !== null && inputNik.trim() !== '') {
        const fullLetter = await onFetchLetterForPrint(req.id, inputNik);
        if (fullLetter) {
          updateViewState({ selectedLetter: fullLetter });
        } else {
          alert('❌ Akses ditolak! NIK yang Anda masukkan tidak cocok dengan data pemohon surat ini.');
        }
      }
    }
  };

  return {
    viewState,
    updateViewState,
    triggerRejectSubmit,
    triggerApproveSign,
    getSafeNik,
    getSafeName,
    handlePrintClick,
  };
}
