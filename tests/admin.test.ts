import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { clearInMemoryLeads, createOrUpdateLead } from '../src/services/leadService.js';

describe('Admin Paneli API ve Güvenlik Testleri (/api/admin)', () => {
  const app = createApp();

  beforeEach(() => {
    clearInMemoryLeads();
  });

  // 1. Giriş ve Brute-Force Rate Limiting
  describe('POST /api/admin/login', () => {
    it('Şifre gönderilmediğinde 400 dönmelidir', async () => {
      const res = await request(app).post('/api/admin/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('Hatalı şifre girildiğinde timingSafeCompare ile 401 dönmelidir', async () => {
      const res = await request(app).post('/api/admin/login').send({ password: 'yanlis-sifre-123' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Hatalı');
    });

    it('Doğru şifre ile başarılı giriş yapıp 8 saatlik Bearer token dönmelidir', async () => {
      const res = await request(app).post('/api/admin/login').send({ password: env.ADMIN_PASSWORD });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.expiresIn).toBe(28800); // 8 saat
    });

    it('Brute-force: 5 hatalı denemeden sonra 429 Too Many Requests dönmelidir', async () => {
      // 5 başarısız deneme
      for (let i = 0; i < 5; i++) {
        const r = await request(app)
          .post('/api/admin/login')
          .set('x-test-rate-limit', 'true')
          .send({ password: 'hatali-deneme' });
        expect(r.status).toBe(401);
      }

      // 6. deneme bloklanmalıdır
      const blockedRes = await request(app)
        .post('/api/admin/login')
        .set('x-test-rate-limit', 'true')
        .send({ password: 'hatali-deneme' });
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body.error).toContain('Çok fazla hatalı giriş');
    });
  });

  // 2. Yetkilendirme (Bearer Token) Kontrolleri
  describe('Admin Yetkilendirme Koruması', () => {
    it('Token olmadan /api/admin/leads rotasına erişim 401 ile reddedilmelidir', async () => {
      const res = await request(app).get('/api/admin/leads');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Geçersiz token ile erişim 401 ile reddedilmelidir', async () => {
      const res = await request(app)
        .get('/api/admin/leads')
        .set('Authorization', 'Bearer gecersiz.sahte.token');
      expect(res.status).toBe(401);
    });
  });

  // 3. Talep Listeleme ve Gizlilik (ip_hash Dışlama)
  describe('GET /api/admin/leads (Filtreleme, Sayfalama ve Gizlilik)', () => {
    it('Talepleri başarıyla listelemeli ve ip_hash alanını ASLA döndürmemelidir', async () => {
      // Örnek talepler oluştur
      await createOrUpdateLead(
        {
          name: 'Ahmet Yılmaz',
          phone: '05321112233',
          product_slug: 'kasko',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '88.240.12.34'
      );

      await createOrUpdateLead(
        {
          name: 'Ayşe Demir',
          phone: '05442223344',
          product_slug: 'tamamlayici-saglik',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '176.55.44.33'
      );

      // Token al
      const loginRes = await request(app).post('/api/admin/login').send({ password: env.ADMIN_PASSWORD });
      const token = loginRes.body.token;

      // Listele
      const res = await request(app)
        .get('/api/admin/leads')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.total).toBe(2);
      expect(res.body.leads).toHaveLength(2);

      // KRİTİK GİZLİLİK TESTİ: ip_hash veya ham IP hiçbir kayıtta bulunmamalıdır!
      for (const lead of res.body.leads) {
        expect(lead).not.toHaveProperty('ip_hash');
        expect(lead).not.toHaveProperty('clientIp');
      }
    });

    it('Ürün ve arama filtresi doğru çalışmalıdır', async () => {
      await createOrUpdateLead(
        {
          name: 'Murat Can',
          phone: '05309998877',
          product_slug: 'kasko',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );
      await createOrUpdateLead(
        {
          name: 'Selim Vural',
          phone: '05338887766',
          product_slug: 'danisman',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );

      const loginRes = await request(app).post('/api/admin/login').send({ password: env.ADMIN_PASSWORD });
      const token = loginRes.body.token;

      // Sadece 'danisman' filtresi
      const resProduct = await request(app)
        .get('/api/admin/leads?product_slug=danisman')
        .set('Authorization', `Bearer ${token}`);
      expect(resProduct.body.total).toBe(1);
      expect(resProduct.body.leads[0].name).toBe('Selim Vural');

      // İsim araması 'Murat'
      const resSearch = await request(app)
        .get('/api/admin/leads?q=Murat')
        .set('Authorization', `Bearer ${token}`);
      expect(resSearch.body.total).toBe(1);
      expect(resSearch.body.leads[0].name).toBe('Murat Can');
    });
  });

  // 4. Durum Güncelleme, İlk Dönüş Süresi ve Not Geçmişi
  describe('PATCH /api/admin/leads/:id', () => {
    it('Durumu "Arandı" olarak güncellendiğinde first_contacted_at damgalanmalı ve not geçmişi korunmalıdır', async () => {
      const created = await createOrUpdateLead(
        {
          name: 'Zeki Müren',
          phone: '05554443322',
          product_slug: 'dask',
          note: 'Müşteri ilk notu',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );

      const loginRes = await request(app).post('/api/admin/login').send({ password: env.ADMIN_PASSWORD });
      const token = loginRes.body.token;

      // Güncelleme: Durum -> 'Arandı', Yeni Not -> 'Müşteriyle görüşüldü, teklif hazırlandı'
      const updateRes = await request(app)
        .patch(`/api/admin/leads/${created.leadId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Arandı',
          note: 'Müşteriyle görüşüldü, teklif hazırlandı.',
          assigned_to: 'Ahmet Teknik',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.lead.status).toBe('Arandı');
      expect(updateRes.body.lead.assigned_to).toBe('Ahmet Teknik');
      expect(updateRes.body.lead.first_contacted_at).toBeDefined();

      // Not geçmişi kontrolü (eski not + yeni not)
      expect(updateRes.body.lead.note).toContain('Müşteri ilk notu');
      expect(updateRes.body.lead.note).toContain('Müşteriyle görüşüldü, teklif hazırlandı.');

      // Olay geçmişi kontrolü
      const eventsRes = await request(app)
        .get(`/api/admin/leads/${created.leadId}/events`)
        .set('Authorization', `Bearer ${token}`);
      expect(eventsRes.status).toBe(200);
      expect(eventsRes.body.events.length).toBeGreaterThanOrEqual(2);
      const statusEvent = eventsRes.body.events.find((e: any) => e.action === 'status_change');
      expect(statusEvent).toBeDefined();
      expect(statusEvent.new_value).toBe('Arandı');
    });
  });

  // 5. CSV Export ve Formül Enjeksiyonu Koruması
  describe('GET /api/admin/leads/export (CSV & Formül Enjeksiyonu Koruması)', () => {
    it('CSV çıktısı UTF-8 BOM ile başlamalı ve formül karakterleri (=, +, -, @) tek tırnakla nötrleştirilmelidir', async () => {
      // Potansiyel formül enjeksiyonu içeren zararlı girdiler
      await createOrUpdateLead(
        {
          name: '=CMD|calc.exe',
          phone: '05329990011',
          product_slug: 'kasko',
          note: '+2+5*10 formülü ve @sum zararlı tetikleyici',
          product_extra: '-10 indirim talep etti',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );

      const loginRes = await request(app).post('/api/admin/login').send({ password: env.ADMIN_PASSWORD });
      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/admin/leads/export')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');

      const csvText = res.text;

      // UTF-8 BOM (\uFEFF) ile başlamalıdır
      expect(csvText.charCodeAt(0)).toBe(0xfeff);

      // Formül koruması kontrolü: Zararlı karakterlerin başına tek tırnak (') eklenmiş olmalıdır
      expect(csvText).toContain("'=CMD|calc.exe");
      expect(csvText).toContain("'+2+5*10");
      expect(csvText).toContain("'-10 indirim");
    });
  });
});
