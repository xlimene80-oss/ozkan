import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { validateEnvironment } from '../src/config/env.js';
import { createApp } from '../src/app.js';
import { SCHEMA_SQL } from '../src/db/client.js';
import { createOrUpdateLead, clearInMemoryLeads, getInMemoryLeads } from '../src/services/leadService.js';

describe('Aşama 1 Düzeltmeleri ve Ek Güvenceler (A, B, C, D)', () => {
  // A) Production'da DATABASE_URL veya IP_HASH_SALT eksikse durmalı
  describe('Düzeltme A: Production Ortam Doğrulaması', () => {
    it('Production ortamında DATABASE_URL boş ise hata fırlatmalıdır', () => {
      const prodEnvWithoutDb: any = {
        NODE_ENV: 'production',
        DATABASE_URL: '',
        IP_HASH_SALT: 'a-very-long-and-secure-salt-value-for-production-min-32-chars!',
      };
      expect(() => validateEnvironment(prodEnvWithoutDb)).toThrow(
        /DATABASE_URL tanımlı olmalıdır/
      );
    });

    it('Production ortamında IP_HASH_SALT varsayılan veya çok kısa ise hata fırlatmalıdır', () => {
      const prodEnvWeakSalt: any = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://user:pass@host:5432/db',
        IP_HASH_SALT: 'kisa',
      };
      expect(() => validateEnvironment(prodEnvWeakSalt)).toThrow(
        /en az 32 karakterlik güvenli ve benzersiz bir IP_HASH_SALT/
      );
    });

    it('Production ortamında tüm zorunlu alanlar geçerli ise onay vermelidir', () => {
      const validProdEnv: any = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://user:pass@host:5432/db',
        IP_HASH_SALT: 'a-very-long-and-secure-salt-value-for-production-min-32-chars!',
        ADMIN_PASSWORD: 'secure-admin-pass-12-chars!',
        ADMIN_TOKEN_SECRET: 'a-very-long-and-secure-token-secret-for-production-min-32-chars!',
        FRONTEND_URL: 'https://13sigorta.netlify.app',
      };
      expect(() => validateEnvironment(validProdEnv)).not.toThrow();
    });

    it('Production ortamında ADMIN_PASSWORD 12 karakterden kısa ise hata fırlatmalıdır', () => {
      const prodEnvWeakPass: any = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://user:pass@host:5432/db',
        IP_HASH_SALT: 'a-very-long-and-secure-salt-value-for-production-min-32-chars!',
        ADMIN_PASSWORD: 'short',
        ADMIN_TOKEN_SECRET: 'a-very-long-and-secure-token-secret-for-production-min-32-chars!',
      };
      expect(() => validateEnvironment(prodEnvWeakPass)).toThrow(/ADMIN_PASSWORD/);
    });

    it('Production ortamında ADMIN_TOKEN_SECRET 32 karakterden kısa ise hata fırlatmalıdır', () => {
      const prodEnvWeakSecret: any = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://user:pass@host:5432/db',
        IP_HASH_SALT: 'a-very-long-and-secure-salt-value-for-production-min-32-chars!',
        ADMIN_PASSWORD: 'secure-admin-pass-12-chars!',
        ADMIN_TOKEN_SECRET: 'short-secret',
      };
      expect(() => validateEnvironment(prodEnvWeakSecret)).toThrow(/ADMIN_TOKEN_SECRET/);
    });
  });

  // B) trust proxy ayarı ve X-Forwarded-For desteği
  describe('Düzeltme B: Express "trust proxy" ve İstemci IP Doğrulaması', () => {
    it('app trust proxy = 1 olarak yapılandırılmış olmalıdır', () => {
      const app = createApp();
      expect(app.get('trust proxy')).toBe(1);
    });

    it('X-Forwarded-For başlığındaki IP adresini doğru okumalıdır', async () => {
      const app = createApp();
      clearInMemoryLeads();

      const fakeClientIp = '198.51.100.42';
      const res = await request(app)
        .post('/api/leads')
        .set('X-Forwarded-For', `${fakeClientIp}, 10.0.0.1`)
        .send({
          name: 'Proxy Testi',
          phone: '05559876543',
          product_slug: 'kasko',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        });

      expect(res.status).toBe(200);
      const leads = getInMemoryLeads();
      const savedLead = leads.find((l) => l.name === 'Proxy Testi');
      expect(savedLead).toBeDefined();
      // ip_hash boş olmamalı ve 64 karakterli SHA256 olmalı
      expect(savedLead?.ip_hash).toHaveLength(64);
    });
  });

  // C) Tekrar talepte notun üstüne yazılmaması, altına tarih damgasıyla eklenmesi
  describe('Düzeltme C: Tekrar Talepte Notun Tarih Damgasıyla Eklenmesi', () => {
    it('Tekrar talepte eski not korunmalı ve yeni not altına eklenmelidir', async () => {
      clearInMemoryLeads();

      // 1. Talep
      await createOrUpdateLead(
        {
          name: 'Zeynep Kaya',
          phone: '05421112233',
          product_slug: 'kasko',
          note: 'Orijinal Not: Fiyat öğrenmek istiyorum.',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );

      // 2. Talep (24 saat içinde tekrar)
      const res2 = await createOrUpdateLead(
        {
          name: 'Zeynep Kaya',
          phone: '05421112233',
          product_slug: 'kasko',
          note: 'İkinci Not: Lütfen sabah arayınız.',
          kvkk_accepted: true,
          form_start_time: Date.now() - 4000,
        },
        '127.0.0.1'
      );

      expect(res2.isRepeat).toBe(true);

      const leads = getInMemoryLeads();
      expect(leads).toHaveLength(1);
      const lead = leads[0];
      expect(lead.repeat_count).toBe(2);
      expect(lead.note).toContain('Orijinal Not: Fiyat öğrenmek istiyorum.');
      expect(lead.note).toContain('TEKRAR TALEP');
      expect(lead.note).toContain('İkinci Not: Lütfen sabah arayınız.');
    });
  });

  // D) schema.sql idempotent kontrolü
  describe('Düzeltme D: Idempotent Schema SQL Güvenliği', () => {
    it('Şema SQL stringi IF NOT EXISTS ve ADD COLUMN IF NOT EXISTS içermelidir', () => {
      expect(SCHEMA_SQL).toContain('CREATE TABLE IF NOT EXISTS leads');
      expect(SCHEMA_SQL).toContain('ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_version');
      expect(SCHEMA_SQL).toContain('ALTER TABLE leads ADD COLUMN IF NOT EXISTS repeat_count');
      expect(SCHEMA_SQL).toContain('CREATE INDEX IF NOT EXISTS idx_leads_phone_product');
    });
  });

  // E) /api/admin/* için X-Robots-Tag başlığı
  describe('/api/admin/* X-Robots-Tag Kontrolü', () => {
    it('/api/admin/* rotalarına yapılan isteklerde X-Robots-Tag: noindex, nofollow başlığı bulunmalıdır', async () => {
      const app = createApp();
      const res = await request(app).get('/api/admin/talepler');
      expect(res.headers['x-robots-tag']).toBe('noindex, nofollow');
    });
  });
});
