import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../../config/site.js';
import { safeGetSession, safeSetSession } from '../../utils/storage.js';
import { buildWhatsAppLink, generateLeadWhatsAppMessage } from '../../utils/whatsapp.js';
import { API_BASE_URL } from '../../config/api.js';
import {
  Bot,
  X,
  Send,
  MessageCircle,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const CONSULTANT_BALLOON_KEY = '13sigorta_consultant_balloon_shown';

export const ConsultantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(false);

  // Form Verileri
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [gotcha, setGotcha] = useState('');
  const formStartTimeRef = useRef<number>(Date.now());

  // Gönderim Durumları
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref & Focus Trap
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // 5 Saniye Sonra Balon Gösterimi (Oturumda bir kez - sessionStorage)
  useEffect(() => {
    const hasShown = safeGetSession(CONSULTANT_BALLOON_KEY);
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowBalloon(true);
        safeSetSession(CONSULTANT_BALLOON_KEY, 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Esc Tuşu ile Kapatma ve Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      firstInputRef.current?.focus();
      formStartTimeRef.current = Date.now();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (val.length > 15) val = val.substring(0, 15);
    setPhone(val);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowBalloon(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Lütfen geçerli bir cep telefonu numarası giriniz (05xx...).');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage('Mesajınız en az 10 karakter olmalıdır.');
      return;
    }
    if (!kvkkAccepted) {
      setErrorMessage('Devam etmek için KVKK onayını vermeniz gerekmektedir.');
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_page: window.location.pathname,
          product_slug: 'danisman',
          name: name.trim(),
          phone: phone.trim(),
          note: message.trim(),
          kvkk_accepted: kvkkAccepted,
          consent_version: siteConfig.consentVersion,
          _gotcha: gotcha,
          form_start_time: formStartTimeRef.current,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Mesaj iletilemedi.');
      }

      setSuccess(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorMessage('Bağlantı zaman aşımına uğradı. Beklemeden WhatsApp ile yazabilirsiniz.');
      } else {
        setErrorMessage(err.message || 'Bağlantı hatası. WhatsApp ile yazabilirsiniz.');
      }
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Mesajı
  const waMsg = generateLeadWhatsAppMessage({
    productTitle: 'Danışman Bilgi Talebi',
    name: name || 'Ziyaretçi',
    phone: phone || '-',
    note: message,
  });
  const wa = buildWhatsAppLink(siteConfig.whatsappNumarasi, waMsg);

  return (
    <>
      {/* 5 Sn Sonra Açılan "Yardıma mı ihtiyacınız var?" Balonu */}
      {showBalloon && !isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-30 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 shrink-0">
            <Bot className="h-4 w-4" />
          </div>
          <div className="text-xs text-slate-700 leading-tight">
            <p className="font-semibold text-slate-900 mb-0.5">Yardıma mı ihtiyacınız var?</p>
            <p className="text-slate-500">Sigorta danışmanımıza anında mesaj bırakabilirsiniz.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowBalloon(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 ml-1"
            aria-label="Balonu kapat"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Sağ Altta Sabit 56-60px Yuvarlak Danışman Butonu (Online yeşil nokta YOK, 3 pulse yapıp durur) */}
      <button
        type="button"
        onClick={handleToggle}
        className="animate-widget-three fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-xl hover:bg-sky-700 active:scale-95 transition-all focus-visible:outline-brand focus-visible:outline-2"
        aria-label="Sigorta Danışmanına Yazın"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
      </button>

      {/* Danışman Paneli: Masaüstünde 360px kart, mobilde max 90dvh alttan açılan bottom sheet */}
      {isOpen && (
        <div
          className="fixed inset-0 sm:inset-auto sm:bottom-22 sm:right-6 z-50 flex items-end sm:items-start justify-center p-0 sm:p-0 bg-slate-900/30 sm:bg-transparent"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultant-title"
          ref={modalRef}
        >
          {/* Mobil Arka Plan Overlay (Tıklayınca Kapatır) */}
          <div
            className="fixed inset-0 bg-transparent sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full sm:w-[360px] max-h-[90dvh] sm:max-h-[620px] rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Panel Başlığı */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-sky-700 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 id="consultant-title" className="font-bold text-sm leading-tight">
                    {siteConfig.danismanAdi}
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] text-sky-100/90 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{siteConfig.calismaSaatleri.split('|')[0]}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel İçeriği */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Karşılama Balonu */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-100 p-3 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                  Merhaba! Size hangi sigorta ürünü konusunda yardımcı olabiliriz? Mesajınızı iletin, en kısa sürede dönüş yapalım.
                </div>
              </div>

              {/* Başarı Ekranı */}
              {success ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Mesajınız Alındı</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Talebiniz danışmanımıza iletildi. En kısa sürede sizinle iletişime geçeceğiz.
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">WhatsApp üzerinden de yazabilirsiniz:</p>
                    <a
                      href={wa.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{wa.primaryLabel}</span>
                    </a>
                    {!wa.isMobile && (
                      <div className="mt-1.5 text-center">
                        <a
                          href={wa.directAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-slate-700 underline inline-flex items-center gap-1"
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
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-sky-700 hover:underline pt-2 block mx-auto"
                  >
                    Yeni bir mesaj yaz
                  </button>
                </div>
              ) : (
                /* Danışman Formu */
                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  {errorMessage && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 space-y-2">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                      <div className="pt-1 border-t border-rose-200/60">
                        <a
                          href={wa.primaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp ile yazın</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Honeypot Spam Tuzağı */}
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
                    <label htmlFor="w-name" className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Ad Soyad <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="w-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ahmet Yılmaz"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label htmlFor="w-phone" className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Telefon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="w-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="05xx xxx xx xx"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  {/* Mesaj (10-1000 krkt sayaçlı) */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label htmlFor="w-msg" className="block text-[11px] font-semibold text-slate-700">
                        Mesajınız <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {message.length}/1000
                      </span>
                    </div>
                    <textarea
                      id="w-msg"
                      rows={3}
                      maxLength={1000}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hangi sigorta konusunda bilgi almak istiyorsunuz?"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none resize-none"
                    />
                  </div>

                  {/* KVKK Onay Kutusu */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="w-kvkk"
                      type="checkbox"
                      required
                      checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="w-kvkk" className="text-[11px] text-slate-600 leading-tight">
                      <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline font-medium">
                        KVKK Aydınlatma Metni
                      </a>
                      'ni onaylıyorum. <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Gönder Butonu */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 active:scale-[0.98] disabled:opacity-60 transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Mesajı İlet</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
