import { siteConfig } from '../config/site.js';

/**
 * Cihazın mobil olup olmadığını tespit eder.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Modern Client Hints API
  const nav = window.navigator as any;
  if (nav?.userAgentData?.mobile !== undefined) {
    return Boolean(nav.userAgentData.mobile);
  }

  // User Agent yedek kontrolü
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

/**
 * WhatsApp numarası temizleyicisi: sadece rakamlar, baştaki + ve boşlukları kaldırır
 */
export function sanitizeWhatsAppNumber(rawNumber: string): string {
  const digitsOnly = (rawNumber || '').replace(/\D/g, '');
  if (digitsOnly.startsWith('0090')) {
    return digitsOnly.substring(2);
  }
  if (digitsOnly.startsWith('05')) {
    return '90' + digitsOnly.substring(1);
  }
  if (digitsOnly.startsWith('5') && digitsOnly.length === 10) {
    return '90' + digitsOnly;
  }
  return digitsOnly;
}

export interface WhatsAppLinks {
  primaryUrl: string;
  primaryLabel: string;
  directAppUrl: string; // wa.me doğrudan link
  isMobile: boolean;
}

/**
 * WhatsApp linki oluşturucu
 * Metin en fazla 1500 karaktere kısaltılır ve encodeURIComponent ile kodlanır.
 */
export function buildWhatsAppLink(number?: string, text?: string): WhatsAppLinks {
  const targetNumber = sanitizeWhatsAppNumber(number || siteConfig.whatsappNumarasi);
  const safeText = (text || '').substring(0, 1500);
  const encodedText = encodeURIComponent(safeText);

  const isMobile = isMobileDevice();

  const directAppUrl = `https://wa.me/${targetNumber}?text=${encodedText}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${targetNumber}&text=${encodedText}`;

  return {
    primaryUrl: isMobile ? directAppUrl : webUrl,
    primaryLabel: isMobile ? "WhatsApp'ta yaz" : "WhatsApp Web'de yaz",
    directAppUrl,
    isMobile,
  };
}

/**
 * Form verilerinden kişisel bilgilerle hazır WhatsApp mesaj metni üretir.
 * Yalnızca formda girilen bilgiler yer alır. Not en fazla 300 karaktere kısaltılır.
 */
export function generateLeadWhatsAppMessage(params: {
  productTitle: string;
  name: string;
  phone: string;
  note?: string;
}): string {
  const shortNote = params.note ? params.note.trim().substring(0, 300) : '';
  const notePart = shortNote ? ` Not: ${shortNote}` : '';

  return `Merhaba, ${siteConfig.acenteKisaAd} web sitesinden yazıyorum. Ürün: ${params.productTitle}. Ad Soyad: ${params.name}. Telefon: ${params.phone}.${notePart}`;
}

/**
 * Footer ve İletişim sayfası için kişisel veri içermeyen genel mesaj
 */
export function generateGeneralWhatsAppMessage(): string {
  return `Merhaba, ${siteConfig.acenteKisaAd} web sitenizden yazıyorum.`;
}
