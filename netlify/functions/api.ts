import serverless from 'serverless-http';
import { createApp } from '../../src/app.js';
import { initDb } from '../../src/db/client.js';

const app = createApp();
let dbInitialized = false;

const serverlessHandler = serverless(app);

/**
 * Netlify Serverless Function Handler
 * Netlify CLI veya doğrudan TypeScript functions ile dağıtıldığında kullanılır.
 */
export const handler = async (event: any, context: any) => {
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

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
