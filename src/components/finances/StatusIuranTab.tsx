import React, { useState } from 'react';
import { Search, Info, Plus, X } from 'lucide-react';
import { CitizenDues } from '../../types';
import { useStatusIuran } from '../../hooks/useStatusIuran';

interface StatusIuranTabProps {
  citizensDues: CitizenDues[];
  onPayDuesClick: (citizen: CitizenDues) => void;
  onAddCitizen?: (name: string, houseNumber: string) => void;
  selectedRT: string;
  selectedRW: string;
  isWarga?: boolean;
  isAdmin?: boolean;
}

export default function StatusIuranTab({
  citizensDues,
  onPayDuesClick,
  onAddCitizen,
  selectedRT,
  selectedRW,
  isWarga,
  isAdmin,
}: StatusIuranTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCitizenName, setNewCitizenName] = useState('');
  const [newHouseNumber, setNewHouseNumber] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddCitizen && newCitizenName && newHouseNumber) {
      onAddCitizen(newCitizenName, newHouseNumber);
      setShowAddModal(false);
      setNewCitizenName('');
      setNewHouseNumber('');
    }
  };

  const {
    duesSearch,
    setDuesSearch,
    months,
    filteredCitizensDues,
  } = useStatusIuran({ citizensDues, selectedRT, selectedRW });

  return (
    <div className="space-y-6">
      {/* Information banner on monthly dues */}
      <div className="bg-rose-500/10 border border-rose-300/40 p-5 rounded-[1.8rem] flex items-start gap-3 backdrop-blur-md">
        <Info className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans">
          <h4 className="font-extrabold text-slate-800 text-sm">Ketentuan Iuran RT 002</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap warga Kepala Keluarga di lingkungan RT 002 RW 16 diwajibkan menyetor iuran lingkungan sebesar <strong>Rp 35.000 / Bulan</strong> untuk pembiayaan kebersihan (truk sampah), jasa keamanan malam, santunan sosial kematian warga, dan pembinaan olahraga. Pengelola RT mendokumentasikan setiap setoran secara tertulis dan digital demi nilai integritas bersama.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base font-sans">Cek Status & Ajukan Pembayaran</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">Cari berdasarkan nama Kepala Keluarga atau nomor blok rumah Anda.</p>
          </div>

          {/* Dues search field & Add Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
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
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 whitespace-nowrap shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Warga
              </button>
            )}
          </div>
        </div>

        {/* Modal Tambah Warga */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-800 text-sm">Tambah Warga Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Nama Kepala Keluarga</label>
                  <input
                    type="text"
                    required
                    value={newCitizenName}
                    onChange={(e) => setNewCitizenName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Nomor Blok / Rumah</label>
                  <input
                    type="text"
                    required
                    value={newHouseNumber}
                    onChange={(e) => setNewHouseNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Blok C/05"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-xs font-bold transition-colors cursor-pointer shadow-md">
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Matrix of status */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/30 text-[11px] font-mono text-slate-400 text-left">
                <th className="py-2.5 font-bold">KEPALA KELUARGA / BLOK</th>
                {months.slice(0, 6).map((m) => (
                  <th key={m} className="py-2.5 font-bold text-center uppercase">{m.substring(0, 3)}</th>
                ))}
                {(isAdmin || isWarga) && <th className="py-2.5 font-bold text-center">TINDAKAN</th>}
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
                      {(isAdmin || isWarga) && (
                        <td className="py-3 text-center">
                          <button
                            onClick={() => onPayDuesClick(citizen)}
                            className="px-3 py-1.5 bg-blue-50/70 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                          >
                            Bayar Iuran
                          </button>
                        </td>
                      )}
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
  );
}
