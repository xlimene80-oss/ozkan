import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Ziyaretçinin IP adresini tuzlu hash'e dönüştürür.
 * Asla ham IP adresi veritabanında veya loglarda saklanmaz.
 */
export function hashIp(ip: string | undefined): string {
  const safeIp = (ip || '127.0.0.1').trim();
  return crypto
    .createHmac('sha256', env.IP_HASH_SALT)
    .update(safeIp)
    .digest('hex');
}

/**
 * Zamanlama saldırılarına (timing attack) karşı güvenli şifre karşılaştırması
 */
export function timingSafeCompare(input: string, target: string): boolean {
  const inputBuffer = Buffer.from(input, 'utf-8');
  const targetBuffer = Buffer.from(target, 'utf-8');

  if (inputBuffer.length !== targetBuffer.length) {
    // Sabit zamanlı sahte karşılaştırma yaparak erken çıkışı önler
    crypto.timingSafeEqual(targetBuffer, targetBuffer);
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

/**
 * Girdi metinlerini temizler ve maksimum uzunluğa sınırlar
 */
export function sanitizeString(val: unknown, maxLength = 255): string {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .replace(/[<>]/g, '') // Basit HTML tag enjeksiyonunu temizle
    .substring(0, maxLength);
}

/**
 * HTML Kaçış Fonksiyonu (XSS Önleme):
 * E-posta gövdesi gibi HTML render edilen alanlarda kullanıcı girdilerini güvenli hale getirir.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Telefon Numarasını Maskeleme (PII ve Log Güvenliği):
 * Loglarda ve hata mesajlarında alıcı telefon numaralarını maskeler (örn: 90532***1234).
 */
export function maskPhoneNumber(phone: unknown): string {
  if (!phone || typeof phone !== 'string') return '***';
  const clean = phone.replace(/\D/g, '');
  if (clean.length <= 6) return '***' + clean.slice(-2);
  return clean.slice(0, clean.length - 7) + '***' + clean.slice(-4);
}

/**
 * CSV Formül Enjeksiyonu (Formula/DDE Injection) Koruması:
 * Hücre =, +, -, @, \t veya \r karakterleriyle başlıyorsa başına tek tırnak (') ekler.
 * Ayrıca virgül, çift tırnak veya satır sonu içeren hücreleri standart CSV çift tırnaklarıyla çevreler.
 */
export function sanitizeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '';
  let str = String(cell);
  // Zararlı formül tetikleyici karakterlerle başlıyorsa tek tırnakla nötrleştir
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  // Virgül, çift tırnak veya yeni satır varsa RFC 4180'e göre çift tırnak içine al
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
