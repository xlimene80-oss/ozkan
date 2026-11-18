import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../../config/site.js';
import { safeGetSession, safeSetSession } from '../../utils/storage.js';
import { buildWhatsAppLink, generateLeadWhatsAppMessage } from '../../utils/whatsapp.js';
import { API_BASE_URL, parseJsonResponse } from '../../config/api.js';
import { useLanguage } from '../../context/LanguageContext.js';
import {
  X,
  Send,
  MessageCircle,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const CONSULTANT_BALLOON_KEY = '13sigorta_robot_balloon_interacted';

export const ConsultantWidget: React.FC = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  const bubbleMessages = isTr
    ? [
        'Size nasıl yardımcı olabilirim? 👋',
        'Hemen teklif alalım! ✨',
        'Sorularınız için buradayım! 💬',
        'Allianz avantajlarını keşfedin! 🛡️',
      ]
    : [
        'How can I help you? 👋',
        'Get a fast quote! ✨',
        'I am here for your questions! 💬',
        'Explore Allianz benefits! 🛡️',
      ];

  // Konuşma Balonunu Belirli Aralıklarla Değiştirme
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % bubbleMessages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [bubbleMessages.length]);

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
    setShowBubble(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage(isTr ? 'Lütfen adınızı ve soyadınızı giriniz.' : 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage(
        isTr
          ? 'Lütfen geçerli bir cep telefonu numarası giriniz (05xx...).'
          : 'Please enter a valid phone number.'
      );
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage(
        isTr ? 'Mesajınız en az 10 karakter olmalıdır.' : 'Message must be at least 10 characters.'
      );
      return;
    }
    if (!kvkkAccepted) {
      setErrorMessage(
        isTr ? 'Devam etmek için KVKK onayını vermeniz gerekmektedir.' : 'Please accept the privacy policy.'
      );
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
      const data = await parseJsonResponse(res);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Mesaj iletilemedi.');
      }

      setSuccess(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorMessage(
          isTr
            ? 'Bağlantı zaman aşımına uğradı. Beklemeden WhatsApp ile yazabilirsiniz.'
            : 'Connection timeout. You can message us via WhatsApp.'
        );
      } else {
        setErrorMessage(err.message || (isTr ? 'Bağlantı hatası oluştu.' : 'Connection error.'));
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
      {/* Sevimli Konuşma Balonu (Robotun Hemen Üstünde) */}
      {showBubble && !isOpen && (
        <div
          onClick={handleToggle}
          className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-[220px] sm:max-w-[240px] rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 group animate-speech-bubble"
          role="button"
          tabIndex={0}
          aria-label="Yardımcı Robot Mesajı"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-[#00357B] transition-colors leading-tight">
              {bubbleMessages[bubbleIndex]}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded shrink-0"
              aria-label="Balonu Kapat"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Konuşma Balonunun Küçük Oku */}
          <div className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-r border-b border-slate-200 bg-white" />
        </div>
      )}

      {/* CANLI VE HAREKETLİ (OYNAK) YARDIMCI ROBOT ASİSTAN BUTONU */}
      <div
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex flex-col items-center select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={handleToggle}
          className={`relative flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
            isHovered
              ? 'scale-110 -rotate-3 drop-shadow-[0_12px_24px_rgba(0,53,123,0.4)]'
              : 'animate-robot-alive drop-shadow-[0_8px_18px_rgba(0,53,123,0.25)]'
          }`}
          aria-label={isTr ? 'Yardımcı Robot Asistan' : 'Virtual Assistant Robot'}
          aria-expanded={isOpen}
          title={isTr ? '13 Sigorta Akıllı Asistan' : '13 Insurance Smart Assistant'}
        >
          {isOpen ? (
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#00357B] text-white shadow-2xl hover:bg-[#00224f] transition-all border-2 border-white">
              <X className="h-7 w-7" />
            </div>
          ) : (
            <div className="relative">
              {/* Canlı Robot İmajı (Tam Renkli, Canlı ve Net) */}
              <img
                src="/assistant/robot-wave-256.png"
                alt="13 Sigorta Akıllı Asistan Robotu"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain pointer-events-none transition-transform duration-300 opacity-100"
                style={{ opacity: 1, mixBlendMode: 'normal' }}
                onError={(e) => {
                  e.currentTarget.src = '/assistant/robot-wave-512.png';
                }}
              />
              {/* Minik Canlı Durum Rozeti */}
              <span className="absolute bottom-1 right-2 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Danışman Paneli Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 sm:inset-auto sm:bottom-22 sm:right-6 z-50 flex items-end sm:items-start justify-center p-0 sm:p-0 bg-slate-900/30 sm:bg-transparent"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultant-title"
          ref={modalRef}
        >
          {/* Mobil Arka Plan Overlay */}
          <div
            className="fixed inset-0 bg-transparent sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full sm:w-[380px] max-h-[90dvh] sm:max-h-[640px] rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Panel Başlığı: Allianz Laciverti & Robot İkonu */}
            <div className="flex items-center justify-between border-b border-blue-900/40 bg-[#00357B] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 p-1 shadow-inner">
                  <img
                    src="/assistant/robot-wave-128.png"
                    alt="Robot"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <h3 id="consultant-title" className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                    <span>{siteConfig.danismanAdi}</span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] text-blue-100/90 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>7/24 Kesintisiz Danışma & Destek</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel İçeriği */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Karşılama Balonu */}
              <div className="flex items-start gap-2.5">
                <img
                  src="/assistant/robot-wave-128.png"
                  alt="Robot"
                  className="h-7 w-7 object-contain shrink-0 mt-0.5"
                />
                <div className="rounded-2xl rounded-tl-none bg-[#eaf1fa] p-3 text-xs text-slate-800 leading-relaxed border border-blue-100">
                  {isTr
                    ? 'Merhaba! Ben 13 Sigorta akıllı asistanınız. Hangi sigorta ürünü veya kampanya hakkında bilgi almak istersiniz?'
                    : 'Hello! I am your 13 Insurance assistant. How can I help you today?'}
                </div>
              </div>

              {/* Başarı Ekranı */}
              {success ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isTr ? 'Mesajınız Alındı!' : 'Message Received!'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isTr
                      ? 'Talebiniz uzman acente danışmanımıza iletildi. En kısa sürede sizinle iletişime geçeceğiz.'
                      : 'Your request has been received. Our certified agent will get in touch shortly.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">
                      {isTr ? 'Beklemeden WhatsApp üzerinden de yazabilirsiniz:' : 'Or message directly on WhatsApp:'}
                    </p>
                    <a
                      href={wa.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{wa.primaryLabel}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-[#00357B] hover:underline pt-2 block mx-auto"
                  >
                    {isTr ? 'Yeni bir mesaj yaz' : 'Write another message'}
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
                    <label htmlFor="w-name" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      {isTr ? 'Ad Soyad' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="w-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ahmet Yılmaz"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label htmlFor="w-phone" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      {isTr ? 'Cep Telefonu' : 'Mobile Phone'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="w-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="05xx xxx xx xx"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                    />
                  </div>

                  {/* Mesaj */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label htmlFor="w-msg" className="block text-[11px] font-bold text-slate-700">
                        {isTr ? 'Mesajınız' : 'Message'} <span className="text-rose-500">*</span>
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
                      placeholder={
                        isTr
                          ? 'Kasko, Sağlık, BES veya diğer sigorta talepleriniz...'
                          : 'Car, Health, Pension or other requests...'
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none resize-none"
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
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#00357B] focus:ring-[#00357B]"
                    />
                    <label htmlFor="w-kvkk" className="text-[11px] text-slate-600 leading-tight">
                      <a href="/cerez-politikasi" target="_blank" rel="noopener noreferrer" className="text-[#00357B] underline font-bold">
                        {isTr ? 'KVKK Aydınlatma Metni' : 'Privacy Policy'}
                      </a>
                      {isTr ? '\'ni onaylıyorum.' : ' I accept.'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Gönder Butonu */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00357B] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#00224f] active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{isTr ? 'Gönderiliyor...' : 'Sending...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>{isTr ? 'Talebimi Danışmana İlet' : 'Send to Agent'}</span>
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
