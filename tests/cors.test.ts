import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { env, validateEnvironment } from '../src/config/env.js';

describe('Aşama 5: CORS Güvenlik Politikası Testleri', () => {
  const app = createApp();

  it('FRONTEND_URL origininden gelen isteklere CORS izni vermelidir', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', env.FRONTEND_URL);

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe(env.FRONTEND_URL);
  });

  it('Originsiz veya sunucudan sunucuya (curl/healthcheck) isteklere izin vermelidir', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('Yetkisiz rastgele bir origin (https://saldirgan-site.com) engellenmelidir', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://saldirgan-site.com');

    // CORS kısıtlaması nedeniyle 403 Forbidden döner
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('CORS kısıtlaması');
  });

  it('Netlify deploy-preview adresleri varsayılan olarak ENGELLENMELİDİR', async () => {
    const previewOrigin = 'https://deploy-preview-42--13sigorta.netlify.app';
    const res = await request(app)
      .get('/api/health')
      .set('Origin', previewOrigin);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('CORS kısıtlaması');
  });

  describe('validateEnvironment FRONTEND_URL Kontrolleri', () => {
    it('Production modunda FRONTEND_URL eksikse sunucu ayağa kalkmamalıdır', () => {
      const badEnv = {
        ...env,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://dummy',
        IP_HASH_SALT: 'a'.repeat(32),
        ADMIN_PASSWORD: 'b'.repeat(12),
        ADMIN_TOKEN_SECRET: 'c'.repeat(32),
        FRONTEND_URL: '',
      };

      expect(() => validateEnvironment(badEnv as any)).toThrow(
        /Production ortamında FRONTEND_URL tanımlı olmalıdır/
      );
    });

    it('Production modunda FRONTEND_URL sonunda / varsa hata vermelidir', () => {
      const badEnv = {
        ...env,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://dummy',
        IP_HASH_SALT: 'a'.repeat(32),
        ADMIN_PASSWORD: 'b'.repeat(12),
        ADMIN_TOKEN_SECRET: 'c'.repeat(32),
        FRONTEND_URL: 'https://13sigorta.netlify.app/',
      };

      expect(() => validateEnvironment(badEnv as any)).toThrow(
        /FRONTEND_URL sonunda bölü işareti \(\/\) bulunmamalıdır/
      );
    });

    it('Production modunda FRONTEND_URL http/https ile başlamıyorsa hata vermelidir', () => {
      const badEnv = {
        ...env,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://dummy',
        IP_HASH_SALT: 'a'.repeat(32),
        ADMIN_PASSWORD: 'b'.repeat(12),
        ADMIN_TOKEN_SECRET: 'c'.repeat(32),
        FRONTEND_URL: '13sigorta.netlify.app',
      };

      expect(() => validateEnvironment(badEnv as any)).toThrow(
        /FRONTEND_URL geçerli bir web adresi olmalıdır/
      );
    });
  });
});
