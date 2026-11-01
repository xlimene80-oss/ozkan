/**
 * API Temel URL Konfigürasyonu (Netlify Serverless Mimarisi)
 * 1. Tarayıcıda elle girilmiş özel backend adresi (localStorage: 13sigorta_custom_api_url) varsa önceliklidir.
 * 2. Ortam değişkeni (import.meta.env.VITE_API_URL) tanımlıysa onu kullanır.
 * 3. Varsayılan olarak aynı origin'deki '/api' (Netlify Functions) kullanılır.
 */

export const DEFAULT_API_URL = '/api';

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

  // 2. Ortam değişkeni açıkça tanımlanmışsa (örn: ayrı bir Netlify API sitesi)
  const rawApiUrl = import.meta.env.VITE_API_URL;
  if (rawApiUrl && rawApiUrl.trim() !== '') {
    return rawApiUrl.trim().replace(/\/+$/, '');
  }

  // 3. Varsayılan Netlify API rotası
  return DEFAULT_API_URL;
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
        'Backend API servisine ulaşılamadı. Lütfen Netlify Functions servisinin aktif olduğundan emin olunuz.'
      );
    }
    throw new Error(`Beklenmeyen sunucu yanıtı (${res.status} ${res.statusText})`);
  }
  return res.json();
}
