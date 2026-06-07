import { useState } from 'react';
import { LetterRequest } from '../types';
import { maskSensitiveNumber } from '../security';

export interface UseLetterRequestsViewProps {
  isAdmin: boolean;
  onUpdateStatus: (id: string, status: LetterRequest['status'], updateData?: { referenceNo?: string; rejectedReason?: string }) => void;
}

export function useLetterRequestsView({ isAdmin, onUpdateStatus }: UseLetterRequestsViewProps) {
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

  const getSafeNik = (value: string) => (isAdmin ? value : maskSensitiveNumber(value));

  return {
    viewState,
    updateViewState,
    triggerRejectSubmit,
    triggerApproveSign,
    getSafeNik,
  };
}
