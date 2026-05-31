import React from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { useLaporanKas } from '../../hooks/useLaporanKas';

interface LaporanKasTabProps {
  transactions: FinancialTransaction[];
  isAdmin: boolean;
  selectedRT: string;
  selectedRW: string;
  onAddTransaction: (tx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => void;
}

export default function LaporanKasTab({
  transactions,
  isAdmin,
  selectedRT,
  selectedRW,
  onAddTransaction,
}: LaporanKasTabProps) {
  const {
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
  } = useLaporanKas({ transactions, selectedRT, selectedRW, onAddTransaction });

  return (
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
  );
}
