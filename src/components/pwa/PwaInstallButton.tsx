import React from 'react';
import { Smartphone, Sparkles } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall.js';
import { PwaInstallModal } from './PwaInstallModal.js';

interface PwaInstallButtonProps {
  variant?: 'header' | 'admin' | 'drawer' | 'mobile-nav';
  className?: string;
  showSubtitle?: boolean;
}

export const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({
  variant = 'header',
  className = '',
  showSubtitle = true,
}) => {
  const {
    isInstallable,
    isStandalone,
    isIos,
    showModal,
    setShowModal,
    triggerInstall,
  } = usePwaInstall();

  // Zaten ana ekrandan uygulama modunda çalışıyorsa butonu gizle
  if (isStandalone || !isInstallable) {
    return null;
  }

  // 1. Masaüstü Header Navigasyon Butonu
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-3.5 py-2 text-xs xl:text-sm font-bold text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-300/40 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 hover:shadow-lg active:scale-95 transition-all cursor-pointer ${className}`}
          title="13 Sigorta Uygulamasını Ana Ekranınıza Ekleyin"
          aria-label="Uygulamayı Yükle"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20 text-white">
            <Smartphone className="h-3.5 w-3.5" />
          </div>
          <span className="hidden xl:inline tracking-tight">Uygulamayı Yükle</span>
          <span className="xl:hidden tracking-tight">Uygulama</span>
          <span className="inline-flex items-center rounded-md bg-white/25 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
            PWA
          </span>
        </button>

        <PwaInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isIos={isIos}
        />
      </>
    );
  }

  // 2. Mobil Navbar İçindeki Hızlı Buton
  if (variant === 'mobile-nav') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-sky-500/25 ring-1 ring-sky-300/40 active:scale-95 transition-all cursor-pointer ${className}`}
          title="Uygulamayı Ana Ekrana Ekleyin"
          aria-label="Uygulamayı Yükle"
        >
          <Smartphone className="h-3.5 w-3.5 text-cyan-100" />
          <span className="tracking-tight">Uygulamayı Yükle</span>
        </button>

        <PwaInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isIos={isIos}
        />
      </>
    );
  }

  // 3. Mobil Çekmece (Hamburger Menü) İçi Tam Genişlikli Kart
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 p-4 text-white shadow-lg shadow-sky-600/20 ring-1 ring-white/20 active:scale-[0.99] transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold leading-tight tracking-tight flex items-center gap-1.5">
                <span>Uygulamayı Yükle</span>
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              </div>
              <div className="text-[11px] text-cyan-100 font-medium mt-0.5">
                Ana ekrana ekle, tek dokunuşla aç
              </div>
            </div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
            <Smartphone className="h-4 w-4" />
          </div>
        </button>

        <PwaInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isIos={isIos}
        />
      </>
    );
  }

  // 4. Admin Giriş Ekranı Kartı
  return (
    <>
      <div className={`rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/90 to-cyan-50/40 p-4 shadow-sm text-center ${className}`}>
        <button
          type="button"
          onClick={triggerInstall}
          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-300/40 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Smartphone className="h-4 w-4 text-cyan-100" />
          <span className="tracking-tight">Uygulamayı Yükle</span>
          <span className="inline-flex items-center rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
            PWA
          </span>
        </button>

        {showSubtitle && (
          <p className="text-[11px] font-medium text-slate-600 mt-2.5 leading-tight">
            Telefonunuza ekleyerek gelen yeni talepleri tek dokunuşla cebinizden yönetin.
          </p>
        )}
      </div>

      <PwaInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIos={isIos}
      />
    </>
  );
};
