import { useState, useEffect } from 'react';
import { AuthenticatedUser } from '../types';
import { ADMIN_SESSION_MAX_AGE_MS, AUTH_STORAGE_KEY, readStoredSession } from '../security';

export function useAuth(setActiveTab: (tab: string) => void) {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => readStoredSession());
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const isAdmin = currentUser?.role === 'admin';

  const handleAdminLogin = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setShowAdminLogin(false);
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setShowAdminLogin(false);
    setActiveTab('beranda');
  };

  useEffect(() => {
    if (!currentUser) return;

    let lastActivityTime = Date.now();

    // Fungsi untuk me-reset timer aktivitas saat admin bergerak/ngetik
    const updateActivity = () => {
      lastActivityTime = Date.now();
      // Opsi: kita juga bisa update data di sessionStorage agar tersinkron di tab lain
      // tapi untuk single tab, variabel lastActivityTime sudah cukup.
    };

    // Daftarkan event listener untuk mendeteksi pergerakan admin
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const checkExpiry = () => {
      // Cek apakah waktu sekarang dikurangi aktivitas terakhir melebihi 30 menit
      if (Date.now() - lastActivityTime > ADMIN_SESSION_MAX_AGE_MS) {
        handleLogout();
        alert('Sesi admin telah berakhir karena tidak ada aktivitas (idle). Silakan login kembali.');
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

  return {
    currentUser,
    showAdminLogin,
    setShowAdminLogin,
    isAdmin,
    handleAdminLogin,
    handleLogout,
    requireAdminAccess
  };
}
