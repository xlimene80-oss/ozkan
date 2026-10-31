import { siteConfig } from './site.js';

/**
 * Production Build Doğrulayıcısı
 * Acente Unvanı veya Levha No eksikse derleme anında hata fırlatarak build'i kırar.
 */
export function validateSiteConfig(): void {
  const errors: string[] = [];

  if (!siteConfig.acenteUnvani || siteConfig.acenteUnvani.trim() === '') {
    errors.push('acenteUnvani boş bırakılamaz.');
  } else if (
    !siteConfig.acenteUnvani.includes('Sigorta Aracılık') &&
    !siteConfig.acenteUnvani.includes('Sigorta Acentelik')
  ) {
    errors.push('acenteUnvani yasal olarak "Sigorta Aracılık" veya "Sigorta Acentelik" ifadesini içermelidir.');
  }

  if (!siteConfig.levhaNo || siteConfig.levhaNo.trim() === '') {
    errors.push('levhaNo (TOBB Levha Kayıt Numarası) boş bırakılamaz.');
  }

  if (errors.length > 0) {
    console.error('\n=============================================================');
    console.error('❌ [YASAL VE TEKNİK BUILD HATASI] site.ts Bilgileri Eksik:');
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error('=============================================================\n');
    throw new Error(`Build Guard Hatası: ${errors.join(' | ')}`);
  }
}
