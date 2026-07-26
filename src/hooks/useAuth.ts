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

  const handleUpdateProfile = async (data: any) => {
    if (!currentUser || !currentUser.sessionToken) return { success: false, error: 'Belum login' };
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.sessionToken}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        const updatedUser = { 
          ...currentUser, 
          displayName: result.user.displayName,
          username: result.user.username
        };
        if (result.token) {
          updatedUser.sessionToken = result.token;
        }
        handleLogin(updatedUser);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Gagal mengubah profil' };
      }
    } catch (e) {
      return { success: false, error: 'Gagal koneksi ke server' };
    }
  };

  const handleResetWargaPassword = async (targetUsername: string, newPassword: string) => {
    if (!isAdmin || !currentUser?.sessionToken) return { success: false, error: 'Akses ditolak' };
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin/reset-warga', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.sessionToken}`
        },
        body: JSON.stringify({ targetUsername, newPassword })
      });
      const result = await response.json();
      if (response.ok) return { success: true };
      return { success: false, error: result.error || 'Gagal mereset password' };
    } catch (e) {
      return { success: false, error: 'Gagal koneksi ke server' };
    }
  };

  const handleCreateWargaAccount = async (displayName: string, username: string, password: string) => {
    if (!isAdmin || !currentUser?.sessionToken) return { success: false, error: 'Akses ditolak' };
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin/create-warga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.sessionToken}`
        },
        body: JSON.stringify({ displayName, username, password })
      });
      const result = await response.json();
      if (response.ok) return { success: true, message: result.message };
      return { success: false, error: result.error || 'Gagal membuat akun warga' };
    } catch (e) {
      return { success: false, error: 'Gagal koneksi ke server' };
    }
  };

  const handleRecoverAdminPassword = async (recoveryKey: string, newPassword: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recoveryKey, newPassword })
      });
      const result = await response.json();
      if (response.ok) return { success: true, message: result.message };
      return { success: false, error: result.error || 'Gagal memulihkan password' };
    } catch (e) {
      return { success: false, error: 'Gagal koneksi ke server' };
    }
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
    handleUpdateProfile,
    handleResetWargaPassword,
    handleCreateWargaAccount,
    handleRecoverAdminPassword,
    requireAdminAccess,
    requireWargaAccess
  };
}
