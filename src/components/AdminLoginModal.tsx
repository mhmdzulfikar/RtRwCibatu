import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  X,
  UserRound,
  KeyRound,
  Lock,
  LogIn
} from 'lucide-react';
import { AuthenticatedUser } from '../types';
import { setStoredSession } from '../security';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (user: AuthenticatedUser) => void;
}

export default function AdminLoginModal({
  onClose,
  onLogin
}: AdminLoginModalProps) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    loginError: '',
  });

  const updateForm = (updates: Partial<typeof form>) => setForm((p) => ({ ...p, ...updates }));

  const { username, password, loginError } = form;

  const [isLoading, setIsLoading] = useState(false);

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
            <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-300/40">
              <Shield className="h-5 w-5" />
            </div>
            <p className="text-xs font-mono font-extrabold text-blue-700 uppercase tracking-wider mt-5">
              Login Pengurus
            </p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Area admin RT 005
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Warga dapat memakai portal tanpa login. Kredensial ini khusus pengurus untuk mengelola data dan verifikasi.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Username Admin</label>
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
                  type="password"
                  value={password}
                  onChange={(e) => updateForm({ password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-200/60 px-4 py-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {loginError}
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
              <LogIn className="h-4 w-4" /> {isLoading ? 'Memeriksa...' : 'Masuk Sebagai Admin'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
