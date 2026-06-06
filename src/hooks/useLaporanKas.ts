import { useState, FormEvent } from 'react';
import { FinancialTransaction } from '../types';

export interface UseLaporanKasProps {
  transactions: FinancialTransaction[];
  selectedRT: string;
  selectedRW: string;
  onAddTransaction: (tx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => void;
}

export function useLaporanKas({ transactions, selectedRT, selectedRW, onAddTransaction }: UseLaporanKasProps) {
  // Search & Filter State (Grouped)
  const [filters, setFilters] = useState({
    search: '',
    type: 'semua' as 'semua' | 'masuk' | 'keluar',
    category: 'Semua',
  });
  const updateFilter = (updates: Partial<typeof filters>) => setFilters((p) => ({ ...p, ...updates }));

  // Add Transaction Form (Grouped)
  const [form, setForm] = useState({
    isOpen: false,
    desc: '',
    amount: '',
    type: 'masuk' as 'masuk' | 'keluar',
    category: 'Iuran Bulanan' as FinancialTransaction['category'],
    date: new Date().toISOString().substring(0, 10),
  });
  const updateForm = (updates: Partial<typeof form>) => setForm((p) => ({ ...p, ...updates }));

  const matchesScope = (item: { rt?: string; rw?: string }) =>
    item.rt === selectedRT && item.rw === selectedRW;

  // Math totals
  const totalIncome = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const categories: FinancialTransaction['category'][] = [
    'Iuran Bulanan',
    'Donasi',
    'Keamanan & Kebersihan',
    'Pembangunan',
    'Sosial',
    'Operasional RT',
    'Lainnya',
  ];

  // Filtering transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'semua' || t.type === filters.type;
      const matchesCategory = filters.category === 'Semua' || t.category === filters.category;
      const matchesRT = t.rt && t.rw ? matchesScope(t) : true;
      return matchesSearch && matchesType && matchesCategory && matchesRT;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddTransactionSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nominal = parseFloat(form.amount);
    if (!form.desc.trim() || isNaN(nominal) || nominal <= 0) {
      alert('Tolong berikan deskripsi dan jumlah nominal transaksi yang valid.');
      return;
    }

    onAddTransaction({
      description: form.desc,
      amount: nominal,
      type: form.type,
      date: form.date,
      category: form.category,
      rt: selectedRT,
      rw: selectedRW,
    });

    // Reset Form
    updateForm({
      desc: '',
      amount: '',
      type: 'masuk',
      category: 'Iuran Bulanan',
      isOpen: false,
    });
  };

  return {
    filters,
    updateFilter,
    form,
    updateForm,
    totalIncome,
    totalExpense,
    netBalance,
    categories,
    filteredTransactions,
    handleAddTransactionSubmit,
  };
}
