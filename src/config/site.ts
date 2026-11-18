export interface TechnicalStaff {
  ad: string;
  kayitNo: string;
}

export interface ContactPhone {
  tel: string;
  raw: string;
  label: string;
  sublabel: string;
  isPrimary?: boolean;
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
  iletisimNumaralari: ContactPhone[];
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
 * Ana Marka Rengi: Allianz Laciverti (#00357B)
 */
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
  telefon: 'tel:+905436961313',
  telefonDisplay: '0543 696 13 13',
  eposta: 'bilgi@13sigorta.com',
  whatsappNumarasi: '905436961313', // 0543 696 13 13
  iletisimNumaralari: [
    {
      tel: '0543 696 13 13',
      raw: '905436961313',
      label: 'Genel Merkez & WhatsApp',
      sublabel: 'Tüm teklif, poliçe ve müşteri danışma hattı',
      isPrimary: true,
    },
    {
      tel: '0546 696 13 08',
      raw: '905466961308',
      label: 'Teklif & Müşteri Temsilcisi',
      sublabel: 'Kasko, Sağlık, BES ve Konut teklif danışmanı',
    },
    {
      tel: '0532 701 95 99',
      raw: '905327019599',
      label: 'Poliçe & Operasyon Hattı',
      sublabel: 'Mevcut poliçe yenileme, zeyil ve tahsilat işlemleri',
    },
    {
      tel: '0533 250 97 13',
      raw: '905332509713',
      label: '7/24 Hasar Destek & Acil Yardım',
      sublabel: 'Kaza, acil yardım, ikame araç ve çekici koordinasyonu',
    },
  ],
  calismaSaatleri: 'Hafta İçi: 09:00 - 18:00 | Cumartesi: 09:00 - 13:00 (7/24 Hasar Destek)',
  danismanAdi: '13 Sigorta Danışmanı',
  consentVersion: 'v1.0',
  hasarHatti: '0533 250 97 13',
  hasarBilgiNotu: 'Hasar anında 7/24 acente destek hattımızdan uzman teknik personelimize ulaşabilirsiniz.',
  siteUrl: 'https://13sigorta.com',
  surum: 'v2.0.0',
};
