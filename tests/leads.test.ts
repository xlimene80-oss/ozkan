import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { clearInMemoryLeads } from '../src/services/leadService.js';

describe('Leads API ve Uçtan Uca Akış (/api/leads)', () => {
  const app = createApp();

  beforeEach(() => {
    clearInMemoryLeads();
  });

  it('GET /api/health sistem durumunu ve veritabanı durumunu dönmelidir', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('database');
  });

  it('POST /api/leads KVKK onayı olmadan talebi 400 ile reddetmelidir', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Ali Veli',
        phone: '05321234567',
        product_slug: 'kasko',
        kvkk_accepted: false,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('KVKK');
  });

  it('POST /api/leads geçersiz telefon numarası ile 400 dönmelidir', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Ali Veli',
        phone: '02121112233', // Cep telefonu değil
        product_slug: 'kasko',
        kvkk_accepted: true,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('cep telefonu');
  });

  it('POST /api/leads geçerli verilerle başarılı kayıt oluşturmalı ve 200 dönmelidir', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Ayşe Kaya',
        phone: '0 (544) 123 45 67',
        email: 'ayse@example.com',
        product_slug: 'tamamlayici-saglik',
        call_time: 'Sabah',
        note: 'Ailem için bilgi almak istiyorum.',
        product_extra: '3 kişi',
        kvkk_accepted: true,
        marketing_consent: true,
        consent_version: 'v1.0',
        form_start_time: Date.now() - 5000, // 5 sn önce başladı (normal kullanıcı)
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('leadId');
    expect(res.body.isRepeat).toBe(false);
  });

  it('POST /api/leads bot honeypot tuzak alanını sessizce yutmalıdır', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Spam Bot',
        phone: '05551234567',
        product_slug: 'kasko',
        kvkk_accepted: true,
        _gotcha: 'I am a spambot', // Bot bu gizli alanı doldurdu
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/leads 2.5 saniyeden hızlı gönderimi (bot) sessizce yutmalıdır', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Hızlı Bot',
        phone: '05551234567',
        product_slug: 'kasko',
        kvkk_accepted: true,
        form_start_time: Date.now() - 500, // Sadece 0.5 saniye geçti
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Düzeltme 9: Aynı telefon ve ürün için 24 saat içindeki talebi tekrar talep olarak işaretlemelidir', async () => {
    const payload = {
      name: 'Mehmet Özkan',
      phone: '05331112233',
      product_slug: 'zorunlu-trafik',
      call_time: 'Öğleden sonra',
      note: 'İlk talebim',
      kvkk_accepted: true,
      form_start_time: Date.now() - 4000,
    };

    // 1. Gönderim
    const res1 = await request(app).post('/api/leads').send(payload);
    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.isRepeat).toBe(false);

    // 2. Gönderim (aynı telefon, aynı ürün)
    const res2 = await request(app)
      .post('/api/leads')
      .send({
        ...payload,
        note: 'Fiyatı tekrar hatırlatmak istedim',
      });

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.isRepeat).toBe(true);
    expect(res2.body.message).toContain('kayıtlıdır');
  });

  it('Danışman widget talebi (product_slug: danisman) consent_version ve consent_at ile başarıyla kaydedilmelidir', async () => {
    const consultantPayload = {
      name: 'Kemal Sunal',
      phone: '05301234567',
      product_slug: 'danisman',
      call_time: 'Fark etmez',
      note: 'Genel danışmanlık almak istiyorum.',
      kvkk_accepted: true,
      consent_version: 'v1.0',
      form_start_time: Date.now() - 3500,
    };

    const res = await request(app).post('/api/leads').send(consultantPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { getInMemoryLeads } = await import('../src/services/leadService.js');
    const leads = getInMemoryLeads();
    const widgetLead = leads.find((l) => l.product_slug === 'danisman');
    expect(widgetLead).toBeDefined();
    expect(widgetLead?.name).toBe('Kemal Sunal');
    expect(widgetLead?.product_slug).toBe('danisman');
    expect(widgetLead?.consent_version).toBe('v1.0');
    expect(widgetLead?.consent_at).toBeDefined();
    expect(new Date(widgetLead!.consent_at).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
