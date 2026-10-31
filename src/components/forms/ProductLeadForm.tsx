import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../data/products.js';
import { siteConfig } from '../../config/site.js';
import { buildWhatsAppLink, generateLeadWhatsAppMessage } from '../../utils/whatsapp.js';
import { API_BASE_URL } from '../../config/api.js';
import { AgencyBadge } from '../layout/AgencyBadge.js';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface ProductLeadFormProps {
  product: Product;
}

export const ProductLeadForm: React.FC<ProductLeadFormProps> = ({ product }) => {
  // Form Alanları Durumu
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [callTime, setCallTime] = useState('Fark etmez');
  const [note, setNote] = useState('');
  const [productExtra, setProductExtra] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Bot & Spam Koruması
  const [gotcha, setGotcha] = useState('');
  const formStartTimeRef = useRef<number>(Date.now());

  // Gönderim Durumları
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    formStartTimeRef.current = Date.now();
  }, [product.slug]);

  // Telefon Formatlama (Kullanıcı yazarken otomatik 05xx formatında tutar)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (val.length > 15) val = val.substring(0, 15);
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // İstemci Doğrulamaları
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Lütfen adınızı ve soyadınızı eksiksiz giriniz.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Lütfen geçerli bir telefon numarası giriniz (05xx...).');
      return;
    }
    if (!kvkkAccepted) {
      setErrorMessage('Devam etmek için KVKK aydınlatma metnini onaylamanız gerekmektedir.');
      return;
    }

    setLoading(true);

    // 60 Saniye Zaman Aşımı Denetleyicisi (Render container soğuk açılışı için)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const payload = {
        source_page: `/teklif/${product.slug}`,
        product_slug: product.slug,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        call_time: callTime,
        note: note.trim() || undefined,
        product_extra: productExtra.trim() || undefined,
        kvkk_accepted: kvkkAccepted,
        marketing_consent: marketingConsent,
        consent_version: siteConfig.consentVersion,
        _gotcha: gotcha,
        form_start_time: formStartTimeRef.current,
      };

      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Talep iletilirken bir hata oluştu.');
      }

      setSuccess(true);
      setIsRepeat(Boolean(data.isRepeat));
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorMessage(
          'Sunucu yanıt süresi 60 saniyeyi aştı. Lütfen beklememek için aşağıdaki WhatsApp butonundan acentemize doğrudan yazınız.'
        );
      } else {
        setErrorMessage(
          err.message || 'Bağlantı hatası oluştu. Lütfen aşağıdaki WhatsApp butonundan bize yazınız.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Mesajı (Formdaki girilmiş bilgilerden üretilir)
  const waMessage = generateLeadWhatsAppMessage({
    productTitle: product.title,
    name: name || 'Ziyaretçi',
    phone: phone || '-',
    note: note,
  });
  const wa = buildWhatsAppLink(siteConfig.whatsappNumarasi, waMessage);

  // Başarı Ekranı
  if (success) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            {isRepeat ? 'Talebiniz Sistemimizde Kayıtlıdır' : 'Talebiniz Başarıyla Alındı'}
          </h3>

          <p className="mt-2 text-sm text-slate-600 max-w-md">
            {isRepeat
              ? 'Aynı ürün için önceki talebiniz mevcuttur. Talebiniz güncellendi ve uzman danışmanımız en kısa sürede size dönüş yapacaktır.'
              : `${product.title} için ücretsiz teklif talebiniz acentemize ulaştı. Belirttiğiniz saat aralığında uzman teknik personelimiz sizinle iletişime geçecektir.`}
          </p>

          {/* Ek WhatsApp Seçeneği */}
          <div className="mt-6 w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
            <p className="text-xs font-medium text-slate-700 mb-3">
              İsterseniz acente danışmanımıza WhatsApp üzerinden de yazabilirsiniz:
            </p>

            <a
              href={wa.primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{wa.primaryLabel}</span>
            </a>

            {!wa.isMobile && (
              <div className="mt-2">
                <a
                  href={wa.directAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1"
                >
                  <span>Uygulama ile aç</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setName('');
              setPhone('');
              setEmail('');
              setNote('');
              setProductExtra('');
              setKvkkAccepted(false);
            }}
            className="mt-6 text-xs font-semibold text-brand-dark hover:underline"
          >
            Yeni bir talep bırak
          </button>
        </div>

        <AgencyBadge className="mt-8" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">{product.title} Teklif Formu</h2>
        <p className="text-xs text-slate-500 mt-1">
          Lütfen bilgilerinizi giriniz. TC Kimlik no veya ruhsat bilgisi talep edilmez.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              {/* Hata veya Zaman Aşımı Durumunda WhatsApp Yedek Butonu */}
              <div className="mt-3 pt-3 border-t border-rose-200/60">
                <p className="text-rose-900 mb-2">WhatsApp ile doğrudan teklif isteyebilirsiniz:</p>
                <a
                  href={wa.primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{wa.primaryLabel}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Honeypot Bot Tuzağı (Kullanıcıya Görünmez) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="_gotcha"
            value={gotcha}
            onChange={(e) => setGotcha(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Ad Soyad */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
            Ad Soyad <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Ahmet Yılmaz"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none"
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
            Cep Telefonu <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={handlePhoneChange}
            placeholder="05xx xxx xx xx"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none"
          />
        </div>

        {/* E-posta (Opsiyonel) */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
            E-posta Adresi <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@alanadi.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none"
          />
        </div>

        {/* Ürüne Özel Tek Opsiyonel Alan */}
        <div>
          <label htmlFor="extra" className="block text-xs font-semibold text-slate-700 mb-1">
            {product.extraFieldLabel}
          </label>
          <input
            id="extra"
            type="text"
            value={productExtra}
            onChange={(e) => setProductExtra(e.target.value)}
            placeholder={product.extraFieldPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none"
          />
          {product.extraFieldHelp && (
            <p className="mt-1 text-[11px] text-slate-400">{product.extraFieldHelp}</p>
          )}
        </div>

        {/* Ne Zaman Aransın? */}
        <div>
          <label htmlFor="callTime" className="block text-xs font-semibold text-slate-700 mb-1">
            Ne Zaman Aranalım?
          </label>
          <select
            id="callTime"
            value={callTime}
            onChange={(e) => setCallTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none"
          >
            <option value="Fark etmez">Fark etmez</option>
            <option value="Sabah (09:00 - 12:00)">Sabah (09:00 - 12:00)</option>
            <option value="Öğleden sonra (12:00 - 15:00)">Öğleden sonra (12:00 - 15:00)</option>
            <option value="Akşamüstü (15:00 - 18:00)">Akşamüstü (15:00 - 18:00)</option>
          </select>
        </div>

        {/* Kısa Not (Maksimum 500 Karakter) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="note" className="block text-xs font-semibold text-slate-700">
              Varsa Notunuz <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">{note.length}/500</span>
          </div>
          <textarea
            id="note"
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Sigorta talebinizle ilgili eklemek istediğiniz detaylar..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-brand focus:outline-none resize-none"
          />
        </div>

        {/* KVKK ve İzin Onay Kutuları */}
        <div className="space-y-3 pt-2">
          {/* Zorunlu KVKK Onayı */}
          <div className="flex items-start gap-2.5">
            <input
              id="kvkk"
              type="checkbox"
              required
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <label htmlFor="kvkk" className="text-xs text-slate-600 leading-normal">
              <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-dark underline">
                KVKK Aydınlatma Metni
              </a>
              'ni okudum, kişisel verilerimin teklif hazırlanması amacıyla işlenmesini onaylıyorum.{' '}
              <span className="text-rose-500">*</span>
            </label>
          </div>

          {/* İsteğe Bağlı Ticari İleti İzni (Ayrı ve İşaretsiz Gelir) */}
          <div className="flex items-start gap-2.5">
            <input
              id="marketing"
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <label htmlFor="marketing" className="text-xs text-slate-600 leading-normal">
              Kampanya, bilgilendirme ve ticari elektronik iletiler almayı kabul ediyorum. (İsteğe bağlı)
            </label>
          </div>
        </div>

        {/* Gönder Butonu */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-dark active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Gönderiliyor, lütfen bekleyin...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Ücretsiz Teklif Talebini İlet</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Form Altı Acente Bilgi Bandı */}
      <AgencyBadge className="mt-8" />
    </div>
  );
};
