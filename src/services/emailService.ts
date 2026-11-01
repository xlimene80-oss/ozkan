import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { Lead } from '../types/lead.js';
import { escapeHtml } from '../utils/security.js';

export interface EmailSendResult {
  success: boolean;
  error?: string;
  skipped?: boolean;
}

/**
 * E-posta Bildirim Servisi:
 * Yeni teklif veya tekrar talepleri acente yetkilisine e-posta ile iletir.
 * XSS koruması için tüm kullanıcı girdileri HTML kaçışına tabi tutulur.
 * SMTP_PASS hiçbir koşulda loglanmaz veya hata mesajlarına dahil edilmez.
 */
export async function sendLeadEmail(
  lead: Lead,
  customEnv = env,
  customTransporter?: any
): Promise<EmailSendResult> {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
    NOTIFY_EMAIL_TO,
  } = customEnv;

  // Gerekli yapılandırma eksikse sunucuyu çökertmeden skipped durumuna al
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL_TO) {
    return {
      success: false,
      skipped: true,
      error: 'SMTP_CFG_MISSING',
    };
  }

  // Alıcı listesi (virgülle ayrılmış birden fazla adres desteklenir)
  const recipients = NOTIFY_EMAIL_TO.split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  if (recipients.length === 0) {
    return {
      success: false,
      skipped: true,
      error: 'SMTP_NO_RECIPIENTS',
    };
  }

  const isRepeat = lead.repeat_count > 1;
  const prefix = isRepeat ? `[TEKRAR TALEP #${lead.repeat_count}] ` : '';
  const subject = `${prefix}[Yeni Talep] ${lead.product_slug.toUpperCase()} - ${lead.name}`;

  // Düz metin gövde
  const plainText = [
    `13 SİGORTA - ${isRepeat ? 'TEKRAR TALEP' : 'YENİ TEKLİF TALEBİ'}`,
    `--------------------------------------------------`,
    `Tarih: ${lead.created_at || new Date().toISOString()}`,
    `Ürün: ${lead.product_slug}`,
    `Ad Soyad: ${lead.name}`,
    `Telefon: ${lead.phone}`,
    `E-posta: ${lead.email || '-'}`,
    `Tercih Edilen Arama Saati: ${lead.call_time || 'Fark etmez'}`,
    `Ek Bilgi: ${lead.product_extra || '-'}`,
    `Not: ${lead.note || '-'}`,
    `Kaynak Sayfa: ${lead.source_page || '-'}`,
    `Tekrar Sayısı: ${lead.repeat_count}`,
    `--------------------------------------------------`,
  ].join('\n');

  // XSS Korumalı Güvenli HTML Gövde
  const safeName = escapeHtml(lead.name);
  const safeProduct = escapeHtml(lead.product_slug);
  const safePhone = escapeHtml(lead.phone);
  const safeEmail = escapeHtml(lead.email || '-');
  const safeCallTime = escapeHtml(lead.call_time || 'Fark etmez');
  const safeExtra = escapeHtml(lead.product_extra || '-');
  const safeNote = escapeHtml(lead.note || '-');
  const safeSource = escapeHtml(lead.source_page || '-');
  const safeDate = escapeHtml(lead.created_at || new Date().toLocaleString('tr-TR'));

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(subject)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .badge-repeat { background: #fef3c7; color: #92400e; }
        .badge-new { background: #e0f2fe; color: #0369a1; }
        .row { display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .label { font-weight: 600; width: 180px; color: #64748b; font-size: 13px; }
        .val { flex: 1; font-size: 14px; color: #0f172a; word-break: break-word; }
        .phone-link { color: #0284c7; text-decoration: none; font-weight: 600; }
        .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge ${isRepeat ? 'badge-repeat' : 'badge-new'}">
            ${isRepeat ? `TEKRAR TALEP #${lead.repeat_count}` : 'YENİ TALEP'}
          </span>
          <h2 style="margin: 8px 0 0 0; font-size: 18px; color: #0f172a;">13 Sigorta Web Bildirimi</h2>
        </div>
        <div>
          <div class="row"><div class="label">Tarih</div><div class="val">${safeDate}</div></div>
          <div class="row"><div class="label">Ürün</div><div class="val"><strong>${safeProduct}</strong></div></div>
          <div class="row"><div class="label">Müşteri Adı</div><div class="val">${safeName}</div></div>
          <div class="row"><div class="label">Telefon</div><div class="val"><a class="phone-link" href="tel:${safePhone}">${safePhone}</a></div></div>
          <div class="row"><div class="label">E-posta</div><div class="val">${safeEmail}</div></div>
          <div class="row"><div class="label">Arama Saati</div><div class="val">${safeCallTime}</div></div>
          <div class="row"><div class="label">Ek Bilgi</div><div class="val">${safeExtra}</div></div>
          <div class="row"><div class="label">Müşteri Notu</div><div class="val">${safeNote}</div></div>
          <div class="row"><div class="label">Kaynak Sayfa</div><div class="val">${safeSource}</div></div>
        </div>
        <div class="footer">
          Bu bildirim 13 Sigorta Web Sitesi üzerinden otomatik olarak oluşturulmuştur.
        </div>
      </div>
    </body>
    </html>
  `.trim();

  try {
    // Nodemailer aktarıcı: 10 sn bağlantı ve soket zaman aşımı
    const transporter =
      customTransporter ||
      nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

    await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER,
      to: recipients.join(', '),
      subject,
      text: plainText,
      html: htmlBody,
    });

    return { success: true };
  } catch (err: any) {
    const errMsg = err?.message || '';
    let errorCode = 'SMTP_SEND_FAIL';

    if (err?.code === 'EAUTH' || /auth/i.test(errMsg)) {
      errorCode = 'SMTP_AUTH_FAIL';
    } else if (err?.code === 'ETIMEDOUT' || err?.code === 'ESOCKET' || /timeout/i.test(errMsg)) {
      errorCode = 'SMTP_CONN_FAIL';
    }

    // SMTP_PASS asla loglanmaz
    return {
      success: false,
      error: errorCode,
    };
  }
}
