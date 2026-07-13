import { useState } from 'react';
import { CitizenDues, DuesPaymentRequest } from '../types';

export interface UsePayDuesModalProps {
  selectedCitizen: CitizenDues;
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>, file?: File) => void;
}

export function usePayDuesModal({ selectedCitizen, onSubmitPaymentRequest }: UsePayDuesModalProps) {
  const [payMonth, setPayMonth] = useState('Januari');
  const [payAmount, setPayAmount] = useState(100000);
  const [payMethod, setPayMethod] = useState('Transfer BCA (VA RT 005 - 8275005)');
  
  // Real File Upload State
  const [simulatedFile, setSimulatedFile] = useState<File | null>(null);

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  // Handle actual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSimulatedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedFile) return;

    onSubmitPaymentRequest({
      citizenName: selectedCitizen.citizenName,
      houseNumber: selectedCitizen.houseNumber,
      month: payMonth,
      year: 2026,
      amount: payAmount,
      paymentMethod: payMethod,
      transferProofUrl: '', // Will be assigned by backend
      rt: selectedCitizen.rt,
      rw: selectedCitizen.rw,
    }, simulatedFile);
  };

  return {
    payMonth,
    setPayMonth,
    payAmount,
    setPayAmount,
    payMethod,
    setPayMethod,
    simulatedFile,
    setSimulatedFile,
    months,
    handleFileChange,
    handleSubmit,
  };
}
