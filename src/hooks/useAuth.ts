import { useState, useEffect } from 'react';
import { AuthenticatedUser } from '../types';
import { AUTH_STORAGE_KEY, readStoredSession, ADMIN_SESSION_MAX_AGE_MS } from '../security';

export function useAuth(setActiveTab: (tab: string) => void) {
  const [authState, setAuthState] = useState(() => ({
    currentUser: readStoredSession(),
    showLoginModal: false,
  }));

  const updateAuthState = (updates: Partial<typeof authState>) => setAuthState((p) => ({ ...p, ...updates }));

  const { currentUser, showLoginModal } = authState;
  const isAdmin = currentUser?.role === 'admin';
  const isWarga = currentUser?.role === 'warga';

  const handleLogin = (user: AuthenticatedUser) => {
    updateAuthState({ currentUser: user });
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    updateAuthState({ showLoginModal: false });
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    updateAuthState({ currentUser: null });
    updateAuthState({ showLoginModal: false });
    setActiveTab('beranda');
  };

  useEffect(() => {
    if (!currentUser) return;

    let lastActivityTime = Date.now();

    // Fungsi untuk me-reset timer aktivitas saat user bergerak/ngetik
    const updateActivity = () => {
      lastActivityTime = Date.now();
    };

    // Daftarkan event listener untuk mendeteksi pergerakan
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const checkExpiry = () => {
      // Cek apakah waktu sekarang dikurangi aktivitas terakhir melebihi 30 menit
      if (Date.now() - lastActivityTime > ADMIN_SESSION_MAX_AGE_MS) {
        handleLogout();
        alert('Sesi telah berakhir karena tidak ada aktivitas (idle). Silakan login kembali.');
      }
    };

    // Cek setiap 60 detik
    const intervalId = window.setInterval(checkExpiry, 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [currentUser]);

  const requireAdminAccess = () => {
    if (isAdmin) return true;
    alert('Akses admin ditolak. Silakan login sebagai pengurus RT.');
    return false;
  };

  const requireWargaAccess = () => {
    if (isAdmin || isWarga) return true;
    alert('Akses ditolak. Silakan login sebagai Warga atau Pengurus RT.');
    return false;
  };

  return {
    authState,
    updateAuthState,
    isAdmin,
    isWarga,
    handleLogin,
    handleLogout,
    requireAdminAccess,
    requireWargaAccess
  };
}
