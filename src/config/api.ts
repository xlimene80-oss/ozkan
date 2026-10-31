/**
 * API Temel URL Konfigürasyonu
 * 1. Tarayıcıda elle girilmiş özel backend adresi (localStorage: 13sigorta_custom_api_url) varsa önceliklidir.
 * 2. Ortam değişkeni (import.meta.env.VITE_API_URL) tanımlıysa onu kullanır.
 * 3. Geliştirme (development) ortamında Vite dev server proxy'si için '/api' kullanılır.
 * 4. Canlı / Production ortamında (Netlify) mutlak bir VITE_API_URL tanımlanmamışsa
 *    asıl canlı backend (Render) URL'ine yönlendirilir.
 */

export const DEFAULT_RENDER_API_URL = 'https://sigorta-api.onrender.com/api';

export function getApiBaseUrl(): string {
  // 1. Tarayıcıda kullanıcı tarafından girilmiş özel API adresi
  if (typeof window !== 'undefined') {
    try {
      const custom = localStorage.getItem('13sigorta_custom_api_url');
      if (custom && custom.trim() !== '') {
        return custom.trim().replace(/\/+$/, '');
      }
    } catch {
      // LocalStorage erişim engeli varsa yoksay
    }
  }

  // 2. Ortam değişkeni açıkça tanımlanmışsa
  const rawApiUrl = import.meta.env.VITE_API_URL;
  if (rawApiUrl && rawApiUrl.trim() !== '') {
    return rawApiUrl.trim().replace(/\/+$/, '');
  }

  // 3. Yerel geliştirme ortamında Vite proxy'sini (/api -> http://localhost:5000) kullan
  if (import.meta.env.DEV) {
    return '/api';
  }

  // 4. Canlı Netlify ortamında varsayılan Render URL'ini kullan
  return DEFAULT_RENDER_API_URL;
}

export const API_BASE_URL: string = getApiBaseUrl();

/**
 * Güvenli JSON Yanıt Ayrıştırıcı:
 * Eğer sunucu HTML veya 404 dönerse "Unexpected token <" SyntaxError yerine
 * kullanıcı dostu anlaşılır bir hata mesajı üretir.
 */
export async function parseJsonResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error(
        'Backend sunucusuna ulaşılamadı (HTML yanıtı alındı). Lütfen API sunucusunun (Render) ayakta olduğundan veya VITE_API_URL ayarından emin olunuz.'
      );
    }
    throw new Error(`Beklenmeyen sunucu yanıtı (${res.status} ${res.statusText})`);
  }
  return res.json();
}
