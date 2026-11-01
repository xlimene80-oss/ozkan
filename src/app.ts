import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';
import leadsRouter from './routes/leads.js';
import adminRouter from './routes/admin.js';

export function createApp() {
  const app = express();

  // Düzeltme B: Render ve ters proxy arkasında gerçek istemci IP'sini okumak için
  app.set('trust proxy', 1);

  // 1. Güvenlik Başlıkları (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite ve SPA uyumluluğu
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS (Sadece FRONTEND_URL; Netlify deploy-preview adresleri varsayılan olarak engelli)
  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Sunucudan sunucuya (originsiz istekler, curl, sağlık kontrolü)
        if (!origin) {
          return callback(null, true);
        }

        // 1. FRONTEND_URL ile tam eşleşme (örn: https://13sigorta.netlify.app)
        if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
          return callback(null, true);
        }

        // 2. Yerel geliştirme / test ortamında localhost izinleri
        if (env.NODE_ENV !== 'production' && devOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Netlify deploy-preview ve diğer tüm izinsiz origin'ler engellenir
        const corsErr: any = new Error('CORS kısıtlaması: Bu kaynağa erişim yetkiniz bulunmamaktadır.');
        corsErr.status = 403;
        return callback(corsErr);
      },
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // 3. Gövde Boyutu Kısıtlaması (En fazla 10 KB)
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 4. API Rotaları
  // Düzeltme 7: /api/admin rotaları için arama motoru indekslemesini engelle
  app.use('/api/admin', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  });

  app.use('/api', healthRouter);
  app.use('/api', leadsRouter);
  app.use('/api', adminRouter);

  // 5. 404 Yakalayıcı
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: 'İstenen API uç noktası bulunamadı.' });
  });

  // 6. Global Hata Yakalayıcı (PII ve hassas hata ayrıntılarını gizler)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API Error]:', err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? 'Sunucu tarafında beklenmeyen bir hata oluştu.' : err.message,
    });
  });

  return app;
}
