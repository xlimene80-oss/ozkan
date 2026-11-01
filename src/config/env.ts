import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını hem server klasöründen hem kök dizinden arayarak yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const DEFAULT_DEV_SALT = 'default-salt-value-for-dev-min-32-chars-long!';
const DEFAULT_DEV_ADMIN_PASS = '13Sigortaozkanliozkan';
const DEFAULT_DEV_JWT_SECRET = '4bfc786fb92c7e38a8ac94cd29352f92de8747635418dd87dedb966e7d312e82';

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || '',
  IP_HASH_SALT: process.env.IP_HASH_SALT || DEFAULT_DEV_SALT,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || DEFAULT_DEV_ADMIN_PASS,
  ADMIN_TOKEN_SECRET: process.env.ADMIN_TOKEN_SECRET || process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET,
  JWT_SECRET: process.env.ADMIN_TOKEN_SECRET || process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET,
  LEAD_RETENTION_DAYS: parseInt(process.env.LEAD_RETENTION_DAYS || '365', 10),
  LEAD_NOTIFY_MODE: (process.env.LEAD_NOTIFY_MODE || 'log').split(',').map((s) => s.trim()),

  // E-posta
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  EMAIL_FROM: process.env.EMAIL_FROM || '13 Sigorta <bildirim@13sigorta.com>',
  NOTIFY_EMAIL_TO: process.env.NOTIFY_EMAIL_TO || '',

  // Meta WhatsApp Cloud API
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION || 'v21.0',
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_NOTIFY_TO: process.env.WHATSAPP_NOTIFY_TO || '',
  WHATSAPP_TEMPLATE_NAME: process.env.WHATSAPP_TEMPLATE_NAME || 'teklif_talebi_bildirimi',
  WHATSAPP_TEMPLATE_LANG: process.env.WHATSAPP_TEMPLATE_LANG || 'tr',
};

/**
 * Bildirim Kanallarının Yapılandırma Durumunu Denetler (Gizli değer içermez)
 */
export function isNotificationConfigured(testEnv = env): boolean {
  const modes = testEnv.LEAD_NOTIFY_MODE;
  if (!modes || !Array.isArray(modes) || modes.length === 0) return false;

  for (const mode of modes) {
    if (mode === 'log') continue;
    if (mode === 'email') {
      if (
        !testEnv.SMTP_HOST ||
        !testEnv.SMTP_PORT ||
        !testEnv.SMTP_USER ||
        !testEnv.SMTP_PASS ||
        !testEnv.NOTIFY_EMAIL_TO
      ) {
        return false;
      }
    } else if (mode === 'whatsapp_cloud') {
      if (
        !testEnv.WHATSAPP_TOKEN ||
        !testEnv.WHATSAPP_PHONE_NUMBER_ID ||
        !testEnv.WHATSAPP_NOTIFY_TO
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Açılışta LEAD_NOTIFY_MODE kanallarının eksik ortam değişkenlerini tespit eder ve uyarır.
 * Asla gizli değer loglamaz, yalnızca eksik değişken adlarını bildirir. Sunucuyu durdurmaz.
 */
export function checkNotificationEnvWarnings(testEnv = env): void {
  const modes = testEnv.LEAD_NOTIFY_MODE;
  if (!modes || !Array.isArray(modes)) return;
  const missing: Record<string, string[]> = {};

  for (const mode of modes) {
    if (mode === 'email') {
      const emailMissing: string[] = [];
      if (!testEnv.SMTP_HOST) emailMissing.push('SMTP_HOST');
      if (!testEnv.SMTP_USER) emailMissing.push('SMTP_USER');
      if (!testEnv.SMTP_PASS) emailMissing.push('SMTP_PASS');
      if (!testEnv.NOTIFY_EMAIL_TO) emailMissing.push('NOTIFY_EMAIL_TO');
      if (emailMissing.length > 0) missing['email'] = emailMissing;
    } else if (mode === 'whatsapp_cloud') {
      const waMissing: string[] = [];
      if (!testEnv.WHATSAPP_TOKEN) waMissing.push('WHATSAPP_TOKEN');
      if (!testEnv.WHATSAPP_PHONE_NUMBER_ID) waMissing.push('WHATSAPP_PHONE_NUMBER_ID');
      if (!testEnv.WHATSAPP_NOTIFY_TO) waMissing.push('WHATSAPP_NOTIFY_TO');
      if (waMissing.length > 0) missing['whatsapp_cloud'] = waMissing;
    }
  }

  for (const [channel, vars] of Object.entries(missing)) {
    console.warn(
      `[UYARI] '${channel}' bildirim kanalı için şu ortam değişkenleri eksik: ${vars.join(', ')}. Talep kaydı devam edecek ancak bildirimler skipped durumuna alınacaktır.`
    );
  }
}

/**
 * Production ortamı kritik kontrolleri:
 * NODE_ENV=production iken DATABASE_URL, güvenli IP_HASH_SALT, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET ve FRONTEND_URL eksikse sunucu ayağa kalkamaz.
 */
export function validateEnvironment(testEnv = env): void {
  if (testEnv.NODE_ENV === 'production') {
    if (!testEnv.DATABASE_URL || testEnv.DATABASE_URL.trim() === '') {
      throw new Error(
        '[KRİTİK HATA] Production ortamında DATABASE_URL tanımlı olmalıdır. Bellek içi mod prodüksiyonda kullanılamaz.'
      );
    }
    if (
      !testEnv.IP_HASH_SALT ||
      testEnv.IP_HASH_SALT === DEFAULT_DEV_SALT ||
      testEnv.IP_HASH_SALT.length < 32
    ) {
      throw new Error(
        '[KRİTİK HATA] Production ortamında en az 32 karakterlik güvenli ve benzersiz bir IP_HASH_SALT tanımlanmalıdır.'
      );
    }
    if (
      !testEnv.ADMIN_PASSWORD ||
      testEnv.ADMIN_PASSWORD.length < 12
    ) {
      throw new Error(
        '[KRİTİK HATA] Production ortamında en az 12 karakterlik güçlü bir ADMIN_PASSWORD tanımlanmalıdır.'
      );
    }
    if (
      !testEnv.ADMIN_TOKEN_SECRET ||
      testEnv.ADMIN_TOKEN_SECRET.length < 32
    ) {
      throw new Error(
        '[KRİTİK HATA] Production ortamında en az 32 karakterlik güvenli bir ADMIN_TOKEN_SECRET tanımlanmalıdır.'
      );
    }

    // FRONTEND_URL Kontrolü: production'da zorunludur, geçerli URL olmalı ve sonunda / olmamalıdır
    if (!testEnv.FRONTEND_URL || testEnv.FRONTEND_URL.trim() === '') {
      throw new Error(
        '[KRİTİK HATA] Production ortamında FRONTEND_URL tanımlı olmalıdır.'
      );
    }
    const cleanFrontend = testEnv.FRONTEND_URL.trim();
    if (!/^https?:\/\//i.test(cleanFrontend)) {
      throw new Error(
        '[KRİTİK HATA] FRONTEND_URL geçerli bir web adresi olmalıdır (http:// veya https:// ile başlamalıdır).'
      );
    }
    if (cleanFrontend.endsWith('/')) {
      throw new Error(
        '[KRİTİK HATA] FRONTEND_URL sonunda bölü işareti (/) bulunmamalıdır (örn: https://13sigorta.netlify.app).'
      );
    }
  }

  // Bildirim uyarılarını denetle
  checkNotificationEnvWarnings(testEnv);
}
