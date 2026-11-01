/**
 * 13 Sigorta - API Temel URL Konfigürasyonu (Netlify Serverless Mimarisi)
 * Ön yüz (Frontend) ve Sunucusuz Fonksiyonlar (API Functions) aynı çatı altında,
 * doğrudan Netlify Serverless Functions (/api/* -> /.netlify/functions/api) üzerinden çalışır.
 */

// Eski tarayıcı önbelleklerinde kalmış özel veya harici URL tanımlarını temizle
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('13sigorta_custom_api_url');
  } catch {
    // Erişim kısıtlaması varsa yoksay
  }
}

// İstemci doğrudan kendi origin'indeki /api uç noktasına istek atar
export const DEFAULT_API_URL = '/api';

export function getApiBaseUrl(): string {
  return DEFAULT_API_URL;
}

export const API_BASE_URL: string = DEFAULT_API_URL;

/**
 * Güvenli JSON Yanıt Ayrıştırıcı:
 * Eğer sunucu HTML veya 404 dönerse "Unexpected token <" SyntaxError yerine
 * kullanıcı dostu anlaşılır bir Türkçe hata mesajı üretir.
 */
export async function parseJsonResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error(
        'Sistem API servisine bağlanılamadı. Lütfen Netlify Functions servisinin aktif olduğunu doğrulayınız.'
      );
    }
    throw new Error(`Beklenmeyen sunucu yanıtı (${res.status} ${res.statusText})`);
  }
  return res.json();
}
