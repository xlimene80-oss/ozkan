import { siteConfig } from './site.js';

export const PLACEHOLDER_TEXT = '[BİLGİ GİRİLECEK]';

/**
 * Production Build Guard
 * Acente resmi bilgileri eksikse veya "[BİLGİ GİRİLECEK]" yer tutucusu içeriyorsa derlemeyi kırar.
 */
export function validateSiteConfig(config = siteConfig): void {
  const errors: string[] = [];

  // 1. acenteUnvani kontrolü
  if (!config.acenteUnvani || config.acenteUnvani.trim() === '') {
    errors.push('acenteUnvani boş bırakılamaz.');
  } else if (config.acenteUnvani.includes(PLACEHOLDER_TEXT)) {
    errors.push('acenteUnvani resmi şirket unvanı girilmelidir ("[BİLGİ GİRİLECEK]" yer tutucusu kaldırılamamış).');
  } else if (
    !config.acenteUnvani.includes('Sigorta Aracılık') &&
    !config.acenteUnvani.includes('Sigorta Acentelik')
  ) {
    errors.push('acenteUnvani yasal olarak "Sigorta Aracılık" veya "Sigorta Acentelik" ibaresini içermelidir.');
  }

  // 2. levhaNo kontrolü
  if (!config.levhaNo || config.levhaNo.trim() === '') {
    errors.push('levhaNo (TOBB Levha No) boş bırakılamaz.');
  } else if (config.levhaNo.includes(PLACEHOLDER_TEXT)) {
    errors.push('levhaNo resmi TOBB levha kayıt numarası girilmelidir ("[BİLGİ GİRİLECEK]" yer tutucusu kaldırılamamış).');
  }

  // 3. İletişim alanları kontrolü
  if (!config.telefonDisplay || config.telefonDisplay.includes(PLACEHOLDER_TEXT)) {
    errors.push('telefonDisplay acente telefon numarası girilmelidir.');
  }
  if (!config.eposta || config.eposta.includes(PLACEHOLDER_TEXT)) {
    errors.push('eposta resmi acente e-posta adresi girilmelidir.');
  }
  if (
    !config.whatsappNumarasi ||
    config.whatsappNumarasi.includes(PLACEHOLDER_TEXT) ||
    !/^90\d{10}$/.test(config.whatsappNumarasi.replace(/\D/g, ''))
  ) {
    errors.push('whatsappNumarasi 90 ile başlayan geçerli bir numara olmalıdır.');
  }

  // 4. Teknik personel kontrolü
  if (
    !config.teknikPersonel ||
    config.teknikPersonel.length === 0 ||
    config.teknikPersonel.some((t) => t.ad.includes(PLACEHOLDER_TEXT) || t.kayitNo.includes(PLACEHOLDER_TEXT))
  ) {
    errors.push('teknikPersonel listesinde en az 1 yetkili SEGEM belgeli teknik personel yer almalıdır.');
  }

  if (errors.length > 0) {
    const errorBanner = [
      '\n=============================================================',
      '❌ [PRODUCTION BUILD GUARD HATASI] Eksik veya Yer Tutucu Resmi Bilgiler:',
      ...errors.map((err) => `  - ${err}`),
      '=============================================================\n',
    ].join('\n');
    throw new Error(errorBanner);
  }
}
