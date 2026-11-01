import { Router, Request, Response } from 'express';
import { leadRateLimiter } from '../middleware/rateLimiter.js';
import { createOrUpdateLead } from '../services/leadService.js';
import { CreateLeadDto } from '../types/lead.js';

const router = Router();

router.post('/leads', leadRateLimiter, async (req: Request, res: Response) => {
  try {
    const dto: CreateLeadDto = req.body;

    // İstek yapan istemci IP adresini güvenli biçimde al
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : (req.socket.remoteAddress || req.ip || '127.0.0.1');

    const result = await createOrUpdateLead(dto, clientIp);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Talep oluşturulurken bir hata meydana geldi.',
    });
  }
});

export default router;
