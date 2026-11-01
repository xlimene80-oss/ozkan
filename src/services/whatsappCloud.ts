import { env } from '../config/env.js';
import { Lead } from '../types/lead.js';
import { maskPhoneNumber } from '../utils/security.js';

export interface WhatsAppSendResult {
  success: boolean;
  error?: string;
  skipped?: boolean;
}

/**
 * WhatsApp Parametre Temizleme Kuralı:
 * - Satır sonu (\r, \n) ve sekmeleri (\t) temizler
 * - Art arda 4 ve üzeri boşlukları tek boşluğa indirger
 * - Maksimum 200 karakter ile sınırlar
 * - Boş parametre yerine "-" koyar
 */
export function cleanWhatsAppParam(val: unknown): string {
  if (val === null || val === undefined) return '-';
  const str = String(val)
    .replace(/\r\n|\r|\n|\t/g, ' ')
    .replace(/ {4,}/g, ' ')
    .trim();

  if (str.length === 0) return '-';
  return str.slice(0, 200);
}

/**
 * Tek bir alıcı numarasına WhatsApp Cloud API üzerinden şablon mesajı gönderir.
 * 429, 5xx ve ağ hatalarında en fazla 2 kez üstel bekleme (exponential backoff) ile yeniden dener.
 * 401/403 veya 400 durumlarında yeniden deneme yapmaz.
 * Token ve alıcı numaralarını ASLA ham olarak loglamaz.
 */
async function sendToSingleRecipient(
  recipientPhone: string,
  lead: Lead,
  customEnv = env
): Promise<{ success: boolean; error?: string }> {
  const {
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_API_VERSION,
    WHATSAPP_TEMPLATE_NAME,
    WHATSAPP_TEMPLATE_LANG,
  } = customEnv;

  const cleanRecipient = recipientPhone.replace(/\D/g, '');
  if (!cleanRecipient) {
    return { success: false, error: 'WA_INVALID_RECIPIENT' };
  }

  // Şablon gövde parametreleri: 1: Ürün, 2: Ad, 3: Telefon, 4: Aranma saati
  const isRepeat = lead.repeat_count > 1;
  const productNameWithRepeat = isRepeat
    ? `${lead.product_slug} (TEKRAR TALEP #${lead.repeat_count})`
    : lead.product_slug;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanRecipient,
    type: 'template',
    template: {
      name: WHATSAPP_TEMPLATE_NAME,
      language: {
        code: WHATSAPP_TEMPLATE_LANG || 'tr',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: cleanWhatsAppParam(productNameWithRepeat) },
            { type: 'text', text: cleanWhatsAppParam(lead.name) },
            { type: 'text', text: cleanWhatsAppParam(lead.phone) },
            { type: 'text', text: cleanWhatsAppParam(lead.call_time) },
          ],
        },
      ],
    },
  };

  const endpoint = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const maxRetries = 2;
  let lastError = 'WA_UNKNOWN_ERROR';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10 saniye zaman aşımı
      });

      if (response.ok) {
        // Başarılı gönderim: maskeli numara ile güvenli log
        console.log(`[WA_SUCCESS] WhatsApp şablonu iletildi -> Alıcı: ${maskPhoneNumber(cleanRecipient)}`);
        return { success: true };
      }

      const status = response.status;

      // 401 / 403: Token veya Yetki Hatası (Yeniden deneme yapılmaz)
      if (status === 401 || status === 403) {
        console.error(`[WA_AUTH_FAIL] Yetkilendirme hatası (HTTP ${status}). Token geçersiz veya yetkisiz.`);
        return { success: false, error: 'WA_AUTH_FAIL' };
      }

      // 400: Şablon veya Parametre Hatası (Yeniden deneme yapılmaz)
      if (status === 400) {
        console.error(`[WA_PARAM_ERROR] Şablon veya parametre geçersiz (HTTP 400).`);
        return { success: false, error: 'WA_PARAM_ERROR' };
      }

      // 429: Rate Limit veya 5xx: Sunucu Hatası (Geçici hata, yeniden denenebilir)
      if (status === 429) {
        lastError = 'WA_RATE_LIMIT';
      } else if (status >= 500) {
        lastError = 'WA_SERVER_ERROR';
      } else {
        lastError = `WA_HTTP_${status}`;
      }

      // Yeniden deneme öncesi üstel bekleme (attempt 0: 300ms, attempt 1: 900ms)
      if (attempt < maxRetries) {
        const delay = Math.pow(3, attempt) * 300;
        await new Promise((res) => setTimeout(res, delay));
      }
    } catch (err: any) {
      // Ağ veya zaman aşımı hatası (Geçici hata)
      lastError = err?.name === 'TimeoutError' ? 'WA_TIMEOUT' : 'WA_NETWORK_ERROR';
      if (attempt < maxRetries) {
        const delay = Math.pow(3, attempt) * 300;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  return { success: false, error: lastError };
}

/**
 * WhatsApp Cloud API Bildirim Gönderici:
 * WHATSAPP_NOTIFY_TO içindeki tüm virgülle ayrılmış numaralara şablon mesajını iletir.
 */
export async function sendLeadWhatsApp(lead: Lead, customEnv = env): Promise<WhatsAppSendResult> {
  const {
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_NOTIFY_TO,
  } = customEnv;

  // Yapılandırma eksikse çökmeyip skipped döner
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_NOTIFY_TO) {
    return {
      success: false,
      skipped: true,
      error: 'CFG_MISSING',
    };
  }

  const recipients = WHATSAPP_NOTIFY_TO.split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (recipients.length === 0) {
    return {
      success: false,
      skipped: true,
      error: 'CFG_MISSING',
    };
  }

  let anySuccess = false;
  let lastError: string | undefined;

  for (const recipient of recipients) {
    const res = await sendToSingleRecipient(recipient, lead, customEnv);
    if (res.success) {
      anySuccess = true;
    } else {
      lastError = res.error;
    }
  }

  if (anySuccess) {
    return { success: true };
  }

  return {
    success: false,
    error: lastError || 'WA_DISPATCH_FAIL',
  };
}
