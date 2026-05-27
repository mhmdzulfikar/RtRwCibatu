import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  User,
  Check,
  Upload,
  Sparkles,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { FinancialTransaction, CitizenDues, DuesPaymentRequest } from '../types';

interface FinancesViewProps {
  transactions: FinancialTransaction[];
  citizensDues: CitizenDues[];
  paymentRequests: DuesPaymentRequest[];
  isAdmin: boolean;
  onAddTransaction: (tx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => void;
  onApprovePaymentRequest: (id: string) => void;
  onRejectPaymentRequest: (id: string) => void;
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
}

export default function FinancesView({
  transactions,
  citizensDues,
  paymentRequests,
  isAdmin,
  onAddTransaction,
  onApprovePaymentRequest,
  onRejectPaymentRequest,
  onSubmitPaymentRequest,
}: FinancesViewProps) {
  // Navigation inside Finances Tab
  const [activeSubTab, setActiveSubTab] = useState<'laporan' | 'status-iuran' | 'persetujuan'>('laporan');

  // Transaction Search & Filter State
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [txCategoryFilter, setTxCategoryFilter] = useState<string>('Semua');

  // Citizen Dues Search State
  const [duesSearch, setDuesSearch] = useState('');

  // Add Transaction Form
  const [showAddTxForm, setShowAddTxForm] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'masuk' | 'keluar'>('masuk');
  const [txCategory, setTxCategory] = useState<FinancialTransaction['category']>('Iuran Bulanan');
  const [txDate, setTxDate] = useState(new Date().toISOString().substring(0, 10));

  // Bayar Iuran Form State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenDues | null>(null);
  const [payMonth, setPayMonth] = useState('Mei');
  const [payAmount, setPayAmount] = useState('100000');
  const [payMethod, setPayMethod] = useState('Transfer BCA (VA RT 005)');
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [isSuccessTip, setIsSuccessTip] = useState(false);

  useEffect(() => {
    if (!isAdmin && activeSubTab === 'persetujuan') {
      setActiveSubTab('laporan');
    }
    if (!isAdmin) {
      setShowAddTxForm(false);
    }
  }, [activeSubTab, isAdmin]);

  // Math totals
  const totalIncome = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Filter Categories
  const categories: FinancialTransaction['category'][] = [
    'Iuran Bulanan',
    'Donasi',
    'Keamanan & Kebersihan',
    'Pembangunan',
    'Sosial',
    'Operasional RT',
    'Lainnya',
  ];

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

  // Filtering transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(txSearch.toLowerCase()) || 
                          t.category.toLowerCase().includes(txSearch.toLowerCase());
    const matchesType = txTypeFilter === 'semua' || t.type === txTypeFilter;
    const matchesCategory = txCategoryFilter === 'Semua' || t.category === txCategoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtering Citizens Dues
  const filteredCitizensDues = citizensDues.filter((c) => {
    return (
      c.citizenName.toLowerCase().includes(duesSearch.toLowerCase()) ||
      c.houseNumber.toLowerCase().includes(duesSearch.toLowerCase())
    );
  });

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
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
    });

    // Reset Form
    setTxDesc('');
    setTxAmount('');
    setTxType('masuk');
    setTxCategory('Iuran Bulanan');
    setShowAddTxForm(false);
  };

  const handleFileSimulate = () => {
    // Generate a simulated upload token/string
    const rand = Math.floor(Math.random() * 90000) + 10000;
    setSimulatedFile(`bukti_transfer_rt005_tx${rand}.jpg`);
  };

  const handlePayDuesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizen) return;
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
    });

    setSimulatedFile(null);
    setShowPaymentModal(false);
    setIsSuccessTip(true);
    setTimeout(() => {
      setIsSuccessTip(false);
    }, 5000);
  };

  const pendingRequests = paymentRequests.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-800">Laporan Keuangan & Iuran</h1>
          <p className="text-slate-500 mt-1">
            Transparansi pembukuan kas RT 005 dan pengelolaan kewajiban iuran bulanan warga.
          </p>
        </div>

        {/* Local Tab Navigation bar */}
        <div className="bg-white/40 border border-white/60 p-1.5 rounded-2xl flex shadow-xs backdrop-blur-md">
          <button
            onClick={() => setActiveSubTab('laporan')}
            className={`px-4.5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'laporan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Laporan Kas
          </button>
          <button
            onClick={() => setActiveSubTab('status-iuran')}
            className={`px-4.5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'status-iuran'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Status Iuran Rumah
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveSubTab('persetujuan')}
              className={`px-4.5 py-2 text-xs font-extrabold rounded-xl transition-all relative cursor-pointer ${
                activeSubTab === 'persetujuan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              Persetujuan {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS POPUP FOR PAYMENT SUBMIT */}
      <AnimatePresence>
        {isSuccessTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500/90 border border-emerald-400/50 backdrop-blur-md text-white p-4.5 rounded-[1.5rem] flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-white" />
              <div>
                <p className="font-extrabold">Bukti Pembayaran Berhasil Dikirim!</p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Terima kasih, pembayaran Anda sedang diproses oleh Bendahara RT. Status iuran akan berubah setelah disetujui.
                </p>
              </div>
            </div>
            <button onClick={() => setIsSuccessTip(false)} className="text-emerald-100 hover:text-white font-bold text-xs px-3.5 py-1.5 bg-emerald-600/60 rounded-xl transition-colors shrink-0">
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBTAB 1: LAPORAN KAS */}
      {activeSubTab === 'laporan' && (
        <div className="space-y-6">
          {/* Top Finance Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget Balance */}
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Kas Saldo RT 005</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-800 leading-none">
                  Rp {netBalance.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 pt-1 font-medium font-sans">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500 fill-blue-100" /> Transparansi Kas Bulanan
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-100/60 border border-white/40 text-blue-600 flex items-center justify-center font-extrabold text-xl">
                <Wallet className="h-6 w-6" />
              </div>
            </div>

            {/* Widget Income */}
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Total Pemasukan Mei</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 leading-none">
                  Rp {totalIncome.toLocaleString('id-ID')}
                </p>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  Dari iuran & donasi warga
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100/60 border border-white/40 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>

            {/* Widget Expenses */}
            <div className="glass-panel p-6 rounded-[2rem] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Total Pengeluaran Mei</span>
                <p className="text-xl sm:text-2xl font-extrabold text-rose-600 leading-none">
                  Rp {totalExpense.toLocaleString('id-ID')}
                </p>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  Kebersihan, keamanan & sosial
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-100/60 border border-white/40 text-rose-600 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Visual Percentage Gauge */}
          <div className="glass-panel p-5 rounded-[2rem]">
            <div className="flex justify-between items-center mb-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase font-mono">Disparitas Alokasi Kas (In vs Out)</h4>
              <span className="text-xs font-bold font-mono text-slate-700">
                Rasio Pengeluaran: {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}%
              </span>
            </div>
            
            <div className="h-3 w-full bg-emerald-100/60 border border-white/30 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 100}%` }}
                title="Saldo Tersisa"
              />
              <div 
                className="bg-rose-500 h-full animate-pulse" 
                style={{ width: `${totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0}%` }}
                title="Dana Terpakai"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium font-sans">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Saldo Tersisa</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> Dana Terpakai (Pengeluaran)</span>
            </div>
          </div>

          {/* ADD TRANSACTION FORM BLOCK (ADMIN) */}
          {isAdmin && !showAddTxForm && (
            <button
              onClick={() => setShowAddTxForm(true)}
              className="w-full py-4 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white/20 text-blue-700 hover:bg-white/40 rounded-[2rem] font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Tambah Transaksi Kas Baru
            </button>
          )}

          {isAdmin && showAddTxForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-[2rem] space-y-4 shadow-xl border border-white/60"
            >
              <div className="flex justify-between items-center border-b border-white/40 pb-3">
                <h3 className="font-extrabold text-slate-800 text-base">Registrasi Transaksi Baru (Admin)</h3>
                <button
                  type="button"
                  onClick={() => setShowAddTxForm(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-white/40 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransactionSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    required
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Contoh: Pembelian Sapu Selokan"
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Nominal Transfer (Rp)</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="Contoh: 150000"
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Jenis Transaksi</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTxType('masuk')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        txType === 'masuk'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-white/40 border border-white/60 text-slate-600 hover:bg-white/60'
                      }`}
                    >
                      Pemasukan
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('keluar')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        txType === 'keluar'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white/40 border border-white/60 text-slate-600 hover:bg-white/60'
                      }`}
                    >
                      Pengeluaran
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Kategori</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as FinancialTransaction['category'])}
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTxForm(false)}
                    className="px-4 py-2.5 border border-white/60 bg-white/20 hover:bg-white/40 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors min-w-[70px] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                  >
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Filtering and Search Controls for Transactions */}
          <div className="glass-panel p-6 rounded-[2rem] space-y-4">
            <h3 className="font-bold text-slate-800 text-sm font-sans">Riwayat Transaksi Kas</h3>
            
            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Cari transaksi..."
                  className="w-full pl-9 pr-3 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all font-sans"
                />
              </div>

              {/* In/Out Filters */}
              <div className="flex border border-white/60 p-0.5 rounded-xl text-xs font-bold bg-white/30 backdrop-blur-md">
                <button
                  onClick={() => setTxTypeFilter('semua')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'semua' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTxTypeFilter('masuk')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'masuk' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setTxTypeFilter('keluar')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === 'keluar' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pengeluaran
                </button>
              </div>

              {/* Category Picker */}
              <select
                value={txCategoryFilter}
                onChange={(e) => setTxCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans transition-all"
              >
                <option value="Semua" className="bg-white">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/30 text-xs text-slate-400 font-mono">
                    <th className="py-2.5 font-bold">TANGGAL</th>
                    <th className="py-2.5 font-bold">DESKRIPSI</th>
                    <th className="py-2.5 font-bold">KATEGORI</th>
                    <th className="py-2.5 font-bold text-right">NOMINAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-500">
                        Tidak ada catatan transaksi ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="text-xs sm:text-sm text-slate-800 hover:bg-white/10 transition-colors">
                        <td className="py-3 font-mono text-slate-400 whitespace-nowrap">{tx.date}</td>
                        <td className="py-3 max-w-[200px] md:max-w-xs xl:max-w-md font-sans">
                          <p className="font-bold text-slate-950">{tx.description}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Recorded by: {tx.recordedBy}</p>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] bg-white/40 border border-white/50 px-1.5 py-0.5 rounded-md text-slate-600 font-semibold uppercase font-sans">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <span
                            className={`font-mono font-bold ${
                              tx.type === 'masuk' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tx.type === 'masuk' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: STATUS IURAN RUMAH */}
      {activeSubTab === 'status-iuran' && (
        <div className="space-y-6">
          {/* Information banner on monthly dues */}
          <div className="bg-rose-500/10 border border-rose-300/40 p-5 rounded-[1.8rem] flex items-start gap-3 backdrop-blur-md">
            <Info className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <h4 className="font-extrabold text-slate-800 text-sm">Ketentuan Iuran RT 005</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap warga Kepala Keluarga di lingkungan RT 005 RW 02 diwajibkan menyetor iuran lingkungan sebesar <strong>Rp 100.000 / Bulan</strong> untuk pembiayaan kebersihan (truk sampah), jasa keamanan malam, santunan sosial kematian warga, dan pembinaan olahraga. Pengelola RT mendokumentasikan setiap setoran secara tertulis dan digital demi nilai integritas bersama.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base font-sans">Cek Status & Ajukan Pembayaran</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">Cari berdasarkan nama Kepala Keluarga atau nomor blok rumah Anda.</p>
              </div>

              {/* Dues search field */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={duesSearch}
                  onChange={(e) => setDuesSearch(e.target.value)}
                  placeholder="Cari Nama / No Blok..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Matrix of status */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/30 text-[11px] font-mono text-slate-400 text-left">
                    <th className="py-2.5 font-bold">KEPALA KELUARGA / BLOK</th>
                    {months.slice(0, 6).map((m) => (
                      <th key={m} className="py-2.5 font-bold text-center uppercase">{m.substring(0, 3)}</th>
                    ))}
                    <th className="py-2.5 font-bold text-center">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs text-slate-700 font-sans">
                  {filteredCitizensDues.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-sans">
                        Tidak ada data warga ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredCitizensDues.map((citizen) => {
                      const history2026 = citizen.paymentHistory[2026] || {};
                      return (
                        <tr key={citizen.id} className="hover:bg-white/10">
                          <td className="py-3">
                            <p className="font-bold text-slate-900">{citizen.citizenName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{citizen.houseNumber}</p>
                          </td>
                          {months.slice(0, 6).map((monthName) => {
                             const st = history2026[monthName];
                             return (
                               <td key={monthName} className="py-3 text-center">
                                 {st === 'Lunas' ? (
                                   <span className="inline-flex items-center justify-center h-5 px-1.5 bg-emerald-100/60 text-emerald-800 rounded-md font-bold text-[10px] border border-white/40">
                                     LUNAS
                                   </span>
                                 ) : st === 'Pending' ? (
                                   <span className="inline-flex items-center justify-center h-5 px-1.5 bg-amber-100/60 text-amber-800 rounded-md font-bold text-[10px] border border-white/40 animate-pulse" title="Menunggu persetujuan Admin">
                                     PENDING
                                   </span>
                                 ) : (
                                   <span className="inline-flex items-center justify-center h-5 px-1.5 bg-rose-100/65 text-rose-800 rounded-md font-bold text-[10px] border border-white/40">
                                     BELUM
                                   </span>
                                 )}
                               </td>
                             );
                          })}
                          <td className="py-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedCitizen(citizen);
                                setShowPaymentModal(true);
                              }}
                              className="px-3 py-1.5 bg-blue-50/70 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                            >
                              Bayar Iuran
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / limit info */}
            <p className="text-[11px] text-slate-400 pt-3 font-sans">
              *Tabel di atas menampilkan rangkuman iuran Semester 1 (Januari s.d Juni 2026). Dapatkan sertifikasi Lunas resmi dari pengurus jika semua kolom bernilai 'Lunas'.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PERSETUJUAN IURAN (ADMIN VIEW OF PAYMENT REQUESTS) */}
      {activeSubTab === 'persetujuan' && isAdmin && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] space-y-4">
            <div className="font-sans">
              <h3 className="font-extrabold text-slate-800 text-base">Antrean Verifikasi Setoran Iuran (Admin)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifikasi setoran iuran warga melalui unggahan bukti transfer rekening bank RT 005. Selesaikan antrean di bawah:
              </p>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2 font-sans">
                <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto animate-bounce" />
                <p>Semua antrean pembayaran aman! Tidak ada permohonan tersisa.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 border border-amber-200/40 bg-amber-500/10 backdrop-blur-md rounded-[1.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    <div className="space-y-2 flex-grow font-sans">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200/60 px-2 py-0.5 rounded">
                          Bulan: {req.month} {req.year}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Disetor {req.dateSubmitted}</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {req.citizenName} (Warga Rumah {req.houseNumber})
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Metode Bayar: <strong className="text-slate-700">{req.paymentMethod}</strong> • Senilai <strong className="text-slate-755 text-slate-700 font-mono text-[11px]">Rp {req.amount.toLocaleString('id-ID')}</strong>
                        </p>
                      </div>

                      {req.transferProofUrl && (
                        <div className="inline-flex items-center gap-1.5 bg-white/40 border border-white/60 px-2 py-1 rounded-lg text-[11px] text-blue-700 font-sans">
                          <FileText className="h-3 w-3" /> Bukti unggahan: <code className="font-mono text-slate-700 text-[10px] bg-white/30 px-1 rounded">{req.transferProofUrl}</code>
                        </div>
                      )}
                    </div>

                    {/* Approve / Reject Actions */}
                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => onRejectPaymentRequest(req.id)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-rose-500/15 border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <XCircle className="h-4 w-4" /> Tolak Pembayaran
                      </button>
                      <button
                        onClick={() => onApprovePaymentRequest(req.id)}
                        className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                      >
                        <Check className="h-4 w-4" /> Approve & Lunas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL PAY DUES (CITIZEN INTERACTION SIMULATOR) */}
      {showPaymentModal && selectedCitizen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-md w-full p-6 space-y-4 relative rounded-[2rem] shadow-2xl border border-white/70"
          >
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSimulatedFile(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <div className="space-y-2 font-sans">
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 border border-white/40 px-2.5 py-1 rounded-full">
                Simulasi Transfer Kas RT
              </span>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Formulir Setor Iuran</h3>
              <p className="text-xs text-slate-500">
                Lakukan pembayaran iuran bulanan untuk: <strong className="text-slate-950 font-bold">{selectedCitizen.citizenName} ({selectedCitizen.houseNumber})</strong>
              </p>
            </div>

            <form onSubmit={handlePayDuesSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Untuk Bulan</label>
                  <select
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:outline-none transition-all"
                  >
                    {months.map((m) => {
                      const history2026 = selectedCitizen.paymentHistory[2026] || {};
                      const st = history2026[m];
                      // Label status in select list
                      return (
                        <option key={m} value={m} disabled={st === 'Lunas'} className="bg-white">
                          {m} ({st === 'Lunas' ? 'Lunas ✔' : st === 'Pending' ? 'Pending ⏳' : 'Belum ❌'})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jumlah Iuran (Rp)</label>
                  <input
                    type="number"
                    readOnly
                    value={payAmount}
                    className="w-full px-3 py-2 bg-white/20 border-white/40 border rounded-xl text-xs text-slate-500 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Metode Pembayaran</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:outline-none transition-all"
                >
                  <option value="Transfer BCA (VA RT 005 - 8275005)" className="bg-white font-sans">Transfer BCA (VA 8275005)</option>
                  <option value="Transfer Mandiri (VA 005-9988)" className="bg-white font-sans">Transfer Mandiri (VA 005-9988)</option>
                  <option value="Dompet Digital / QRIS RT 005" className="bg-white font-sans">QRIS Portal RT 005</option>
                  <option value="Tunai ke Bendahara (Ibu Susan)" className="bg-white font-sans">Tunai Ke Bendahara</option>
                </select>
              </div>

              {/* SIMULATED UPLOAD TRANSFER PROOF */}
              <div className="space-y-2 border border-dashed border-white/60 bg-white/20 p-4 rounded-xl text-center">
                {simulatedFile ? (
                  <div className="text-xs space-y-1 font-sans">
                    <p className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 rounded-full" /> File Berhasil Diunggah!
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono break-all">{simulatedFile}</p>
                    <button
                      type="button"
                      onClick={() => setSimulatedFile(null)}
                      className="text-[10px] text-rose-500 hover:underline font-bold"
                    >
                      Hapus & Ulangi
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 font-sans">
                    <div className="p-2.5 rounded-full bg-blue-100/60 border border-white/40 text-blue-600 inline-flex">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">Unggah Bukti Pembayaran</p>
                      <p className="text-[10px] text-slate-400 mt-1">Gunakan simulasi klik di bawah untuk mengunggah berkas transfer</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFileSimulate}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                    >
                      Simulasikan Upload Bukti Transfer (.JPG)
                    </button>
                  </div>
                )}
              </div>

              {/* Transfer Details Guide Box */}
              <div className="p-3 bg-white/20 rounded-xl text-[10px] text-slate-500 leading-normal border border-white/50 font-sans">
                <span className="font-bold text-slate-800 block">Informasi Transfer Rekening RT:</span>
                • BCA Virtual Account: <strong>8275 005 {selectedCitizen.houseNumber.replace(/\D/g, '') || '01'}</strong> <br />
                • Atas Nama: <strong>KAS KELUARGA RT005 JATIBENING</strong>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSimulatedFile(null);
                  }}
                  className="flex-1 py-2.5 bg-white/20 border border-white/60 text-slate-600 text-xs font-bold rounded-xl hover:bg-white/40 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!simulatedFile}
                  className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer transition-all ${
                    simulatedFile
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10'
                      : 'bg-slate-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kirim Konfirmasi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
