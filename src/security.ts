import { AuthenticatedUser } from './types';

export const AUTH_STORAGE_KEY = 'RT 002_auth_session';
export const ADMIN_SESSION_MAX_AGE_MS = 30 * 60 * 1000;

export const getAuthToken = (): string | null => {
  const session = readStoredSession();
  return session ? session.sessionToken : null;
};

export const setStoredSession = (user: AuthenticatedUser) => {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredSession = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const readStoredSession = (): AuthenticatedUser | null => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<AuthenticatedUser>;

    if (parsed.role !== 'admin' && parsed.role !== 'warga') return null;
    if (!parsed.username) return null;
    if (!parsed.sessionToken) return null;

    const activeSession: AuthenticatedUser = {
      username: parsed.username,
      displayName: parsed.displayName || (parsed.role === 'admin' ? 'Pengurus RT' : 'Warga'),
      role: parsed.role,
      loginTime: parsed.loginTime || new Date().toISOString(),
      sessionToken: parsed.sessionToken
    };

    return activeSession;

  } catch (error) {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const isSafeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const maskSensitiveNumber = (value: string, visibleStart = 4, visibleEnd = 4) => {
  if (value.length <= visibleStart + visibleEnd) return value;
  return `${value.slice(0, visibleStart)}${'*'.repeat(value.length - visibleStart - visibleEnd)}${value.slice(-visibleEnd)}`;
};

