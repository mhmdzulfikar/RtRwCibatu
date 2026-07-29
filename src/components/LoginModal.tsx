import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  X,
  UserRound,
  KeyRound,
  Lock,
  LogIn,
  Home,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { AuthenticatedUser } from '../types';
import { setStoredSession } from '../security';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: AuthenticatedUser) => void;
  onRecoverAdminPassword?: (recoveryKey: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export default function LoginModal({
  onClose,
  onLogin,
  onRecoverAdminPassword
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'warga' | 'admin' | 'recovery'>('warga');
  
  const [form, setForm] = useState({
    username: '',
    password: '',
    loginError: '',
    recoveryKey: '',
    newPassword: '',
    recoveryMessage: { type: '', text: '' }
  });

  const updateForm = (updates: Partial<typeof form>) => setForm((p) => ({ ...p, ...updates }));

  const { username, password, loginError, recoveryKey, newPassword, recoveryMessage } = form;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    updateForm({ loginError: '' });

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        updateForm({ loginError: data.error || 'Gagal login. Periksa username dan password.' });
        return;
      }
      
      if (data.user.role !== activeTab) {
        updateForm({ loginError: `Role akun tidak sesuai. Anda mencoba masuk ke tab ${activeTab} menggunakan kredensial ${data.user.role}.`});
        return;
      }

      const activeSession: AuthenticatedUser = {
        username: data.user.username,
        displayName: data.user.displayName,
        role: data.user.role,
        loginTime: new Date().toISOString(),
        sessionToken: data.token
      };

      setStoredSession(activeSession);
      onLogin(activeSession);
      
    } catch (error) {
      updateForm({ loginError: 'Gagal terhubung ke server. Pastikan backend berjalan.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (event: FormEvent) => {
    event.preventDefault();
    if (!onRecoverAdminPassword) return;

    setIsLoading(true);
    updateForm({ recoveryMessage: { type: '', text: '' } });

    try {
      const res = await onRecoverAdminPassword(recoveryKey, newPassword);
      if (res.success) {
        updateForm({ 
          recoveryMessage: { type: 'success', text: res.message || 'Password berhasil dipulihkan.' },
          recoveryKey: '',
          newPassword: ''
        });
        setTimeout(() => {
          setActiveTab('admin');
          updateForm({ recoveryMessage: { type: '', text: '' } });
        }, 3000);
      } else {
        updateForm({ recoveryMessage: { type: 'error', text: res.error || 'Gagal memulihkan password.' } });
      }
    } catch (error) {
      updateForm({ recoveryMessage: { type: 'error', text: 'Terjadi kesalahan jaringan.' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-md flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className="w-full max-w-md glass-panel rounded-[2rem] p-6 md:p-7 shadow-2xl border border-white/70 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/40 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <div className="pr-8">
            <div className={`h-11 w-11 rounded-2xl text-white flex items-center justify-center shadow-lg ${activeTab === 'warga' ? 'bg-blue-600 shadow-blue-300/40' : activeTab === 'admin' ? 'bg-slate-900 shadow-slate-300/40' : 'bg-red-600 shadow-red-300/40'}`}>
              {activeTab === 'warga' ? <Home className="h-5 w-5" /> : activeTab === 'admin' ? <Shield className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
            </div>
            <p className={`text-xs font-mono font-extrabold uppercase tracking-wider mt-5 ${activeTab === 'warga' ? 'text-blue-700' : activeTab === 'admin' ? 'text-slate-700' : 'text-red-700'}`}>
              {activeTab === 'warga' ? 'Login Warga' : activeTab === 'admin' ? 'Login Pengurus' : 'Pemulihan Admin'}
            </p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {activeTab === 'recovery' ? 'Reset Password' : 'Portal RT 002'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              {activeTab === 'warga' 
                ? 'Masuk sebagai warga untuk mengakses layanan surat dan iuran. (Gunakan: warga / warga123)' 
                : activeTab === 'admin'
                  ? 'Kredensial ini khusus pengurus untuk mengelola data dan verifikasi.'
                  : 'Masukkan Kode Rahasia RT untuk mereset password akun Admin.'}
            </p>
          </div>

          {activeTab !== 'recovery' && (
            <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
              <button
                type="button"
                onClick={() => { setActiveTab('warga'); updateForm({ loginError: '', password: '', username: '' }); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'warga'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Warga
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('admin'); updateForm({ loginError: '', password: '', username: '' }); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pengurus RT
              </button>
            </div>
          )}

          {activeTab === 'recovery' ? (
            <form onSubmit={handleRecover} className="space-y-4">
              {recoveryMessage.text && (
                <div className={`rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 ${recoveryMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
                  {recoveryMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {recoveryMessage.text}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kode Rahasia RT</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={recoveryKey}
                    onChange={(e) => updateForm({ recoveryKey: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="Masukkan kode rahasia..."
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showRecoveryPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => updateForm({ newPassword: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="Minimal 6 karakter"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showRecoveryPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('admin'); updateForm({ recoveryMessage: { type: '', text: '' } }); }}
                  className="px-4 py-3 rounded-xl font-extrabold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                  disabled={isLoading}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 transition-all inline-flex items-center justify-center gap-2"
                >
                  {isLoading && <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                  Pulihkan Password
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Username</label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => updateForm({ username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  autoComplete="username"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => updateForm({ password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none disabled:opacity-50 cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-200/60 px-4 py-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {loginError}
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setActiveTab('recovery'); updateForm({ loginError: '', password: '', username: '' }); }}
                  className="text-[11px] font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  Lupa Password Admin?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-5 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 ${
                !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <LogIn className="h-4 w-4" /> {isLoading ? 'Memeriksa...' : `Masuk Sebagai ${activeTab === 'warga' ? 'Warga' : 'Admin'}`}
            </button>
          </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
