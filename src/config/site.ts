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

export const siteConfig: SiteConfig = {
  acenteUnvani: '13 Sigorta Aracılık Hizmetleri Ltd. Şti.',
  acenteKisaAd: '13 SİGORTA',
  levhaNo: 'T20241-13130',
  teknikPersonel: [
    { ad: 'Ahmet Yılmaz', kayitNo: 'SEGEM-2018-44912' },
    { ad: 'Elif Demir', kayitNo: 'SEGEM-2021-88123' },
  ],
  // YASAL KURAL: Allianz adı yalnızca bu onaylı yetkili acente ifadesinde düz metin olarak geçer.
  yetkiliSirket: 'Allianz Sigorta A.Ş. yetkili acentesidir.',
  adres: 'Barbaros Mah. Begonya Sok. No: 13/A Ataşehir / İstanbul',
  telefon: 'tel:+908503081313',
  telefonDisplay: '0850 308 13 13',
  eposta: 'bilgi@13sigorta.com',
  whatsappNumarasi: '905321313013', // 90 ile başlar, + ve boşluk yok
  calismaSaatleri: 'Hafta İçi: 09:00 - 18:00 | Cumartesi: 09:00 - 13:00',
  danismanAdi: '13 Sigorta Danışmanı',
  consentVersion: 'v1.0',
  hasarHatti: '0850 308 13 13',
  hasarBilgiNotu: 'Hasar anında 7/24 acente destek hattımızdan uzman teknik personelimize ulaşabilirsiniz.',
  siteUrl: 'https://13sigorta.com',
  surum: 'v1.0.0',
};
