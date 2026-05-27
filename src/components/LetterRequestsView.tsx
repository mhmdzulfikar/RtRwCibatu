import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileSearch,
  Printer,
  ChevronRight,
  User,
  Hash,
  Activity,
  Calendar,
  Eye,
  Settings,
  X,
  Copy,
  Check,
  Building,
  Info
} from 'lucide-react';
import { LetterRequest } from '../types';
import { maskSensitiveNumber } from '../security';

interface LetterRequestsViewProps {
  requests: LetterRequest[];
  isAdmin: boolean;
  onSubmitRequest: (req: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => void;
  onUpdateStatus: (id: string, status: LetterRequest['status'], updateData?: { referenceNo?: string; rejectedReason?: string }) => void;
}

export default function LetterRequestsView({
  requests,
  isAdmin,
  onSubmitRequest,
  onUpdateStatus,
}: LetterRequestsViewProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LetterRequest | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [nik, setNik] = useState('');
  const [kk, setKk] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [phone, setPhone] = useState('');
  const [religion, setReligion] = useState('Islam');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [purpose, setPurpose] = useState('');

  // Admin reject modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const closeLetterPreview = () => {
    setSelectedLetter(null);
  };

  useEffect(() => {
    if (!selectedLetter) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLetterPreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLetter]);

  // NIK/KK helper text limiters
  const handleDigitsOnly = (val: string, setter: (v: string) => void) => {
    setter(val.replace(/\D/g, ''));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length !== 16) {
      alert('NIK harus berupa 16 digit angka.');
      return;
    }
    if (kk.length !== 16) {
      alert('Nomor KK harus berupa 16 digit angka.');
      return;
    }
    if (!applicantName.trim() || !birthPlace.trim() || !birthDate || !phone.trim() || !address.trim() || !purpose.trim()) {
      alert('Harap lengkapi semua data dalam formulir.');
      return;
    }

    onSubmitRequest({
      applicantName,
      nik,
      kk,
      birthPlace,
      birthDate,
      gender,
      phone,
      religion,
      profession,
      address,
      purpose,
    });

    // Reset Form fields
    setApplicantName('');
    setNik('');
    setKk('');
    setBirthPlace('');
    setBirthDate('');
    setPhone('');
    setProfession('');
    setAddress('');
    setPurpose('');
    setShowApplyForm(false);
    alert('Permohonan Surat Pengantar Domisili Anda berhasil dikirim ke pengurus RT!');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerRejectSubmit = (id: string) => {
    if (!rejectionReasonText.trim()) {
      alert('Harap berikan alasan penolakan.');
      return;
    }
    onUpdateStatus(id, 'rejected', { rejectedReason: rejectionReasonText });
    setRejectingId(null);
    setRejectionReasonText('');
  };

  const triggerApproveSign = (req: LetterRequest) => {
    // Generate a beautiful, standard Indonesian numbered document identifier
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonthRoman = romanMonths[new Date().getMonth()];
    const randNum = Math.floor(Math.random() * 80) + 10;
    const refNo = `${randNum}/SRT-DOM/${currentMonthRoman}/${new Date().getFullYear()}`;

    onUpdateStatus(req.id, 'ready', { referenceNo: refNo });
  };

  const getSafeNik = (value: string) => isAdmin ? value : maskSensitiveNumber(value);
  const getSafeKk = (value: string) => isAdmin ? value : maskSensitiveNumber(value);

  return (
    <div className="space-y-8">
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-800">Pengajuan Surat Domisili</h1>
          <p className="text-slate-500 mt-1">
            Layanan pengajuan Surat Pengantar Domisili RT secara online untuk kelancaran administrasi Anda.
          </p>
        </div>

        {!showApplyForm && (
          <button
            onClick={() => setShowApplyForm(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 text-sm cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" /> Buat Pengajuan Baru
          </button>
        )}
      </div>

      {/* DETAILED FORM FOR REGISTRATION / REQUEST */}
      {showApplyForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 md:p-8 rounded-[2rem] space-y-6 shadow-xl border border-white/60"
        >
          <div className="flex justify-between items-center border-b border-white/40 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 font-sans">
                <FileText className="h-5 w-5 text-blue-600" /> Formulir Permohonan Surat Pengantar RT
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Isilah formulir dengan benar sesuai dengan KTP dan KK Anda.</p>
            </div>
            <button
              onClick={() => setShowApplyForm(false)}
              className="p-1.5 rounded-full hover:bg-white/40 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-4 font-sans">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-blue-700 border-l-4 border-blue-600 pl-2">
              Identitas Warga (Data Pemohon)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Pemohon</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => handleDigitsOnly(e.target.value, setNik)}
                    placeholder="16 digit NIK"
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">Digit: {nik.length}/16</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={kk}
                    onChange={(e) => handleDigitsOnly(e.target.value, setKk)}
                    placeholder="16 digit No KK"
                    className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">Digit: {kk.length}/16</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tempat Lahir</label>
                <input
                  type="text"
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Contoh: Jakarta"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tanggal Lahir</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Laki-laki')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      gender === 'Laki-laki'
                        ? 'bg-blue-600 text-white border-transparent shadow-xs'
                        : 'bg-white/40 border-white/60 text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Perempuan')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      gender === 'Perempuan'
                        ? 'bg-blue-600 text-white border-transparent shadow-xs'
                        : 'bg-white/40 border-white/60 text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Agama</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="Islam" className="bg-white">Islam</option>
                  <option value="Kristen Protestan" className="bg-white">Kristen Protestan</option>
                  <option value="Katolik" className="bg-white">Katolik</option>
                  <option value="Hindu" className="bg-white">Hindu</option>
                  <option value="Buddha" className="bg-white">Buddha</option>
                  <option value="Khonghucu" className="bg-white">Khonghucu</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pekerjaan</label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Contoh: Karyawan Swasta"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812XXXXXXXX"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-blue-700 border-l-4 border-blue-600 pl-2 pt-2">
              Keperluan & Alamat RT005
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal (RT 005)</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Perumahan Cemara Blok B/02, Jatibening Baru"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Keperluan / Tujuan Pengajuan Surat</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Persyaratan Pengurusan Rekening Bank / Melamar Kerja / BPJS"
                  className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/40">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="px-5 py-2.5 border border-white/60 bg-white/20 hover:bg-white/40 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                Kirim Permohonan Surat
              </button>
            </div>
          </form>
        </motion.div>
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
              onChange={(e) => setRejectionReasonText(e.target.value)}
              placeholder="Contoh: NIK pemohon salah / mohon perbaiki NIK sesuai KK asli Anda."
              className="w-full px-3.5 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-xs sm:text-sm focus:outline-none transition-all"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReasonText('');
                }}
                className="px-4 py-2 border border-white/60 bg-white/20 hover:bg-white/40 rounded-xl text-xs font-bold text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => triggerRejectSubmit(rejectingId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/10 transition-colors"
              >
                Tolak Surat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST OF CURRENT APPLICATIONS / TRACKER */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 font-sans">
          <Activity className="h-4 w-4 text-blue-600" /> Pantau Antrean & Hasil Dokumen
        </h2>

