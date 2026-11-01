import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export let pool: pg.Pool | null = null;

if (env.DATABASE_URL) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[DB] Beklenmeyen PostgreSQL bağlantı hatası:', err.message);
  });
}

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_page VARCHAR(255) NOT NULL,
    product_slug VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    call_time VARCHAR(50) NOT NULL DEFAULT 'Fark etmez',
    note TEXT,
    product_extra VARCHAR(255),
    kvkk_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    consent_version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referrer VARCHAR(500),
    ip_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Yeni',
    assigned_to VARCHAR(100),
    first_contacted_at TIMESTAMPTZ,
    repeat_count INTEGER NOT NULL DEFAULT 1,
    last_repeated_at TIMESTAMPTZ,
    notify_status VARCHAR(50) DEFAULT 'pending',
    notify_error TEXT
  );

  ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_version VARCHAR(50) DEFAULT 'v1.0';
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ DEFAULT NOW();
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS repeat_count INTEGER DEFAULT 1;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_repeated_at TIMESTAMPTZ;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_status VARCHAR(50) DEFAULT 'pending';
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_error TEXT;
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100);
  ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_contacted_at TIMESTAMPTZ;

  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_product_slug ON leads(product_slug);
  CREATE INDEX IF NOT EXISTS idx_leads_phone_product ON leads(phone, product_slug, created_at DESC);

  CREATE TABLE IF NOT EXISTS lead_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
  CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON lead_events(created_at DESC);
`;

/**
 * Tablo ve indeksleri otomatik ve idempotent (güvenle tekrarlanabilir) olarak oluşturur
 */
export async function initDb(): Promise<void> {
  if (!pool) {
    if (env.NODE_ENV === 'production') {
      throw new Error('[DB] Production ortamında veritabanı bağlantısı yok.');
    }
    console.warn('[DB] DATABASE_URL tanımlı değil; PostgreSQL bağlantısı başlatılmadı.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('[DB] PostgreSQL "leads" tablosu ve indeksler hazır (idempotent kontrol tamamlandı).');
  } catch (err: any) {
    console.error('[DB] Veritabanı başlatma hatası:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Veritabanı bağlantı sağlık kontrolü
 */
export async function checkDbHealth(): Promise<boolean> {
  if (!pool) return false;
  try {
    const res = await pool.query('SELECT 1 as ok');
    return res.rows[0]?.ok === 1;
  } catch (err) {
    return false;
  }
}
