/**
 * API Temel URL Konfigürasyonu
 * 1. Eğer import.meta.env.VITE_API_URL ortam değişkeni tanımlıysa öncelikli olarak kullanılır.
 * 2. Geliştirme (development) ortamında Vite dev server proxy'si için '/api' kullanılır.
 * 3. Canlı / Production ortamında (Netlify) mutlak bir VITE_API_URL tanımlanmamışsa
 *    isteklerin HTML sayfasına çarpmasını önlemek için asıl canlı backend (Render) URL'ine yönlendirilir.
 */

// Canlı Render Backend API Adresi (Varsayılan Fallback)
export const RENDER_BACKEND_URL = 'https://sigorta-api.onrender.com/api';

const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL: string = (() => {
  // Ortam değişkeni açıkça girilmişse onu kullan
  if (rawApiUrl && rawApiUrl.trim() !== '') {
    return rawApiUrl.trim().replace(/\/+$/, '');
  }

  // Yerel geliştirme ortamında Vite proxy'sini (/api -> http://localhost:5000) kullan
  if (import.meta.env.DEV) {
    return '/api';
  }

  // Canlı Netlify ortamında mutlak Render URL'ini kullan
  return RENDER_BACKEND_URL;
})();

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
