import { env } from '../config/env.js';
import { Lead } from '../types/lead.js';
import { sendLeadEmail } from './emailService.js';
import { sendLeadWhatsApp } from './whatsappCloud.js';

export interface ChannelNotificationResult {
  channel: string;
  success: boolean;
  skipped?: boolean;
  error?: string;
}

export interface NotificationDispatchSummary {
  notify_status: 'pending' | 'sent' | 'partial' | 'failed' | 'skipped';
  notify_error: string | null;
  channels: ChannelNotificationResult[];
}

/**
 * Lead Bildirim Dağıtıcısı:
 * LEAD_NOTIFY_MODE ("log", "email", "whatsapp_cloud") kanallarına bağımsız olarak dağıtır.
 * Kanallar birbirinden izoledir; birinin hata vermesi diğerlerini etkilemez ve talep kaydını asla engellemez.
 * Çıktı olarak güvenli notify_status ve kısa hata kodu (notify_error) döner.
 */
export async function dispatchLeadNotification(
  lead: Lead,
  customEnv = env
): Promise<NotificationDispatchSummary> {
  const modes = customEnv.LEAD_NOTIFY_MODE || ['log'];
  const channelResults: ChannelNotificationResult[] = [];
  const isRepeat = lead.repeat_count > 1;
  const repeatBadge = isRepeat ? ` [TEKRAR TALEP #${lead.repeat_count}]` : '';

  for (const mode of modes) {
    if (mode === 'log') {
      try {
        // Güvenli, PII içermeyen yapılandırılmış konsol logu
        console.log(
          `[NOTIFY:LOG]${repeatBadge} Talep -> ID: ${lead.id} | Ürün: ${lead.product_slug} | Tercih Edilen Saat: ${lead.call_time}`
        );
        channelResults.push({ channel: 'log', success: true });
      } catch (err: any) {
        channelResults.push({ channel: 'log', success: false, error: 'LOG_WRITE_FAIL' });
      }
    } else if (mode === 'email') {
      try {
        const emailRes = await sendLeadEmail(lead, customEnv);
        channelResults.push({
          channel: 'email',
          success: emailRes.success,
          skipped: emailRes.skipped,
          error: emailRes.error,
        });
      } catch (err: any) {
        channelResults.push({ channel: 'email', success: false, error: 'EMAIL_DISPATCH_FAIL' });
      }
    } else if (mode === 'whatsapp_cloud') {
      try {
        const waRes = await sendLeadWhatsApp(lead, customEnv);
        channelResults.push({
          channel: 'whatsapp_cloud',
          success: waRes.success,
          skipped: waRes.skipped,
          error: waRes.error,
        });
      } catch (err: any) {
        channelResults.push({ channel: 'whatsapp_cloud', success: false, error: 'WA_DISPATCH_FAIL' });
      }
    }
  }

  // Genel bildirim durumunu ve hata kodunu hesapla
  // Aktif (skipped olmayan) kanalları değerlendir
  const activeChannels = channelResults.filter((c) => !c.skipped);
  const skippedChannels = channelResults.filter((c) => c.skipped);

  let notify_status: 'pending' | 'sent' | 'partial' | 'failed' | 'skipped' = 'sent';
  let notify_error: string | null = null;

  if (activeChannels.length === 0) {
    // Tüm kanallar skipped durumundaysa
    notify_status = 'skipped';
    notify_error = skippedChannels.map((c) => `${c.channel}:${c.error || 'CFG_MISSING'}`).join(';') || 'NO_ACTIVE_CHANNEL';
  } else {
    const successCount = activeChannels.filter((c) => c.success).length;
    const failCount = activeChannels.filter((c) => !c.success).length;

    if (failCount === 0) {
      notify_status = 'sent';
      notify_error = null;
    } else if (successCount > 0 && failCount > 0) {
      notify_status = 'partial';
      const failedErrors = activeChannels
        .filter((c) => !c.success)
        .map((c) => `${c.channel}:${c.error || 'FAIL'}`)
        .join(';');
      notify_error = failedErrors;
    } else {
      // Hiçbir aktif kanal başarılı olamadı
      notify_status = 'failed';
      const failedErrors = activeChannels
        .filter((c) => !c.success)
        .map((c) => `${c.channel}:${c.error || 'FAIL'}`)
        .join(';');
      notify_error = failedErrors;
    }
  }

  return {
    notify_status,
    notify_error,
    channels: channelResults,
  };
}
