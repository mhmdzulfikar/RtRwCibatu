import { AuthenticatedUser } from './types';

export const ADMIN_SESSION_MAX_AGE_MS = 30 * 60 * 1000;
export const AUTH_STORAGE_KEY = 'rt005_auth_session';

export const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || '',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '',
  displayName: 'Pengurus RT 005'
};

export const isAdminAuthConfigured =
  ADMIN_CREDENTIALS.username.trim().length >= 6 &&
  ADMIN_CREDENTIALS.password.length >= 12 &&
  !ADMIN_CREDENTIALS.username.toLowerCase().includes('change-this') &&
  !ADMIN_CREDENTIALS.password.toUpperCase().includes('CHANGE_ME');

export const createSessionToken = () => {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const buildAdminSession = (username: string): AuthenticatedUser => ({
  username,
  displayName: ADMIN_CREDENTIALS.displayName,
  role: 'admin',
  loginTime: new Date().toISOString(),
  sessionToken: createSessionToken()
});

export const readStoredSession = (): AuthenticatedUser | null => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<AuthenticatedUser>;
    const loginTime = parsed.loginTime ? new Date(parsed.loginTime).getTime() : 0;
    const isExpired = !loginTime || Date.now() - loginTime > ADMIN_SESSION_MAX_AGE_MS;

    if (!isAdminAuthConfigured || isExpired) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (parsed.role !== 'admin') return null;
    if (!parsed.username || parsed.username !== ADMIN_CREDENTIALS.username) return null;
    if (!parsed.sessionToken || parsed.sessionToken.length < 64) return null;

    return {
      username: parsed.username,
      displayName: ADMIN_CREDENTIALS.displayName,
      role: 'admin',
      loginTime: parsed.loginTime || new Date().toISOString(),
      sessionToken: parsed.sessionToken
    };
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

