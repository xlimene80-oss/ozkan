import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AdminPayload {
  role: 'admin';
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

/**
 * Admin Rotaları için Bearer Token JWT Doğrulama Ara Yazılımı
 * 8 saatlik imzalı token'ı kontrol eder.
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Yetkilendirme başlığı eksik veya geçersiz. Lütfen tekrar giriş yapınız.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();

  try {
    const decoded = jwt.verify(token, env.ADMIN_TOKEN_SECRET) as AdminPayload;
    if (decoded.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Bu işlem için yetkiniz bulunmamaktadır.',
      });
      return;
    }
    req.admin = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Oturum süresi dolmuş veya geçersiz. Lütfen tekrar giriş yapınız.',
    });
  }
}