        {requests.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-[2rem] space-y-3 font-sans">
            <FileSearch className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-slate-800 text-sm">Belum ada pengajuan terdaftar</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Silakan buat pengajuan pertama Anda dengan mengklik "Buat Pengajuan Baru" di sisi atas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
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
                    
                    {/* Stepper Status Badge representation */}
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
                      {req.applicantName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Keperluan: <strong className="text-slate-700 font-bold">{req.purpose}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      NIK: <span className="font-mono bg-white/30 px-1 py-0.5 rounded border border-white/50">{getSafeNik(req.nik)}</span> • Alamat: {req.address}
                    </p>
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
                  {/* CITIZEN: View Printable Letter */}
                  {req.status === 'ready' && (
                    <button
                      onClick={() => setSelectedLetter(req)}
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
                          onClick={() => setRejectingId(req.id)}
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
          <div
            onClick={closeLetterPreview}
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
                    onClick={() => handleCopyText(`Surat Keterangan Pengantar RT 005 RW 02 - Nomor: ${selectedLetter.referenceNo}\nNama: ${selectedLetter.applicantName}\nNIK: ${getSafeNik(selectedLetter.nik)}\nAlamat: ${selectedLetter.address}`)}
                    className="p-2 border border-white/60 bg-white/10 hover:bg-white/30 rounded-lg text-slate-600 hover:text-slate-800 transition-colors text-xs flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs flex items-center gap-1 font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" /> Cetak (PDF)
                  </button>
                  <button
                    onClick={closeLetterPreview}
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
                    KELURAHAN JATIBENING BARU • KECAMATAN PONDOK GEDE
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 italic font-sans font-medium">
                    Sekretariat: Kavling Melati Indah, Jatibening Baru, Pondok Gede, Kota Bekasi, Jawa Barat
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
                  Yang bertanda tangan di bawah ini Rukun Tetangga (RT) 005 Rukun Warga (RW) 02 Kelurahan Jatibening Baru, Kecamatan Pondok Gede, Kota Bekasi dengan menerangkan bahwa:
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
                    <span className="col-span-3">: {selectedLetter.birthPlace}, {selectedLetter.birthDate}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <span className="font-bold">5. Jenis Kelamin</span>
                    <span className="col-span-3">: {selectedLetter.gender}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <span className="font-bold">6. Agama / Pekerjaan</span>
                    <span className="col-span-3">: {selectedLetter.religion} / {selectedLetter.profession}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-justify">
                    <span className="font-bold">7. Alamat</span>
                    <span className="col-span-3">: {selectedLetter.address}</span>
                  </div>
                </div>

                {/* Closing Body */}
                <p className="text-xs md:text-sm text-justify leading-relaxed mt-4">
                  Orang tersebut di atas benar adalah warga domisili menetap di wilayah kami RT 005. Surat Keterangan Pengantar ini dikeluarkan secara mandiri oleh pihak pengelola guna dipergunakan pemohon sebagai: <strong className="font-extrabold">{selectedLetter.purpose}</strong>.
                </p>
                <p className="text-xs md:text-sm text-justify leading-relaxed mt-3">
                  Demikian Surat Keterangan Pengantar ini dibuat dengan sebenarnya dan bertanggung jawab penuh untuk dipergunakan oleh pihak yang bersangkutan secara bijaksana.
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
                  <strong>Catatan Cetak</strong>: Jika Anda mencetak dari peramban (browser), centang pilihan <strong>"Background Graphics"</strong> pada pengaturan cetak agar stempel digital berwarna tetap terlihat dengan jelas.
                </p>
              </div>

              <div className="flex justify-end print:hidden">
                <button
                  onClick={closeLetterPreview}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" /> Tutup Preview
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
