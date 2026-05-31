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

    const checkExpiry = () => {
      const loginTime = new Date(currentUser.loginTime).getTime();
      if (!loginTime || Date.now() - loginTime > ADMIN_SESSION_MAX_AGE_MS) {
        handleLogout();
      }
    };

    const intervalId = window.setInterval(checkExpiry, 60 * 1000);
    checkExpiry();

    return () => window.clearInterval(intervalId);
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
