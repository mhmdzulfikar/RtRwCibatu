import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  FileSearch,
  Activity,
  Calendar,
  Eye,
  Info
} from 'lucide-react';
import { LetterRequest } from '../types';
import { useLetterRequestsView } from '../hooks/useLetterRequestsView';

import ApplyLetterForm from './letters/ApplyLetterForm';
import LetterPreviewModal from './letters/LetterPreviewModal';

interface LetterRequestsViewProps {
  requests: LetterRequest[];
  isAdmin: boolean;
  isWarga?: boolean;
  onSubmitRequest: (req: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => void;
  onUpdateStatus: (id: string, status: LetterRequest['status'], updateData?: { referenceNo?: string; rejectedReason?: string }) => void;
  onFetchLetterForPrint: (id: string, nik?: string) => Promise<LetterRequest | null>;
}

export default function LetterRequestsView({
  requests,
  isAdmin,
  isWarga,
  onSubmitRequest,
  onUpdateStatus,
  onFetchLetterForPrint,
}: LetterRequestsViewProps) {
  const {
    viewState,
    updateViewState,
    triggerRejectSubmit,
    triggerApproveSign,
    getSafeNik,
    getSafeName,
    handlePrintClick,
  } = useLetterRequestsView({ isAdmin, isWarga, onUpdateStatus, onFetchLetterForPrint });
  
  const { showApplyForm, selectedLetter, rejectingId, rejectionReasonText } = viewState;
  const [activeTab, setActiveTab] = React.useState<'aktif' | 'riwayat'>('aktif');

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'aktif') return req.status === 'submitted' || req.status === 'processing';
    return req.status === 'ready' || req.status === 'rejected';
  });

  return (
    <div className="space-y-8">
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-800">
            Pengajuan Surat Domisili
          </h1>
          <p className="text-slate-500 mt-1">
            Layanan pengajuan Surat Pengantar Domisili RT secara online untuk kelancaran administrasi Anda.
          </p>
        </div>

        {(!showApplyForm && (isAdmin || isWarga)) && (
          <button
            onClick={() => updateViewState({ showApplyForm: true })}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 text-sm cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" /> Buat Pengajuan Baru
          </button>
        )}
      </div>

      {/* DETAILED FORM FOR REGISTRATION / REQUEST */}
      {showApplyForm && (
        <ApplyLetterForm
          onClose={() => updateViewState({ showApplyForm: false })}
          onSubmitRequest={onSubmitRequest}
        />
      )}

      {/* REJECT FORM BOX OVERLAY (FOR ADMIN) */}
      {rejectingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel max-w-sm w-full p-6 space-y-4 rounded-[2rem] shadow-2xl border border-white/70 font-sans">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Alasan Penolakan Surat</h3>
              <p className="text-xs text-slate-500 mt-1">Berikan argumen mengapa surat ini ditolak agar warga tahu alasannya.</p>
            </div>
            <textarea
              rows={3}
              value={rejectionReasonText}
              onChange={(e) => updateViewState({ rejectionReasonText: e.target.value })}
              placeholder="Contoh: NIK pemohon salah / mohon perbaiki NIK sesuai KK asli Anda."
              className="w-full px-3.5 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs sm:text-sm focus:outline-none transition-all"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  updateViewState({ rejectingId: null, rejectionReasonText: '' });
                }}
                className="px-4 py-2 border border-white/60 bg-white/20 hover:bg-white/40 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => triggerRejectSubmit(rejectingId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
              >
                Tolak Surat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST OF CURRENT APPLICATIONS / TRACKER */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 font-sans">
            <Activity className="h-4 w-4 text-blue-600" /> Pantau Dokumen
          </h2>
          
          <div className="flex gap-2 bg-white/40 p-1 rounded-xl border border-white/60">
            <button
              onClick={() => setActiveTab('aktif')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'aktif' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Surat Aktif
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'riwayat' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Riwayat (Selesai/Ditolak)
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-[2rem] space-y-3 font-sans">
            <FileSearch className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-slate-800 text-sm">Belum ada {activeTab === 'aktif' ? 'surat yang aktif' : 'riwayat surat'}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {(isAdmin || isWarga) ? (activeTab === 'aktif' ? 'Silakan buat pengajuan pertama Anda dengan mengklik "Buat Pengajuan Baru" di sisi atas.' : 'Belum ada surat yang selesai atau ditolak.') : 'Hanya warga RT 005 yang sudah login yang dapat mengakses ini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="glass-panel p-5 rounded-[1.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200/60 transition-colors"
              >
                {/* General applicant text details */}
                <div className="space-y-1.5 flex-1 min-w-0 font-sans">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400"># {req.id}</span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Diajukan: {req.dateRequested}
                    </span>

                    {/* Status Badge */}
                    {req.status === 'submitted' ? (
                      <span className="px-2 py-0.5 bg-amber-500/15 text-amber-800 border border-amber-200/40 text-[10px] font-bold rounded">
                        MENUNGGU PERSETUJUAN
                      </span>
                    ) : req.status === 'processing' ? (
                      <span className="px-2 py-0.5 bg-blue-500/15 text-blue-800 border border-blue-200/40 text-[10px] font-bold rounded animate-pulse">
                        SEDANG DIPROSES RT
                      </span>
                    ) : req.status === 'ready' ? (
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-800 border border-emerald-200/40 text-[10px] font-bold rounded">
                        SIAP DIAMBIL / CETAK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-500/15 text-rose-800 border border-rose-250/40 text-[10px] font-bold rounded">
                        PERMOHONAN DITOLAK
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                      {getSafeName(req.applicantName)}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Keperluan: <strong className="text-slate-700 font-bold">{req.purpose}</strong>
                    </p>
                    {req.nik && req.address && (
                      <p className="text-[11px] text-slate-400 leading-normal">
                        NIK: <span className="font-mono bg-white/30 px-1 py-0.5 rounded border border-white/50">{getSafeNik(req.nik)}</span> • Alamat: {req.address}
                      </p>
                    )}
                  </div>

                  {/* Reject message row */}
                  {req.status === 'rejected' && req.rejectedReason && (
                    <div className="p-3 bg-rose-500/10 border border-rose-200/30 rounded-xl text-xs text-rose-800 flex items-start gap-1.5">
                      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>Alasan Penolakan: <strong className="font-bold">{req.rejectedReason}</strong></span>
                    </div>
                  )}

                  {/* Ref number text helper */}
                  {req.status === 'ready' && req.referenceNo && (
                    <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded border border-emerald-200/30 font-mono font-bold">
                      No. Surat: {req.referenceNo}
                    </div>
                  )}
                </div>

                {/* CITIZEN vs ADMIN actions inside item card */}
                <div className="flex gap-2 shrink-0 w-full md:w-auto font-sans">
                  {/* VIEW PRINTABLE LETTER (RESTRICTED TO ADMIN & WARGA) */}
                  {req.status === 'ready' && (isAdmin || isWarga) && (
                    <button
                      onClick={() => handlePrintClick(req)}
                      className="px-4 py-2 text-emerald-700 bg-emerald-500/15 hover:bg-emerald-600 hover:text-white border border-emerald-250/30 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 justify-center cursor-pointer w-full md:w-auto transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" /> Lihat & Cetak Surat
                    </button>
                  )}

                  {/* ADMIN CONTROL TRIGGERS */}
                  {isAdmin && (
                    <div className="flex gap-1.5 w-full md:w-auto font-sans">
                      {req.status === 'submitted' && (
                        <button
                          onClick={() => onUpdateStatus(req.id, 'processing')}
                          className="flex-1 md:flex-initial px-4 py-2 bg-blue-500/15 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200/40 rounded-xl font-bold text-xs cursor-pointer transition-all"
                        >
                          Mulai Proses
                        </button>
                      )}

                      {req.status === 'processing' && (
                        <button
                          onClick={() => triggerApproveSign(req)}
                          className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                        >
                          Tandatangan (Terbit)
                        </button>
                      )}

                      {(req.status === 'submitted' || req.status === 'processing') && (
                        <button
                          onClick={() => updateViewState({ rejectingId: req.id })}
                          className="px-3.5 py-2 bg-rose-500/15 border border-rose-200 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl font-bold text-xs cursor-pointer transition-all"
                          title="Tolak Pengajuan"
                        >
                          Tolak
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMPLETE DETAILED PRINTABLE PAPER MODAL (OFFICIAL INDONESIAN COVER LETTER PREVIEW) */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterPreviewModal
            selectedLetter={selectedLetter}
            onClose={() => updateViewState({ selectedLetter: null })}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
