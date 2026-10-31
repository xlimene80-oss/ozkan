import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteConfig } from './src/config/site.js';

// Build Guard Plugin: Production derlemede acenteUnvani veya levhaNo boşsa build HATA verir
function buildGuardPlugin() {
  return {
    name: 'site-config-build-guard',
    buildStart() {
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction || process.env.STRICT_BUILD_GUARD === 'true') {
        const errors: string[] = [];

        if (!siteConfig.acenteUnvani || siteConfig.acenteUnvani.trim() === '') {
          errors.push('siteConfig.acenteUnvani boş bırakılamaz.');
        } else if (
          !siteConfig.acenteUnvani.includes('Sigorta Aracılık') &&
          !siteConfig.acenteUnvani.includes('Sigorta Acentelik')
        ) {
          errors.push('siteConfig.acenteUnvani yasal olarak "Sigorta Aracılık" veya "Sigorta Acentelik" ifadesini içermelidir.');
        }

        if (!siteConfig.levhaNo || siteConfig.levhaNo.trim() === '') {
          errors.push('siteConfig.levhaNo (TOBB Levha No) boş bırakılamaz.');
        }

        if (errors.length > 0) {
          throw new Error(`[BUILD GUARD HATASI] Bilgiler eksik olduğu için derleme durduruldu: ${errors.join('; ')}`);
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
