import { Router } from 'express';
import { checkDbHealth } from '../db/client.js';
import { isNotificationConfigured } from '../config/env.js';

const router = Router();

router.get('/health', async (_req, res) => {
  const isDbHealthy = await checkDbHealth();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDbHealthy ? 'connected' : 'standalone_or_memory',
    notify_configured: isNotificationConfigured(),
  });
});

export default router;
