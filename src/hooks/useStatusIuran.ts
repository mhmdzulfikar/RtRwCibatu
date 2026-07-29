import { useState } from 'react';
import { CitizenDues } from '../types';

export interface UseStatusIuranProps {
  citizensDues: CitizenDues[];
  selectedRT: string;
  selectedRW: string;
}

export function useStatusIuran({ citizensDues, selectedRT, selectedRW }: UseStatusIuranProps) {
  const [duesSearch, setDuesSearch] = useState('');

  const matchesScope = (item: { rt?: string; rw?: string }) =>
    item.rt === selectedRT && item.rw === selectedRW;

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

  // Filtering Citizens Dues
  const filteredCitizensDues = citizensDues.filter((c) => {
    const matchesSearch =
      c.citizenName.toLowerCase().includes(duesSearch.toLowerCase()) ||
      c.houseNumber.toLowerCase().includes(duesSearch.toLowerCase());
    const matchesRT = c.rt && c.rw ? matchesScope(c) : true;
    return matchesSearch && matchesRT;
  });

  return {
    duesSearch,
    setDuesSearch,
    months,
    filteredCitizensDues,
  };
}
