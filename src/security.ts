export const ADMIN_SESSION_MAX_AGE_MS = 30 * 60 * 1000;

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

export const createSessionToken = () => {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
