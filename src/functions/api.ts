import serverless from 'serverless-http';
import { createApp } from '../app.js';
import { initDb } from '../db/client.js';

const app = createApp();
let dbInitialized = false;

const serverlessHandler = serverless(app);

/**
 * Netlify Serverless Function Handler
 * Gelen HTTP isteklerini Express uygulamasına yönlendirir.
 */
export const handler = async (event: any, context: any) => {
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  // İlk soğuk açılışta veritabanı bağlantı havuzunu başlat
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
    } catch (err: any) {
      console.warn('[Netlify Function] DB başlatılamadı, in-memory mod devrede:', err.message);
    }
  }

  return serverlessHandler(event, context);
};
