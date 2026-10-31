/**
 * API Temel URL Konfigürasyonu
 * Production ortamında VITE_API_URL ortam değişkeninden okunur;
 * tanımlı değilse veya yerelde aynı origin'deki '/api' yolu kullanılır.
 */
const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL: string = (rawApiUrl && rawApiUrl.trim() !== '')
  ? rawApiUrl.trim().replace(/\/+$/, '')
  : '/api';
