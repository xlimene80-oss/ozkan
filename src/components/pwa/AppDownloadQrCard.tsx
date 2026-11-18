import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { usePwaInstall } from '../../hooks/usePwaInstall.js';
import { PwaInstallModal } from './PwaInstallModal.js';
import { COOKIE_CONSENT_KEY } from '../privacy/CookiePreferences.js';
import { safeGetLocal } from '../../utils/storage.js';
import { X, Smartphone, QrCode, Sparkles } from 'lucide-react';

export const AppDownloadQrCard: React.FC = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [dismissed, setDismissed] = useState(false);
  const [hasCookieBanner, setHasCookieBanner] = useState(!safeGetLocal(COOKIE_CONSENT_KEY));
  const { triggerInstall, showModal, setShowModal, isIos, isStandalone } = usePwaInstall();

  useEffect(() => {
    const handler = () => {
      setHasCookieBanner(!safeGetLocal(COOKIE_CONSENT_KEY));
    };
    window.addEventListener('cookie_consent_changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('cookie_consent_changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Zaten PWA modunda çalışıyorsa veya kullanıcı kapattıysa gösterme
  if (dismissed || isStandalone) return null;

  return (
    <>
      <div
        className={`hidden lg:flex fixed ${
          hasCookieBanner ? 'bottom-56' : 'bottom-5'
        } left-5 z-40 items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-[#00357B]/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 group cursor-pointer`}
        onClick={triggerInstall}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerInstall();
          }
        }}
        aria-label="13 Sigorta Uygulamasını İndirin"
      >
        {/* Kapatma Butonu */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors shadow-xs"
          aria-label="Kapat"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Yerel Vektörel QR Kod (Zero External Failure Risk) */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 group-hover:scale-105 transition-transform">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            fill="#00357B"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Finder 1 (Top-Left) */}
            <rect x="5" y="5" width="28" height="28" rx="4" fill="#00357B" />
            <rect x="11" y="11" width="16" height="16" rx="2" fill="#FFFFFF" />
            <rect x="15" y="15" width="8" height="8" rx="1" fill="#00357B" />

            {/* Finder 2 (Top-Right) */}
            <rect x="67" y="5" width="28" height="28" rx="4" fill="#00357B" />
            <rect x="73" y="11" width="16" height="16" rx="2" fill="#FFFFFF" />
            <rect x="77" y="15" width="8" height="8" rx="1" fill="#00357B" />

            {/* Finder 3 (Bottom-Left) */}
            <rect x="5" y="67" width="28" height="28" rx="4" fill="#00357B" />
            <rect x="11" y="73" width="16" height="16" rx="2" fill="#FFFFFF" />
            <rect x="15" y="77" width="8" height="8" rx="1" fill="#00357B" />

            {/* Timing & Data Pattern Dots */}
            <rect x="38" y="9" width="6" height="6" rx="1" />
            <rect x="50" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="38" width="6" height="6" rx="1" />
            <rect x="9" y="50" width="6" height="6" rx="1" />
            <rect x="38" y="20" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="50" y="23" width="7" height="6" rx="1" fill="#0284c7" />
            <rect x="38" y="38" width="8" height="8" rx="1" fill="#00357B" />
            <rect x="54" y="38" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="68" y="38" width="7" height="7" rx="1" fill="#0284c7" />
            <rect x="82" y="38" width="7" height="7" rx="1" fill="#00357B" />

            <rect x="38" y="52" width="7" height="7" rx="1" fill="#0284c7" />
            <rect x="52" y="52" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="68" y="52" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="82" y="52" width="7" height="7" rx="1" fill="#0284c7" />

            <rect x="38" y="68" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="52" y="68" width="7" height="7" rx="1" fill="#0284c7" />
            <rect x="68" y="68" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="82" y="68" width="7" height="7" rx="1" fill="#00357B" />

            <rect x="38" y="82" width="7" height="7" rx="1" fill="#0284c7" />
            <rect x="52" y="82" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="68" y="82" width="7" height="7" rx="1" fill="#00357B" />
            <rect x="82" y="82" width="7" height="7" rx="1" fill="#0284c7" />
          </svg>

          {/* Mini Center Emblem */}
          <div className="absolute inset-0 m-auto flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs border border-blue-200">
            <span className="text-[8px] font-black font-mono text-[#00357B]">13</span>
          </div>
        </div>

        {/* Metin & İkon Alanı */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <Smartphone className="h-3.5 w-3.5 text-[#00357B]" />
            <span className="text-xs font-black text-slate-900 group-hover:text-[#00357B] transition-colors tracking-tight">
              {isTr ? '13 Sigorta App\'i İndirin' : 'Download 13 Sigorta App'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            {isTr ? 'Kameranızla okutun veya tıklayın' : 'Scan with camera or click to install'}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-[#eaf1fa] px-1.5 py-0.2 text-[10px] font-bold text-[#00357B]">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Hızlı PWA</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              iOS & Android
            </span>
          </div>
        </div>
      </div>

      <PwaInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIos={isIos}
      />
    </>
  );
};
