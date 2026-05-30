import React from 'react';
import { CheckCircle2, FileText, XCircle, Check } from 'lucide-react';
import { DuesPaymentRequest } from '../../types';

interface PersetujuanTabProps {
  pendingRequests: DuesPaymentRequest[];
  onApprovePaymentRequest: (id: string) => void;
  onRejectPaymentRequest: (id: string) => void;
}

export default function PersetujuanTab({
  pendingRequests,
  onApprovePaymentRequest,
  onRejectPaymentRequest,
}: PersetujuanTabProps) {
  return (
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
                      Metode Bayar: <strong className="text-slate-700">{req.paymentMethod}</strong> • Senilai <strong className="text-slate-700 font-mono text-[11px]">Rp {req.amount.toLocaleString('id-ID')}</strong>
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
  );
}
