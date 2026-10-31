/**
 * Güvenli Storage Wrapper (Private mode veya devre dışı storage durumunda çökmez)
 */
export function safeGetSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function safeSetSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    // Sessizce atla
  }
}

export function safeGetLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function safeSetLocal(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Sessizce atla
  }
}
