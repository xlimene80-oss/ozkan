import { createApp } from './app.js';
import { env, validateEnvironment } from './config/env.js';
import { initDb } from './db/client.js';

async function bootstrap() {
  // Production kontrolleri: DATABASE_URL veya IP_HASH_SALT eksikse derhal durdur
  validateEnvironment();

  const app = createApp();

  // Veritabanı başlatma denemesi (PostgreSQL varsa)
  try {
    await initDb();
  } catch (err: any) {
    if (env.NODE_ENV === 'production') {
      console.error('[DB] Production ortamında veritabanı başlatılamadı. Sunucu durduruluyor:', err.message);
      process.exit(1);
    }
    console.warn('[DB] PostgreSQL başlatılamadı, in-memory modda devam ediliyor:', err.message);
  }

  const port = env.PORT;
  app.listen(port, () => {
    console.log(`[13 SIGORTA Server] Sunucu http://localhost:${port} adresinde dinlemede.`);
    console.log(`[13 SIGORTA Server] Bildirim Modu: ${env.LEAD_NOTIFY_MODE.join(', ')}`);
    console.log(`[13 SIGORTA Server] Ortam: ${env.NODE_ENV}`);
  });
}

bootstrap().catch((err) => {
  console.error('[13 SIGORTA Server] Başlatma sırasında kritik hata:', err.message);
  process.exit(1);
});
