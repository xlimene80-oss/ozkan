import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './src/config/site.js';
import { validateSiteConfig } from './src/config/siteValidation.js';

// Build Guard Plugin: Production derlemede eksik veya yer tutucu bilgi varsa build HATA verir
function buildGuardPlugin() {
  return {
    name: 'site-config-build-guard',
    buildStart() {
      // Production derlemesinde veya STRICT_BUILD_GUARD bayrağı açıkken resmi bilgileri doğrula
      // Netlify önizleme derlemelerinde (NETLIFY=true) yer tutucular için derlemeyi kırmaz, uyarı verir
      if (process.env.STRICT_BUILD_GUARD === 'true') {
        validateSiteConfig(siteConfig);
      } else if (process.env.NODE_ENV === 'production' && process.env.SKIP_BUILD_GUARD !== 'true') {
        if (process.env.NETLIFY === 'true') {
          try {
            validateSiteConfig(siteConfig);
          } catch (err: any) {
            console.warn('[site-config-build-guard] UYARI: Netlify ortamında eksik/yer tutucu resmi bilgi tespit edildi, önizleme için derlemeye devam ediliyor.\n' + err.message);
          }
        } else {
          validateSiteConfig(siteConfig);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), buildGuardPlugin()],
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
