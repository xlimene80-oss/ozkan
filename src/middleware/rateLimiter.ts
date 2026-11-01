import rateLimit from 'express-rate-limit';

/**
 * Teklif talepleri için rate limiter:
 * IP başına 1 saatte en fazla 5 talep
 * (Test ortamında testlerin birbirini bloklamaması için atlanır)
 */
export const leadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    error: 'Kısa süre içerisinde çok fazla talep gönderdiniz. Lütfen daha sonra tekrar deneyiniz veya doğrudan acentemizi arayınız.',
  },
});

/**
 * Admin girişi için brute-force koruma:
 * 15 dakikada en fazla 5 deneme
 * (Test ortamında x-test-rate-limit başlığı olmadıkça atlanır)
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit'],
  message: {
    success: false,
    error: 'Çok fazla hatalı giriş denemesi. Lütfen 15 dakika sonra tekrar deneyiniz.',
  },
});

/**
 * Admin yeniden bildirim (renotify) rate limiter:
 * 5 dakikada en fazla 10 deneme
 */
export const adminRenotifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit'],
  message: {
    success: false,
    error: 'Kısa sürede çok fazla yeniden bildirim isteği yapıldı. Lütfen biraz sonra tekrar deneyiniz.',
  },
});
