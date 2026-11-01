import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { timingSafeCompare } from '../utils/security.js';
import { adminLoginLimiter, adminRenotifyLimiter } from '../middleware/rateLimiter.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import {
  getLeads,
  updateLead,
  getLeadEvents,
  exportLeadsToCsv,
  renotifyLead,
} from '../services/leadService.js';
import { LeadStatus } from '../types/lead.js';

const router = Router();

/**
 * POST /api/admin/login
 * Brute-force korumalı, sabit zamanlı (timing-safe) yönetici girişi.
 * 8 saatlik Bearer token üretir.
 */
router.post('/admin/login', adminLoginLimiter, (req: Request, res: Response) => {
  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, error: 'Şifre alanı zorunludur.' });
    return;
  }

  const isValid = timingSafeCompare(password, env.ADMIN_PASSWORD);
  if (!isValid) {
    res.status(401).json({ success: false, error: 'Hatalı yönetici şifresi.' });
    return;
  }

  // 8 saatlik (28800 sn) imzalı JWT Bearer token
  const token = jwt.sign({ role: 'admin' }, env.ADMIN_TOKEN_SECRET, {
    expiresIn: '8h',
  });

  res.json({
    success: true,
    token,
    expiresIn: 8 * 3600,
    message: 'Giriş başarılı.',
  });
});

/**
 * GET /api/admin/leads
 * Filtrelenmiş ve sayfalanmış talep listesi (ip_hash içermez).
 */
router.get('/admin/leads', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const filter = {
      product_slug: req.query.product_slug as string | undefined,
      status: req.query.status as string | undefined,
      date_start: req.query.date_start as string | undefined,
      date_end: req.query.date_end as string | undefined,
      q: req.query.q as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    };

    const data = await getLeads(filter);
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/admin/leads/:id
 * Durum güncelleme, not ekleme ve temsilci atama.
 */
router.patch('/admin/leads/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, assigned_to } = req.body || {};

    const updated = await updateLead(
      id,
      {
        status: status as LeadStatus | undefined,
        note: note as string | undefined,
        assigned_to: assigned_to as string | undefined,
      },
      'Yetkili'
    );

    res.json({ success: true, lead: updated });
  } catch (err: any) {
    const status = err.message === 'Talep bulunamadı.' ? 404 : 400;
    res.status(status).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/leads/:id/events
 * Bir talebin zaman çizelgesi / olay geçmişi.
 */
router.get('/admin/leads/:id/events', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const events = await getLeadEvents(id);
    res.json({ success: true, events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/leads/export
 * UTF-8 BOM ve formül enjeksiyonu korumalı CSV dışa aktarımı.
 */
router.get('/admin/leads/export', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const filter = {
      product_slug: req.query.product_slug as string | undefined,
      status: req.query.status as string | undefined,
      date_start: req.query.date_start as string | undefined,
      date_end: req.query.date_end as string | undefined,
      q: req.query.q as string | undefined,
    };

    const csvContent = await exportLeadsToCsv(filter);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `13sigorta-talepler-${dateStr}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/leads/:id/renotify
 * Başarısız veya kısmi bildirimleri manuel olarak tekrar tetikler (Admin yetkili + Rate Limit).
 */
router.post(
  '/admin/leads/:id/renotify',
  requireAdminAuth,
  adminRenotifyLimiter,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedLead = await renotifyLead(id);
      res.json({
        success: true,
        message: 'Bildirim yeniden tetiklendi.',
        lead: updatedLead,
      });
    } catch (err: any) {
      const status = err.message === 'Talep bulunamadı.' ? 404 : 500;
      res.status(status).json({ success: false, error: err.message });
    }
  }
);

export default router;
