import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { safeGetLocal, safeSetLocal } from '../../utils/storage.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Shield, X, Check, Cookie, Settings2, Lock } from 'lucide-react';

export const COOKIE_CONSENT_KEY = '13sigorta_cookie_consent';

export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  status: 'accepted' | 'rejected' | 'customized';
  timestamp: string;
}

export const CookiePreferences: React.FC = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Tercih Ayarları Toggle Durumları
  const [necessary] = useState(true); // Her zaman açık ve kilitli
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = safeGetLocal(COOKIE_CONSENT_KEY);
    if (!saved) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setAnalytics(Boolean(parsed.analytics));
        setMarketing(Boolean(parsed.marketing));
      } catch {}
    }

    // Global event dinleyicisi: Footer veya başka bir yerden çerez ayarları açılmak istendiğinde
    const handleOpenModal = () => {
      setShowModal(true);
      setShowBanner(false);
    };
    window.addEventListener('open_cookie_preferences', handleOpenModal);
    return () => window.removeEventListener('open_cookie_preferences', handleOpenModal);
  }, []);

  const saveConsent = (analyticsVal: boolean, marketingVal: boolean, status: CookieConsentState['status']) => {
    const state: CookieConsentState = {
      necessary: true,
      analytics: analyticsVal,
      marketing: marketingVal,
      status,
      timestamp: new Date().toISOString(),
    };
    safeSetLocal(COOKIE_CONSENT_KEY, JSON.stringify(state));
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true, 'accepted');
  };

  const handleRejectAll = () => {
    saveConsent(false, false, 'rejected');
  };

  const handleSaveCustom = () => {
    saveConsent(analytics, marketing, 'customized');
  };

  return (
    <>
      {/* 1. SOL ALT SABİT KURUMSAL ÇEREZ BİLDİRİM KARTI */}
      {showBanner && !showModal && (
        <div
          className="fixed bottom-5 left-5 z-50 max-w-md w-[calc(100vw-2.5rem)] sm:w-auto rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300"
          role="region"
          aria-label={isTr ? 'Çerez Onay Bildirimi' : 'Cookie Consent Banner'}
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf1fa] text-[#00357B] shrink-0 mt-0.5 shadow-xs">
              <Cookie className="h-5 w-5" />
            </div>

            <div className="flex-1 text-xs text-slate-600 leading-relaxed">
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">
                {isTr ? 'Çerez (Cookie) Kullanımı' : 'Cookie Policy Notice'}
              </h4>
              <p>
                {isTr ? (
                  <>
                    Daha iyi hizmet sunabilmek için sitemizde çerezler kullanıyoruz.{' '}
                    <Link
                      to="/cerez-politikasi"
                      className="font-bold text-[#00357B] underline hover:text-[#00224f]"
                    >
                      Çerez politikamıza
                    </Link>{' '}
                    göz atabilirsiniz.
                  </>
                ) : (
                  <>
                    We use cookies to provide a better service. You can review our{' '}
                    <Link
                      to="/cerez-politikasi"
                      className="font-bold text-[#00357B] underline hover:text-[#00224f]"
                    >
                      cookie policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>

          {/* 3 Buton: Ayarlar, Reddet, Kabul Et */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* 1. Ayarlar */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#00357B] bg-white px-3 py-2 text-xs font-bold text-[#00357B] hover:bg-[#eaf1fa] transition-colors cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>{isTr ? 'Ayarlar' : 'Settings'}</span>
            </button>

            {/* 2. Reddet */}
            <button
              type="button"
              onClick={handleRejectAll}
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>{isTr ? 'Reddet' : 'Reject'}</span>
            </button>

            {/* 3. Kabul Et */}
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-auto inline-flex items-center justify-center rounded-xl bg-[#00357B] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#00224f] active:scale-95 transition-all cursor-pointer"
            >
              <span>{isTr ? 'Kabul Et' : 'Accept All'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ÇEREZ AYARLARI AYRINTILI PENCERESİ (MODAL) */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B]">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 id="cookie-settings-title" className="font-extrabold text-slate-900 text-base">
                  {isTr ? 'Çerez Tercihleri ve Gizlilik Ayarları' : 'Cookie Preferences & Privacy'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* 1. Zorunlu Çerezler (Kilitli & Her zaman açık) */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">
                      {isTr ? 'Zorunlu Teknik Çerezler' : 'Strictly Necessary Cookies'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Lock className="h-2.5 w-2.5" />
                    <span>{isTr ? 'Zorunlu (Açık)' : 'Always Active'}</span>
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {isTr
                    ? 'Web sitemizin güvenli bir şekilde çalışması, form oturumu ve teklif sayfalarının doğru görüntülenmesi için teknik olarak zorunludur. Kapatılamaz.'
                    : 'Essential for the secure functioning of the website and cannot be switched off.'}
                </p>
              </div>

              {/* 2. Performans ve Analitik Çerezleri (Toggle) */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-white hover:border-[#00357B]/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {isTr ? 'Performans ve Analitik Çerezleri' : 'Performance & Analytics Cookies'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00357B]"></div>
                  </label>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {isTr
                    ? 'Sitemizi nasıl kullandığınızı anonim verilerle anlamamıza ve kullanıcı deneyimini iyileştirmemize olanak tanır.'
                    : 'Helps us measure site traffic and understand visitor usage anonymously.'}
                </p>
              </div>

              {/* 3. Pazarlama ve Kampanya Çerezleri (Toggle) */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-white hover:border-[#00357B]/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {isTr ? 'Pazarlama ve Reklam Çerezleri' : 'Marketing & Advertising Cookies'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00357B]"></div>
                  </label>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {isTr
                    ? 'İlgi alanlarınıza uygun kişiselleştirilmiş sigorta teklifleri ve kampanyaları sunmamızı sağlar.'
                    : 'Allows us to offer tailored insurance campaigns and relevant promotions.'}
                </p>
              </div>

              <div className="pt-2 text-slate-500 text-[11px] leading-relaxed">
                {isTr ? (
                  <>
                    Ayrıntılı yasal bilgi için{' '}
                    <Link
                      to="/cerez-politikasi"
                      onClick={() => setShowModal(false)}
                      className="text-[#00357B] font-bold underline"
                    >
                      13 Sigorta Çerez Politikası ve KVKK Aydınlatma Metni
                    </Link>
                    'ni inceleyebilirsiniz.
                  </>
                ) : (
                  <>
                    For detailed legal information, please see our{' '}
                    <Link
                      to="/cerez-politikasi"
                      onClick={() => setShowModal(false)}
                      className="text-[#00357B] font-bold underline"
                    >
                      Cookie Policy & Privacy Notice
                    </Link>
                    .
                  </>
                )}
              </div>
            </div>

            {/* Modal Eylem Butonları */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap sm:flex-nowrap justify-end gap-2.5">
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {isTr ? 'Tümünü Reddet' : 'Reject All'}
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto rounded-xl bg-[#00357B] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#00224f] transition-all"
              >
                {isTr ? 'Tercihleri Kaydet' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
