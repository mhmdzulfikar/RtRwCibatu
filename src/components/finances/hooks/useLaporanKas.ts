import { useState, FormEvent } from 'react';
import { FinancialTransaction } from '../../../types';

export interface UseLaporanKasProps {
  transactions: FinancialTransaction[];
  selectedRT: string;
  selectedRW: string;
  onAddTransaction: (tx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => void;
}

export function useLaporanKas({ transactions, selectedRT, selectedRW, onAddTransaction }: UseLaporanKasProps) {
  // Search & Filter State
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [txCategoryFilter, setTxCategoryFilter] = useState<string>('Semua');

  // Add Transaction Form
  const [showAddTxForm, setShowAddTxForm] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'masuk' | 'keluar'>('masuk');
  const [txCategory, setTxCategory] = useState<FinancialTransaction['category']>('Iuran Bulanan');
  const [txDate, setTxDate] = useState(new Date().toISOString().substring(0, 10));

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
        t.description.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(txSearch.toLowerCase());
      const matchesType = txTypeFilter === 'semua' || t.type === txTypeFilter;
      const matchesCategory = txCategoryFilter === 'Semua' || t.category === txCategoryFilter;
      const matchesRT = t.rt && t.rw ? matchesScope(t) : true;
      return matchesSearch && matchesType && matchesCategory && matchesRT;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddTransactionSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nominal = parseFloat(txAmount);
    if (!txDesc.trim() || isNaN(nominal) || nominal <= 0) {
      alert('Tolong berikan deskripsi dan jumlah nominal transaksi yang valid.');
      return;
    }

    onAddTransaction({
      description: txDesc,
      amount: nominal,
      type: txType,
      date: txDate,
      category: txCategory,
      rt: selectedRT,
      rw: selectedRW,
    });

    // Reset Form
    setTxDesc('');
    setTxAmount('');
    setTxType('masuk');
    setTxCategory('Iuran Bulanan');
    setShowAddTxForm(false);
  };

  return {
    txSearch,
    setTxSearch,
    txTypeFilter,
    setTxTypeFilter,
    txCategoryFilter,
    setTxCategoryFilter,
    showAddTxForm,
    setShowAddTxForm,
    txDesc,
    setTxDesc,
    txAmount,
    setTxAmount,
    txType,
    setTxType,
    txCategory,
    setTxCategory,
    txDate,
    setTxDate,
    totalIncome,
    totalExpense,
    netBalance,
    categories,
    filteredTransactions,
    handleAddTransactionSubmit,
  };
}
