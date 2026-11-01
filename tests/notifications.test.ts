import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { cleanWhatsAppParam, sendLeadWhatsApp } from '../src/services/whatsappCloud.js';
import { sendLeadEmail } from '../src/services/emailService.js';
import { dispatchLeadNotification } from '../src/services/notificationService.js';
import { createOrUpdateLead, renotifyLead, clearInMemoryLeads } from '../src/services/leadService.js';
import { escapeHtml, maskPhoneNumber } from '../src/utils/security.js';
import { Lead } from '../src/types/lead.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

describe('Aşama 5: Bildirim Servisleri ve Güvenlik Testleri', () => {
  beforeEach(() => {
    clearInMemoryLeads();
    vi.restoreAllMocks();
  });

  const sampleLead: Lead = {
    id: '11111111-2222-3333-4444-555555555555',
    created_at: new Date().toISOString(),
    source_page: '/teklif/kasko',
    product_slug: 'kasko',
    name: 'Mehmet Özkan <script>alert("xss")</script>',
    phone: '05321112233',
    email: 'mehmet@example.com',
    call_time: 'Sabah (09:00 - 12:00)',
    note: 'Kasko teklifi rica ediyorum. <img src=x onerror=alert(1)>',
    product_extra: '2023 Model SUV',
    kvkk_accepted: true,
    marketing_consent: true,
    consent_version: 'v1.0',
    consent_at: new Date().toISOString(),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    referrer: null,
    ip_hash: 'sample_hash',
    status: 'Yeni',
    assigned_to: null,
    first_contacted_at: null,
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'pending',
    notify_error: null,
  };

  // ============================================================================
  // 1. WhatsApp Parametre Temizleme ve Kısaltma
  // ============================================================================
  describe('WhatsApp Parametre Temizleme (cleanWhatsAppParam)', () => {
    it('Satır sonu, sekme ve 4+ ardışık boşlukları temizlemelidir', () => {
      const input = 'Satır 1\r\nSatır 2\tSekmeli    Dört Boşluklu';
      const cleaned = cleanWhatsAppParam(input);
      expect(cleaned).not.toContain('\r');
      expect(cleaned).not.toContain('\n');
      expect(cleaned).not.toContain('\t');
      expect(cleaned).not.toContain('    ');
      expect(cleaned).toBe('Satır 1 Satır 2 Sekmeli Dört Boşluklu');
    });

    it('200 karakterden uzun metinleri 200 karakterde kesmelidir', () => {
      const longInput = 'A'.repeat(300);
      const cleaned = cleanWhatsAppParam(longInput);
      expect(cleaned.length).toBe(200);
      expect(cleaned).toBe('A'.repeat(200));
    });

    it('Boş, null veya undefined girdilerde "-" dönmelidir', () => {
      expect(cleanWhatsAppParam(null)).toBe('-');
      expect(cleanWhatsAppParam(undefined)).toBe('-');
      expect(cleanWhatsAppParam('')).toBe('-');
      expect(cleanWhatsAppParam('    ')).toBe('-');
    });
  });

  // ============================================================================
  // 2. WhatsApp Cloud API İstemcisi
  // ============================================================================
  describe('WhatsApp Cloud API (sendLeadWhatsApp)', () => {
    it('Gerekli ortam değişkenleri eksikse çökmemeli ve skipped dönmelidir', async () => {
      const dummyEnv = {
        ...env,
        WHATSAPP_TOKEN: '',
        WHATSAPP_PHONE_NUMBER_ID: '',
        WHATSAPP_NOTIFY_TO: '',
      };
      const result = await sendLeadWhatsApp(sampleLead, dummyEnv as any);
      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);
      expect(result.error).toBe('CFG_MISSING');
    });

    it('API sürümünü kodda sabit tutmayıp WHATSAPP_API_VERSION env değişkeninden okumalıdır', async () => {
      let requestedUrl = '';
      const dummyEnv = {
        ...env,
        WHATSAPP_API_VERSION: 'v22.5_custom_version',
        WHATSAPP_TOKEN: 'test_token',
        WHATSAPP_PHONE_NUMBER_ID: '987654321',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation((url: string) => {
          requestedUrl = url;
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ messages: [{ id: 'wamid.123' }] }),
          });
        })
      );

      const result = await sendLeadWhatsApp(sampleLead, dummyEnv as any);
      expect(result.success).toBe(true);
      expect(requestedUrl).toBe(
        'https://graph.facebook.com/v22.5_custom_version/987654321/messages'
      );
    });

    it('Alıcı numaralarını ve token değerini loglarda maskelemeli, asla ham numara/token yazdırmamalıdır', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const dummyEnv = {
        ...env,
        WHATSAPP_TOKEN: 'SECRET_TOKEN_XYZ_12345',
        WHATSAPP_PHONE_NUMBER_ID: '12345678',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ messages: [{ id: 'wamid.123' }] }),
        })
      );

      await sendLeadWhatsApp(sampleLead, dummyEnv as any);

      const allLogs = consoleLogSpy.mock.calls.map((c) => c.join(' ')).join('\n');
      expect(allLogs).not.toContain('SECRET_TOKEN_XYZ_12345');
      expect(allLogs).not.toContain('905321112233');
      expect(allLogs).toContain('90532***2233'); // Maskelenmiş numara
    });

    it('401/403 veya 400 aldığında yeniden denememeli (retry yapmamalıdır)', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Invalid OAuth access token' } }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const dummyEnv = {
        ...env,
        WHATSAPP_TOKEN: 'bad_token',
        WHATSAPP_PHONE_NUMBER_ID: '12345678',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      const result = await sendLeadWhatsApp(sampleLead, dummyEnv as any);
      expect(result.success).toBe(false);
      expect(result.error).toBe('WA_AUTH_FAIL');
      expect(fetchMock).toHaveBeenCalledTimes(1); // Sadece 1 deneme
    });

    it('429 rate limit aldığında en fazla 2 kez yeniden denemelidir (üstel bekleme)', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'Rate limit hit' } }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const dummyEnv = {
        ...env,
        WHATSAPP_TOKEN: 'test_token',
        WHATSAPP_PHONE_NUMBER_ID: '12345678',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      const result = await sendLeadWhatsApp(sampleLead, dummyEnv as any);
      expect(result.success).toBe(false);
      expect(result.error).toBe('WA_RATE_LIMIT');
      expect(fetchMock).toHaveBeenCalledTimes(3); // 1 ilk + 2 retry = 3 deneme
    });
  });

  // ============================================================================
  // 3. E-posta Servisi ve XSS Kaçışı (escapeHtml)
  // ============================================================================
  describe('E-posta Servisi (sendLeadEmail) ve XSS Kaçışı', () => {
    it('escapeHtml zararlı XSS karakterlerini güvenli HTML entity formatına dönüştürmelidir', () => {
      const malicious = '<script>alert("XSS")</script>&"\'';
      const safe = escapeHtml(malicious);
      expect(safe).not.toContain('<script>');
      expect(safe).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;&quot;&#39;');
    });

    it('SMTP ayarları eksikse çökmeyip skipped dönmelidir', async () => {
      const dummyEnv = {
        ...env,
        SMTP_HOST: '',
        SMTP_USER: '',
        SMTP_PASS: '',
        NOTIFY_EMAIL_TO: '',
      };
      const result = await sendLeadEmail(sampleLead, dummyEnv as any);
      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);
      expect(result.error).toBe('SMTP_CFG_MISSING');
    });

    it('Tekrar talepte başlıkta ve gövdede [TEKRAR TALEP #N] ibaresi bulunmalıdır', async () => {
      const repeatLead: Lead = {
        ...sampleLead,
        repeat_count: 3,
      };

      let sentMailOptions: any = null;
      const mockTransporter = {
        sendMail: vi.fn().mockImplementation((opts) => {
          sentMailOptions = opts;
          return Promise.resolve({ messageId: 'test_msg_id' });
        }),
      };

      const dummyEnv = {
        ...env,
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: 587,
        SMTP_USER: 'test@example.com',
        SMTP_PASS: 'secret_pass_123',
        NOTIFY_EMAIL_TO: 'admin@13sigorta.com',
      };

      const result = await sendLeadEmail(repeatLead, dummyEnv as any, mockTransporter);
      expect(result.success).toBe(true);
      expect(sentMailOptions.subject).toContain('[TEKRAR TALEP #3]');
      expect(sentMailOptions.text).toContain('TEKRAR TALEP');
      // XSS kaçışını doğrula
      expect(sentMailOptions.html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(sentMailOptions.html).not.toContain('<script>');
    });
  });

  // ============================================================================
  // 4. Bağımsız Kanal Yürütümü (dispatchLeadNotification)
  // ============================================================================
  describe('Çoklu Kanal Dağıtımı (dispatchLeadNotification)', () => {
    it('Bir kanal hata verdiğinde diğer kanal çalışmaya devam etmelidir', async () => {
      // Log ve WhatsApp kanallarını aç, WhatsApp'ı başarısız yap
      const dummyEnv = {
        ...env,
        LEAD_NOTIFY_MODE: ['log', 'whatsapp_cloud'],
        WHATSAPP_TOKEN: 'bad_token',
        WHATSAPP_PHONE_NUMBER_ID: '123',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 401,
        })
      );

      const summary = await dispatchLeadNotification(sampleLead, dummyEnv as any);
      expect(summary.notify_status).toBe('partial');
      expect(summary.notify_error).toContain('whatsapp_cloud:WA_AUTH_FAIL');

      const logResult = summary.channels.find((c) => c.channel === 'log');
      const waResult = summary.channels.find((c) => c.channel === 'whatsapp_cloud');

      expect(logResult?.success).toBe(true);
      expect(waResult?.success).toBe(false);
    });

    it('Tüm bildirim kanalları çökse dahi talep başarıyla kaydedilmelidir', async () => {
      const dummyEnv = {
        ...env,
        LEAD_NOTIFY_MODE: ['whatsapp_cloud'],
        WHATSAPP_TOKEN: 'broken',
        WHATSAPP_PHONE_NUMBER_ID: '123',
        WHATSAPP_NOTIFY_TO: '905321112233',
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('Kritik Ağ Çöküşü'))
      );

      const res = await createOrUpdateLead(
        {
          product_slug: 'kasko',
          name: 'Ali Yılmaz',
          phone: '05329998877',
          kvkk_accepted: true,
        },
        '1.2.3.4'
      );

      // Talep kaydı asla engellenmez
      expect(res.success).toBe(true);
      expect(res.leadId).toBeDefined();
    });
  });

  // ============================================================================
  // 5. Admin Renotify Uç Noktası (POST /api/admin/leads/:id/renotify)
  // ============================================================================
  describe('Admin Renotify (POST /api/admin/leads/:id/renotify)', () => {
    const app = createApp();

    it('Yetkisiz (token olmadan) yapılan renotify isteği 401 dönmelidir', async () => {
      const res = await request(app).post('/api/admin/leads/some-id/renotify');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Geçerli token ile çağrıldığında renotify tetiklenmeli ve olay kaydedilmelidir', async () => {
      // Önce bir lead oluştur
      const leadRes = await createOrUpdateLead(
        {
          product_slug: 'trafik',
          name: 'Fatma Şahin',
          phone: '05441112233',
          kvkk_accepted: true,
        },
        '1.1.1.1'
      );

      const token = jwt.sign({ role: 'admin' }, env.ADMIN_TOKEN_SECRET, { expiresIn: '1h' });

      const res = await request(app)
        .post(`/api/admin/leads/${leadRes.leadId}/renotify`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.lead).toBeDefined();
      expect(res.body.lead.notify_status).toBeDefined();

      // Olay geçmişinde renotify eyleminin olduğunu kontrol et
      const evRes = await request(app)
        .get(`/api/admin/leads/${leadRes.leadId}/events`)
        .set('Authorization', `Bearer ${token}`);

      expect(evRes.status).toBe(200);
      const renotifyEvent = evRes.body.events.find((e: any) => e.action === 'renotify');
      expect(renotifyEvent).toBeDefined();
    });

    it('Rate limit tetiklendiğinde 429 Too Many Requests dönmelidir', async () => {
      const leadRes = await createOrUpdateLead(
        {
          product_slug: 'trafik',
          name: 'Fatma Şahin',
          phone: '05441112233',
          kvkk_accepted: true,
        },
        '1.1.1.1'
      );

      const token = jwt.sign({ role: 'admin' }, env.ADMIN_TOKEN_SECRET, { expiresIn: '1h' });

      // 10 deneme hakkını x-test-rate-limit ile tüket
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post(`/api/admin/leads/${leadRes.leadId}/renotify`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-test-rate-limit', 'true');
      }

      // 11. deneme 429 almalı
      const res = await request(app)
        .post(`/api/admin/leads/${leadRes.leadId}/renotify`)
        .set('Authorization', `Bearer ${token}`)
        .set('x-test-rate-limit', 'true');

      expect(res.status).toBe(429);
      expect(res.body.success).toBe(false);
    });
  });
});
