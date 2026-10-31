export interface TechnicalStaff {
  ad: string;
  kayitNo: string;
}

export interface SiteConfig {
  acenteUnvani: string;
  acenteKisaAd: string;
  levhaNo: string;
  teknikPersonel: TechnicalStaff[];
  yetkiliSirket: string;
  adres: string;
  telefon: string;
  telefonDisplay: string;
  eposta: string;
  whatsappNumarasi: string; // 90 ile başlayan uluslararası biçim, + olmadan
  calismaSaatleri: string;
  danismanAdi: string;
  consentVersion: string;
  hasarHatti: string;
  hasarBilgiNotu: string;
  siteUrl: string;
  surum: string;
}

/**
 * 13 SİGORTA - Acente Konfigürasyonu
 * Kullanıcı tarafından henüz iletilmemiş resmi bilgiler "[BİLGİ GİRİLECEK]" yer tutucusuyla işaretlenmiştir.
 * Production build guard bu yer tutucuları yakalayarak eksik bilgiyle derleme yapılmasını engeller.
 */
export const siteConfig: SiteConfig = {
  // Kullanıcı tarafından verilenler:
  acenteKisaAd: '13 SİGORTA',
  yetkiliSirket: 'Allianz Sigorta A.Ş. yetkili acentesidir.',
  consentVersion: 'v1.0',
  siteUrl: 'https://13sigorta.com',
  surum: 'v1.0.0',
  danismanAdi: '13 Sigorta Danışmanı',

  // Kullanıcı tarafından henüz verilmemiş resmi alanlar (Yer tutucu):
  acenteUnvani: '[BİLGİ GİRİLECEK]', // Örn: "13 Sigorta Aracılık Hizmetleri Ltd. Şti."
  levhaNo: '[BİLGİ GİRİLECEK]', // Örn: "T20241-XXXXX"
  teknikPersonel: [
    { ad: '[BİLGİ GİRİLECEK]', kayitNo: '[BİLGİ GİRİLECEK]' },
  ],
  adres: '[BİLGİ GİRİLECEK]',
  telefon: 'tel:[BİLGİ GİRİLECEK]',
  telefonDisplay: '[BİLGİ GİRİLECEK]',
  eposta: '[BİLGİ GİRİLECEK]',
  whatsappNumarasi: '[BİLGİ GİRİLECEK]', // 90 ile başlar
  calismaSaatleri: '[BİLGİ GİRİLECEK]',
  hasarHatti: '[BİLGİ GİRİLECEK]',
  hasarBilgiNotu: '[BİLGİ GİRİLECEK]',
};
