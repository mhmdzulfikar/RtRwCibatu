import React from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { FinancialTransaction, CitizenDues, DuesPaymentRequest } from '../types';
import { useFinancesView } from '../hooks/useFinancesView';

import LaporanKasTab from './finances/LaporanKasTab';
import StatusIuranTab from './finances/StatusIuranTab';
import PersetujuanTab from './finances/PersetujuanTab';
import PayDuesModal from './finances/PayDuesModal';

interface FinancesViewProps {
  transactions: FinancialTransaction[];
  citizensDues: CitizenDues[];
  paymentRequests: DuesPaymentRequest[];
  isAdmin: boolean;
  isWarga?: boolean;
  onAddCitizenDues: (name: string, houseNumber: string) => void;
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
  isWarga,
  onAddCitizenDues,
  onAddTransaction,
  onApprovePaymentRequest,
  onRejectPaymentRequest,
  onSubmitPaymentRequest,
}: FinancesViewProps) {
  const {
    activeSubTab,
    setActiveSubTab,
    scope,
    paymentModal,
    updatePaymentModal,
    handlePayDuesClick,
    handlePaymentSubmit,
    pendingRequests,
  } = useFinancesView({ isAdmin, paymentRequests, onSubmitPaymentRequest });

  return (
    <div className="space-y-8">
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-800">
            Laporan Keuangan & Iuran
          </h1>
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
              Persetujuan{' '}
              {pendingRequests.length > 0 && (
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
        {paymentModal.showSuccessTip && (
          <div className="bg-emerald-500/90 border border-emerald-400/50 backdrop-blur-md text-white p-4.5 rounded-[1.5rem] flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-white" />
              <div>
                <p className="font-extrabold">Bukti Pembayaran Berhasil Dikirim!</p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Terima kasih, pembayaran Anda sedang diproses oleh Bendahara RT. Status iuran akan berubah setelah disetujui.
                </p>
              </div>
            </div>
            <button
              onClick={() => updatePaymentModal({ showSuccessTip: false })}
              className="text-emerald-100 hover:text-white font-bold text-xs px-3.5 py-1.5 bg-emerald-600/60 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* SUBTAB 1: LAPORAN KAS */}
      {activeSubTab === 'laporan' && (
        <LaporanKasTab
          transactions={transactions}
          isAdmin={isAdmin}
          selectedRT={scope.rt}
          selectedRW={scope.rw}
          onAddTransaction={onAddTransaction}
        />
      )}

      {/* SUBTAB 2: STATUS IURAN RUMAH */}
      {activeSubTab === 'status-iuran' && (
        <StatusIuranTab
          citizensDues={citizensDues}
          onPayDuesClick={handlePayDuesClick}
          onAddCitizen={onAddCitizenDues}
          selectedRT={scope.rt}
          selectedRW={scope.rw}
          isWarga={isWarga}
          isAdmin={isAdmin}
        />
      )}

      {/* SUBTAB 3: PERSETUJUAN IURAN (ADMIN VIEW OF PAYMENT REQUESTS) */}
      {activeSubTab === 'persetujuan' && isAdmin && (
        <PersetujuanTab
          pendingRequests={pendingRequests}
          onApprovePaymentRequest={onApprovePaymentRequest}
          onRejectPaymentRequest={onRejectPaymentRequest}
        />
      )}

      {/* MODAL PAY DUES (CITIZEN INTERACTION SIMULATOR) */}
      {paymentModal.isOpen && paymentModal.selectedCitizen && (
        <PayDuesModal
          selectedCitizen={paymentModal.selectedCitizen}
          onClose={() => updatePaymentModal({ isOpen: false, selectedCitizen: null })}
          onSubmitPaymentRequest={handlePaymentSubmit}
        />
      )}
    </div>
  );
}
