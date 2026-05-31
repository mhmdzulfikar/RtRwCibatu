import { useState, FormEvent } from 'react';
import { CitizenDues, DuesPaymentRequest } from '../types';

export interface UsePayDuesModalProps {
  selectedCitizen: CitizenDues;
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
}

export function usePayDuesModal({ selectedCitizen, onSubmitPaymentRequest }: UsePayDuesModalProps) {
  const [payMonth, setPayMonth] = useState('Mei');
  const [payAmount] = useState('100000');
  const [payMethod, setPayMethod] = useState('Transfer BCA (VA RT 005 - 8275005)');
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);

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

  const handleFileSimulate = () => {
    const rand = Math.floor(Math.random() * 90000) + 10000;
    setSimulatedFile(`bukti_transfer_rt${selectedCitizen.rt || '005'}_tx${rand}.jpg`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!simulatedFile) {
      alert('Harap unggah / simulasikan bukti transfer terlebih dahulu.');
      return;
    }

    onSubmitPaymentRequest({
      citizenName: selectedCitizen.citizenName,
      houseNumber: selectedCitizen.houseNumber,
      month: payMonth,
      year: 2026,
      amount: parseFloat(payAmount),
      paymentMethod: payMethod,
      transferProofUrl: simulatedFile,
      rt: selectedCitizen.rt,
      rw: selectedCitizen.rw,
    });
  };

  return {
    payMonth,
    setPayMonth,
    payAmount,
    payMethod,
    setPayMethod,
    simulatedFile,
    setSimulatedFile,
    months,
    handleFileSimulate,
    handleSubmit,
  };
}
