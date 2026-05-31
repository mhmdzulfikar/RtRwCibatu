import React from 'react';
import { motion } from 'motion/react';
import { XCircle, CheckCircle2, Upload } from 'lucide-react';
import { CitizenDues, DuesPaymentRequest } from '../../types';
import { usePayDuesModal } from '../../hooks/usePayDuesModal';

interface PayDuesModalProps {
  selectedCitizen: CitizenDues;
  onClose: () => void;
  onSubmitPaymentRequest: (request: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => void;
}

export default function PayDuesModal({
  selectedCitizen,
  onClose,
  onSubmitPaymentRequest,
}: PayDuesModalProps) {
  const {
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
  } = usePayDuesModal({ selectedCitizen, onSubmitPaymentRequest });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-md w-full p-6 space-y-4 relative rounded-[2rem] shadow-2xl border border-white/70"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <XCircle className="h-5 w-5" />
        </button>

        <div className="space-y-2 font-sans">
          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 border border-white/40 px-2.5 py-1 rounded-full">
            Simulasi Transfer Kas RT
          </span>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Formulir Setor Iuran</h3>
          <p className="text-xs text-slate-500">
            Lakukan pembayaran iuran bulanan untuk:{' '}
            <strong className="text-slate-950 font-bold">
              {selectedCitizen.citizenName} ({selectedCitizen.houseNumber})
            </strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
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
              className="w-full px-3 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs focus:outline-none transition-all bg-white"
            >
              <option value="Transfer BCA (VA RT 005 - 8275005)" className="bg-white font-sans">
                Transfer BCA (VA 8275005)
              </option>
              <option value="Transfer Mandiri (VA 005-9988)" className="bg-white font-sans">
                Transfer Mandiri (VA 005-9988)
              </option>
              <option value="Dompet Digital / QRIS RT 005" className="bg-white font-sans">
                QRIS Portal RT 005
              </option>
              <option value="Tunai ke Bendahara (Ibu Susan)" className="bg-white font-sans">
                Tunai Ke Bendahara
              </option>
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
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gunakan simulasi klik di bawah untuk mengunggah berkas transfer
                  </p>
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
            • BCA Virtual Account:{' '}
            <strong>8275 005 {selectedCitizen.houseNumber.replace(/\D/g, '') || '01'}</strong> <br />
            • Atas Nama: <strong>KAS KELUARGA RT005 JATIBENING</strong>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}
