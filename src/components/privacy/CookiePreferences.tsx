import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { safeGetLocal, safeSetLocal } from '../../utils/storage.js';
import { Shield, X, Check, Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = '13sigorta_cookie_consent_v1';

export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const CookiePreferences: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInitialBanner, setShowInitialBanner] = useState(false);

  useEffect(() => {
    const saved = safeGetLocal(COOKIE_CONSENT_KEY);
    if (!saved) {
      // İlk ziyarette küçük bilgilendirme bandını göster
      setShowInitialBanner(true);
    }
  }, []);

  const handleAcknowledge = () => {
    const consent: CookieConsentState = {
      necessary: true,
      analytics: false, // Gelecekte eklenecek analitikler için hazır şema
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    safeSetLocal(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShowInitialBanner(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sol Altta Sabit 40px Kalkan Butonu */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md hover:bg-slate-50 hover:text-sky-700 active:scale-95 transition-all focus-visible:outline-brand"
        aria-label="Çerez ve Gizlilik Tercihleri"
        title="Çerez Tercihleri"
      >
        <Shield className="h-5 w-5 text-sky-600" />
      </button>

      {/* İlk Ziyaret Alt Bilgilendirme Bandı */}
      {showInitialBanner && !isOpen && (
        <div className="fixed bottom-16 left-4 right-4 sm:right-auto sm:max-w-md z-30 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 shrink-0">
              <Cookie className="h-4 w-4" />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-0.5">Çerez Bilgilendirmesi</p>
              Bu site yalnızca temel işlevlerin yürütülmesi için gerekli zorunlu teknik çerezleri kullanır.{' '}
              <Link to="/cerez-politikasi" className="text-sky-700 underline font-medium">
                Detaylı Bilgi
              </Link>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      {/* Tercih Modalı */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-600" />
                <h3 id="cookie-modal-title" className="font-bold text-slate-900 text-base">
                  Çerez Tercihleri
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Zorunlu Teknik Çerezler</span>
                  </span>
                  <span className="text-[11px] text-sky-700 font-mono">Aktif (Zorunlu)</span>
                </div>
                <p className="text-slate-500">
                  Sitenin temel işlevlerini yerine getirebilmesi, form oturum güvenliği ve sayfa gezinimi için teknik olarak zorunludur. Devre dışı bırakılamaz.
                </p>
              </div>

              {/* Düzeltme 4 kuralı: Sahte pazarlama anahtarları yok, açık bilgilendirme var */}
              <div className="rounded-xl border border-dashed border-slate-200 p-3.5 text-slate-500 bg-white">
                <p className="font-semibold text-slate-800 mb-1">Pazarlama ve Analitik Çerezleri:</p>
                <p>
                  Sitemizde ziyaretçileri takip eden, profil çıkaran üçüncü taraf reklam ve pazarlama çerezi kullanılmamaktadır.
                </p>
              </div>

              <p className="text-slate-500">
                Detaylı bilgi için lütfen{' '}
                <Link
                  to="/cerez-politikasi"
                  onClick={() => setIsOpen(false)}
                  className="text-sky-700 underline font-medium"
                >
                  Çerez Politikası
                </Link>{' '}
                sayfamızı inceleyiniz.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleAcknowledge}
                className="w-full sm:w-auto rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition-colors"
              >
                Tercihleri Kaydet ve Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
