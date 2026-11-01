import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './src/config/site.js';
import { validateSiteConfig } from './src/config/siteValidation.js';

// Build Guard Plugin: CI ve Production derlemede eksik veya yer tutucu bilgi varsa build kesinlikle HATA verir
function buildGuardPlugin() {
  return {
    name: 'site-config-build-guard',
    buildStart() {
      const isCi = process.env.CI === 'true';
      const isProd = process.env.NODE_ENV === 'production';

      // CI (Netlify) ve Production ortamlarında SKIP_BUILD_GUARD bayrağı kesinlikle etkisizdir.
      // site.ts içindeki resmi bilgiler dolana kadar build bilerek başarısız olur.
      if (isCi || isProd || process.env.STRICT_BUILD_GUARD === 'true') {
        validateSiteConfig(siteConfig);
      }
    },
  };
}

// Robots Meta Tag Plugin: VITE_ALLOW_INDEXING="true" olmadıkça noindex, nofollow etiketini korur
function htmlRobotsPlugin() {
  return {
    name: 'html-robots-guard',
    transformIndexHtml(html: string) {
      if (process.env.VITE_ALLOW_INDEXING === 'true') {
        return html.replace(
          /<meta name="robots" content="noindex, nofollow" \/>/,
          '<meta name="robots" content="index, follow" />'
        );
      }
      return html;
    },
  };
}

export default defineConfig({
  plugins: [react(), buildGuardPlugin(), htmlRobotsPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
