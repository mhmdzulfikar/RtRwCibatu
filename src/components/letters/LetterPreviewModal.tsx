import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy, Check, Printer, X, Info } from 'lucide-react';
import { LetterRequest } from '../../types';
import { maskSensitiveNumber } from '../../security';

interface LetterPreviewModalProps {
  selectedLetter: LetterRequest;
  onClose: () => void;
  isAdmin: boolean;
}

export default function LetterPreviewModal({
  selectedLetter,
  onClose,
  isAdmin,
}: LetterPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSafeNik = (value: string) => (isAdmin ? value : maskSensitiveNumber(value));
  const getSafeKk = (value: string) => (isAdmin ? value : maskSensitiveNumber(value));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto print:bg-white print:p-0"
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel rounded-[2rem] w-full max-w-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto border border-white/70 print:bg-white print:shadow-none print:border-none print:p-0"
      >
        {/* Toolbar Controls at top of paper overlay */}
        <div className="sticky top-0 z-20 -mx-2 -mt-2 px-2 pt-2 pb-4 rounded-t-[1.5rem] bg-white/80 backdrop-blur-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-white/45 font-sans print:hidden">
          <span className="text-xs font-bold font-mono text-emerald-850 bg-emerald-200/50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Surat Resmi Digital Terbit
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                handleCopyText(
                  `Surat Keterangan Pengantar RT 005 RW 02 - Nomor: ${
                    selectedLetter.referenceNo
                  }\nNama: ${selectedLetter.applicantName}\nNIK: ${getSafeNik(
                    selectedLetter.nik
                  )}\nAlamat: ${selectedLetter.address}`
                )
              }
              className="p-2 border border-white/60 bg-white/10 hover:bg-white/30 rounded-lg text-slate-600 hover:text-slate-800 transition-colors text-xs flex items-center gap-1 font-bold cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}{' '}
              {copied ? 'Tersalin' : 'Salin Teks'}
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs flex items-center gap-1 font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Cetak (PDF)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs flex items-center gap-1 font-bold transition-all shadow-md shadow-slate-500/10 cursor-pointer"
            >
              <X className="h-4 w-4" /> Tutup
            </button>
          </div>
        </div>

        {/* INDONESIAN OFFICIAL LETTERHEAD AND CORE PAPER LAYOUT */}
        <div className="border border-white/70 bg-white/95 backdrop-blur-3xl p-6 md:p-10 rounded-2xl shadow-xl text-slate-900 font-serif max-w-[21cm] mx-auto print:border-none print:p-0 print:bg-white">
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-gray-950 text-center pb-4 space-y-1">
            <h2 className="text-base md:text-lg font-bold tracking-wider uppercase font-sans">
              RUKUN TETANGGA 005 / RUKUN WARGA 02
            </h2>
            <h3 className="text-sm md:text-base font-bold tracking-wide uppercase font-sans">
              KELURAHAN CIBATU
            </h3>
            <p className="text-[10px] md:text-xs text-gray-600 italic font-sans font-medium">
              Sekretariat: Perumahan Harper, Kelurahan Cibatu
            </p>
          </div>

          {/* Surat Title */}
          <div className="text-center mt-6 space-y-0.5">
            <h4 className="text-base md:text-lg font-bold uppercase underline tracking-wide">
              SURAT KETERANGAN PENGANTAR
            </h4>
            <p className="text-[11px] md:text-xs font-mono">
              Nomor: {selectedLetter.referenceNo || '.../SRT-DOM/V/2026'}
            </p>
          </div>

          {/* Opening Body */}
          <p className="text-xs md:text-sm text-justify leading-relaxed mt-6">
            Yang bertanda tangan di bawah ini Rukun Tetangga (RT) 005 Rukun Warga (RW) 02 Kelurahan Cibatu,
            Kecamatan Pondok Gede, Kota Bekasi dengan menerangkan bahwa:
          </p>

          {/* Table details */}
          <div className="my-6 space-y-2 md:space-y-3 pl-4 md:pl-8 text-xs md:text-sm">
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">1. Nama Lengkap</span>
              <span className="col-span-3">: {selectedLetter.applicantName}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">2. NIK</span>
              <span className="col-span-3 font-mono">: {getSafeNik(selectedLetter.nik)}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">3. No. KK</span>
              <span className="col-span-3 font-mono">: {getSafeKk(selectedLetter.kk)}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">4. TTL</span>
              <span className="col-span-3">
                : {selectedLetter.birthPlace}, {selectedLetter.birthDate}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">5. Jenis Kelamin</span>
              <span className="col-span-3">: {selectedLetter.gender}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <span className="font-bold">6. Agama / Pekerjaan</span>
              <span className="col-span-3">
                : {selectedLetter.religion} / {selectedLetter.profession}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-justify">
              <span className="font-bold">7. Alamat</span>
              <span className="col-span-3">: {selectedLetter.address}</span>
            </div>
          </div>

          {/* Closing Body */}
          <p className="text-xs md:text-sm text-justify leading-relaxed mt-4">
            Orang tersebut di atas benar adalah warga domisili menetap di wilayah kami RT 005. Surat Keterangan Pengantar
            ini dikeluarkan secara mandiri oleh pihak pengelola guna dipergunakan pemohon sebagai:{' '}
            <strong className="font-extrabold">{selectedLetter.purpose}</strong>.
          </p>
          <p className="text-xs md:text-sm text-justify leading-relaxed mt-3">
            Demikian Surat Keterangan Pengantar ini dibuat dengan sebenarnya dan bertanggung jawab penuh untuk
            dipergunakan oleh pihak yang bersangkutan secara bijaksana.
          </p>

          {/* Sign Off Row */}
          <div className="grid grid-cols-12 gap-4 text-center text-xs md:text-sm mt-16 pb-6">
            <div className="col-span-6 space-y-12">
              <p>Mengetahui/Pemohon</p>
              <div className="space-y-0.5">
                <p className="font-bold underline uppercase">{selectedLetter.applicantName}</p>
                <p className="text-[10px] text-gray-500 font-sans">Warga RT 005</p>
              </div>
            </div>

            <div className="col-span-6 space-y-12">
              <p>Bekasi, {selectedLetter.dateRequested}</p>
              <div className="space-y-0.5 relative">
                {/* Signature graphic simulate logo */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-50 text-red-600 border border-dashed border-red-300 font-mono text-[9px] font-extrabold rotate-2 uppercase tracking-widest rounded shadow-xs opacity-75">
                  SIGNED DIGITAL RT 005
                </span>
                <p className="font-bold underline uppercase">Hendra Kurniawan</p>
                <p className="text-[10px] text-gray-500 font-sans">Ketua RT 005 / RW 02</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions on bottom */}
        <div className="p-4 bg-white/20 rounded-2xl border border-white/40 flex items-start gap-2.5 text-xs text-slate-500 mt-2 font-sans print:hidden">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>Catatan Cetak</strong>: Jika Anda mencetak dari peramban (browser), centang pilihan{' '}
            <strong>"Background Graphics"</strong> pada pengaturan cetak agar stempel digital berwarna tetap terlihat
            dengan jelas.
          </p>
        </div>

        <div className="flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" /> Tutup Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
}
