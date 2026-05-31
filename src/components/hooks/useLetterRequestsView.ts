import { useState } from 'react';
import { LetterRequest } from '../../types';
import { maskSensitiveNumber } from '../../security';

export interface UseLetterRequestsViewProps {
  isAdmin: boolean;
  onUpdateStatus: (id: string, status: LetterRequest['status'], updateData?: { referenceNo?: string; rejectedReason?: string }) => void;
}

export function useLetterRequestsView({ isAdmin, onUpdateStatus }: UseLetterRequestsViewProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterRequest | null>(null);

  // Admin reject modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const triggerRejectSubmit = (id: string) => {
    if (!rejectionReasonText.trim()) {
      alert('Harap berikan alasan penolakan.');
      return;
    }
    onUpdateStatus(id, 'rejected', { rejectedReason: rejectionReasonText });
    setRejectingId(null);
    setRejectionReasonText('');
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
    showApplyForm,
    setShowApplyForm,
    selectedLetter,
    setSelectedLetter,
    rejectingId,
    setRejectingId,
    rejectionReasonText,
    setRejectionReasonText,
    triggerRejectSubmit,
    triggerApproveSign,
    getSafeNik,
  };
}
