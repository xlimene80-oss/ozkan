/**
 * Telefon Numarası Normalizasyonu
 * Türkiye formatındaki (05xx, 5xx, +905xx, 00905xx) numaraları
 * uluslararası E.164 standardı olan +905xxxxxxxxx biçimine dönüştürür.
 * 
 * Boşluk, parantez, tire, nokta gibi karakterleri temizler.
 * Geçersiz numara ise null döner.
 */
export function normalizePhoneNumber(rawPhone: string | null | undefined): string | null {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return null;
  }

  // Sadece rakamları ve baştaki + işaretini al
  let cleaned = rawPhone.trim().replace(/[\s\(\)\-\.\/]/g, '');

  // 0090 ile başlıyorsa +90 yap
  if (cleaned.startsWith('0090')) {
    cleaned = '+' + cleaned.substring(2);
  }

  // +90 ile başlıyorsa
  if (cleaned.startsWith('+90')) {
    const national = cleaned.substring(3);
    if (/^5\d{9}$/.test(national)) {
      return `+90${national}`;
    }
    return null;
  }

  // Sadece rakamlardan oluşuyorsa
  if (/^\d+$/.test(cleaned)) {
    // 0 ile başlıyorsa (örn. 05321234567 - 11 hane)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      const national = cleaned.substring(1);
      if (/^5\d{9}$/.test(national)) {
        return `+90${national}`;
      }
      return null;
    }

    // Doğrudan 5 ile başlıyorsa (örn. 5321234567 - 10 hane)
    if (cleaned.length === 10 && cleaned.startsWith('5')) {
      return `+90${cleaned}`;
    }

    // 90 ile başlıyorsa (örn. 905321234567 - 12 hane)
    if (cleaned.startsWith('90') && cleaned.length === 12) {
      const national = cleaned.substring(2);
      if (/^5\d{9}$/.test(national)) {
        return `+90${national}`;
      }
      return null;
    }
  }

  return null;
}

/**
 * Formatlanmış görüntüleme biçimi döner (örn: +90 532 123 45 67)
 */
export function formatPhoneNumber(normalizedPhone: string): string {
  if (!normalizedPhone || !normalizedPhone.startsWith('+90') || normalizedPhone.length !== 13) {
    return normalizedPhone;
  }
  const part1 = normalizedPhone.substring(0, 3); // +90
  const part2 = normalizedPhone.substring(3, 6); // 5xx
  const part3 = normalizedPhone.substring(6, 9); // xxx
  const part4 = normalizedPhone.substring(9, 11); // xx
  const part5 = normalizedPhone.substring(11, 13); // xx
  return `${part1} ${part2} ${part3} ${part4} ${part5}`;
}
