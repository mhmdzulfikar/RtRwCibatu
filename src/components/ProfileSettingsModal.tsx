import { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserRound, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ProfileSettingsModalProps {
  onClose: () => void;
  onUpdate: (data: any) => Promise<{ success: boolean; error?: string }>;
  currentUser: { username: string; displayName: string; role: string };
}

export default function ProfileSettingsModal({ onClose, onUpdate, currentUser }: ProfileSettingsModalProps) {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await onUpdate({ displayName, password, newPassword, newUsername });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 1500);
      } else {
        setError(res.error || 'Gagal mengubah profil.');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">Pengaturan Profil</h3>
            <p className="text-xs text-slate-400">Ubah nama atau ganti password</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Profil berhasil diperbarui!
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Username <span className="text-slate-400 font-normal text-xs">(Untuk Login)</span></label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nama Tampilan <span className="text-slate-400 font-normal text-xs">(Terlihat oleh publik)</span></label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password Lama <span className="text-slate-400 font-normal text-xs">(Isi jika ingin ganti password)</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-11 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-11 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading && <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
