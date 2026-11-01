import { describe, it, expect } from 'vitest';
import { normalizePhoneNumber, formatPhoneNumber } from '../src/utils/phoneNormalizer.js';

describe('Telefon Numarası Normalizasyonu (phoneNormalizer)', () => {
  it('05xx formatındaki numaraları normalize etmelidir', () => {
    expect(normalizePhoneNumber('05321234567')).toBe('+905321234567');
    expect(normalizePhoneNumber('05449876543')).toBe('+905449876543');
    expect(normalizePhoneNumber('05051112233')).toBe('+905051112233');
  });

  it('Başında 0 olmadan 5xx formatındaki numaraları normalize etmelidir', () => {
    expect(normalizePhoneNumber('5321234567')).toBe('+905321234567');
    expect(normalizePhoneNumber('5551234567')).toBe('+905551234567');
  });

  it('+90 veya 0090 ile başlayan numaraları normalize etmelidir', () => {
    expect(normalizePhoneNumber('+905321234567')).toBe('+905321234567');
    expect(normalizePhoneNumber('00905321234567')).toBe('+905321234567');
    expect(normalizePhoneNumber('905321234567')).toBe('+905321234567');
  });

  it('Boşluk, parantez, tire ve nokta içeren numaraları doğru temizlemelidir', () => {
    expect(normalizePhoneNumber('0 (532) 123 45 67')).toBe('+905321234567');
    expect(normalizePhoneNumber('+90 532 123-45.67')).toBe('+905321234567');
    expect(normalizePhoneNumber('532-123-4567')).toBe('+905321234567');
    expect(normalizePhoneNumber('  0532 123 4567  ')).toBe('+905321234567');
  });

  it('Geçersiz ve hatalı numaralarda null dönmelidir', () => {
    expect(normalizePhoneNumber('')).toBeNull();
    expect(normalizePhoneNumber(' ')).toBeNull();
    expect(normalizePhoneNumber(null)).toBeNull();
    expect(normalizePhoneNumber(undefined)).toBeNull();
    // 5 ile başlamayan Türkiye cep numarası (sabit hat veya geçersiz)
    expect(normalizePhoneNumber('02121234567')).toBeNull();
    // Eksik hane
    expect(normalizePhoneNumber('053212345')).toBeNull();
    // Fazla hane
    expect(normalizePhoneNumber('0532123456789')).toBeNull();
    // Harf içerenler
    expect(normalizePhoneNumber('0532abc4567')).toBeNull();
  });

  it('formatPhoneNumber görsel biçimlendirmeyi doğru yapmalıdır', () => {
    expect(formatPhoneNumber('+905321234567')).toBe('+90 532 123 45 67');
  });
});
