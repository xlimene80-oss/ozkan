import { describe, it, expect } from 'vitest';
import { validateSiteConfig, PLACEHOLDER_TEXT } from '../../client/src/config/siteValidation.js';
import { SiteConfig } from '../../client/src/config/site.js';

describe('Acente Resmi Bilgileri ve Build Guard Doğrulaması', () => {
  const validMockConfig: SiteConfig = {
    acenteKisaAd: '13 SİGORTA',
    acenteUnvani: '13 Sigorta Aracılık Hizmetleri Ltd. Şti.',
    levhaNo: 'T20241-13130',
    teknikPersonel: [{ ad: 'Ahmet Yılmaz', kayitNo: 'SEGEM-2020-1234' }],
    yetkiliSirket: 'Allianz Sigorta A.Ş. yetkili acentesidir.',
    adres: 'İstanbul / Ataşehir',
    telefon: 'tel:+908503081313',
    telefonDisplay: '0850 308 13 13',
    eposta: 'bilgi@13sigorta.com',
    whatsappNumarasi: '905321313013',
    calismaSaatleri: 'Hafta içi: 09:00 - 18:00',
    danismanAdi: '13 Sigorta Danışmanı',
    consentVersion: 'v1.0',
    hasarHatti: '0850 308 13 13',
    hasarBilgiNotu: 'Hasar anında 7/24 destek',
    siteUrl: 'https://13sigorta.com',
    surum: 'v1.0.0',
  };

  it('Tüm resmi bilgiler eksiksiz doldurulduğunda derleme onaylanmalıdır', () => {
    expect(() => validateSiteConfig(validMockConfig)).not.toThrow();
  });

  it('acenteUnvani "[BİLGİ GİRİLECEK]" yer tutucusu içeriyorsa build guard hata fırlatmalıdır', () => {
    const invalidConfig = { ...validMockConfig, acenteUnvani: PLACEHOLDER_TEXT };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/acenteUnvani/);
  });

  it('levhaNo "[BİLGİ GİRİLECEK]" yer tutucusu içeriyorsa build guard hata fırlatmalıdır', () => {
    const invalidConfig = { ...validMockConfig, levhaNo: PLACEHOLDER_TEXT };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/levhaNo/);
  });

  it('teknikPersonel yer tutucu içeriyorsa build guard hata fırlatmalıdır', () => {
    const invalidConfig = {
      ...validMockConfig,
      teknikPersonel: [{ ad: PLACEHOLDER_TEXT, kayitNo: PLACEHOLDER_TEXT }],
    };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/teknikPersonel/);
  });

  it('telefon veya e-posta yer tutucu içeriyorsa build guard hata fırlatmalıdır', () => {
    const invalidConfig = { ...validMockConfig, eposta: PLACEHOLDER_TEXT };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/eposta/);
  });

  it('whatsappNumarasi geçersiz veya yer tutucu ise build guard hata fırlatmalıdır', () => {
    const invalidConfig = { ...validMockConfig, whatsappNumarasi: PLACEHOLDER_TEXT };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/whatsappNumarasi/);
  });

  it('acenteUnvani yasal zorunlu "Sigorta Aracılık/Acentelik" ibaresini içermiyorsa hata fırlatmalıdır', () => {
    const invalidConfig = { ...validMockConfig, acenteUnvani: '13 Danışmanlık ve Ticaret A.Ş.' };
    expect(() => validateSiteConfig(invalidConfig)).toThrow(/Sigorta Aracılık/);
  });
});
