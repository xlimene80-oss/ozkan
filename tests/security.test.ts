import { describe, it, expect } from 'vitest';
import { hashIp, timingSafeCompare, sanitizeString } from '../src/utils/security.js';

describe('Güvenlik ve Temizleme Fonksiyonları (security)', () => {
  it('hashIp IP adresini tuzlu ve tek yönlü hashlemelidir', () => {
    const hash1 = hashIp('192.168.1.1');
    const hash2 = hashIp('192.168.1.1');
    const hash3 = hashIp('192.168.1.2');

    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2); // Aynı IP aynı hash
    expect(hash1).not.toBe(hash3); // Farklı IP farklı hash
    expect(hash1).not.toContain('192.168.1.1'); // Ham IP sızmaz
  });

  it('timingSafeCompare zamanlama güvenli karşılaştırma yapmalıdır', () => {
    expect(timingSafeCompare('gizliSifre123', 'gizliSifre123')).toBe(true);
    expect(timingSafeCompare('gizliSifre123', 'yanlisSifre')).toBe(false);
    expect(timingSafeCompare('kisa', 'uzunBirSifreMetni')).toBe(false);
  });

  it('sanitizeString HTML etiketlerini ve boşlukları temizlemeli ve uzunluğu sınırlandırmalıdır', () => {
    expect(sanitizeString('  Ahmet Yılmaz  ')).toBe('Ahmet Yılmaz');
    expect(sanitizeString('<script>alert("hack")</script>Mehmet')).toBe('scriptalert("hack")/scriptMehmet');
    expect(sanitizeString('1234567890', 5)).toBe('12345');
  });
});
