import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, X } from 'lucide-react';
import { LetterRequest } from '../../types';

interface ApplyLetterFormProps {
  onClose: () => void;
  onSubmitRequest: (req: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => void;
}

export default function ApplyLetterForm({
  onClose,
  onSubmitRequest,
}: ApplyLetterFormProps) {
  // Form State
  const [form, setForm] = useState({
    applicantName: '',
    nik: '',
    kk: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    phone: '',
    religion: 'Islam',
    profession: '',
    address: '',
    purpose: '',
  });

  const updateForm = (updates: Partial<typeof form>) => setForm((p) => ({ ...p, ...updates }));

  const {
    applicantName, nik, kk, birthPlace, birthDate,
    gender, phone, religion, profession, address, purpose
  } = form;

  // NIK/KK helper text limiters
  const handleDigitsOnly = (key: keyof typeof form, val: string) => {
    updateForm({ [key]: val.replace(/\D/g, '') });
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
    if (
      !applicantName.trim() ||
      !birthPlace.trim() ||
      !birthDate ||
      !phone.trim() ||
      !address.trim() ||
      !purpose.trim()
    ) {
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

    alert('Permohonan Surat Pengantar Domisili Anda berhasil dikirim ke pengurus RT!');
    onClose();
  };

  return (
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
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/40 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
              onChange={(e) => updateForm({ applicantName: e.target.value })}
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
                onChange={(e) => handleDigitsOnly('nik', e.target.value)}
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
                onChange={(e) => handleDigitsOnly('kk', e.target.value)}
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
              onChange={(e) => updateForm({ birthPlace: e.target.value })}
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
              onChange={(e) => updateForm({ birthDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateForm({ gender: 'Laki-laki' })}
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
                onClick={() => updateForm({ gender: 'Perempuan' })}
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
              onChange={(e) => updateForm({ religion: e.target.value })}
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
              onChange={(e) => updateForm({ profession: e.target.value })}
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
              onChange={(e) => updateForm({ phone: e.target.value })}
              placeholder="Contoh: 0812XXXXXXXX"
              className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-blue-700 border-l-4 border-blue-600 pl-2 pt-2">
          Keperluan & Alamat RT 002
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal di RT 002</label>
            <textarea
              required
              value={address}
              onChange={(e) => updateForm({ address: e.target.value })}
              placeholder="Contoh: Jl. Cibatu Raya No. 10..."
              className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
            />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Keperluan / Tujuan Pengajuan Surat</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => updateForm({ purpose: e.target.value })}
              placeholder="Contoh: Persyaratan Pengurusan Rekening Bank / Melamar Kerja / BPJS"
              className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/40">
          <button
            type="button"
            onClick={onClose}
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
  );
}
