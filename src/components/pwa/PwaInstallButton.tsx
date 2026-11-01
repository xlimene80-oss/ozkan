import React from 'react';
import { Download, ArrowDownToLine, Sparkles, ShieldCheck } from 'lucide-react';
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
    showIosModal,
    setShowIosModal,
    showGenericModal,
    setShowGenericModal,
    triggerInstall,
  } = usePwaInstall();

  // Zaten yüklü ve standalone açılmışsa butonu gizle
  if (isStandalone || !isInstallable) {
    return null;
  }

  // 1. Masaüstü Header Navigasyon Butonu (Vibrant Gradient & Glow)
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-3.5 py-2 text-xs xl:text-sm font-bold text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-sky-500/35 hover:ring-sky-400 active:scale-95 transition-all cursor-pointer ${className}`}
          title="13 Sigorta Mobil Uygulamasını Güvenle İndirin"
          aria-label="Mobil Uygulamayı İndir"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20 text-white transition-transform group-hover:translate-y-0.5">
            <ArrowDownToLine className="h-3.5 w-3.5" />
          </div>
          <span className="hidden xl:inline tracking-tight">Mobil Uygulamayı İndir</span>
          <span className="xl:hidden tracking-tight">Uygulamayı İndir</span>
          <span className="inline-flex items-center rounded-md bg-white/25 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
            PWA
          </span>
        </button>

        <PwaInstallModal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          isIos={true}
        />
        <PwaInstallModal
          isOpen={showGenericModal}
          onClose={() => setShowGenericModal(false)}
          isIos={false}
        />
      </>
    );
  }

  // 2. Mobilde Navbar İçindeki Dikkat Çekici Canlı Buton
  if (variant === 'mobile-nav') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-sky-500/30 ring-1 ring-sky-300/40 active:scale-95 transition-all cursor-pointer ${className}`}
          title="Uygulamayı Güvenle Yükleyin"
          aria-label="Uygulamayı İndir"
        >
          <ArrowDownToLine className="h-3.5 w-3.5 text-cyan-100 animate-pulse" />
          <span className="tracking-tight">Uygulamayı İndir</span>
        </button>

        <PwaInstallModal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          isIos={true}
        />
        <PwaInstallModal
          isOpen={showGenericModal}
          onClose={() => setShowGenericModal(false)}
          isIos={false}
        />
      </>
    );
  }

  // 3. Mobil Çekmece (Hamburger Menü) İçi Tam Genişlikli Canlı Kart
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`group w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 p-4 text-white shadow-lg shadow-sky-600/30 ring-1 ring-white/25 active:scale-[0.99] transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs group-hover:scale-105 transition-transform">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold leading-tight tracking-tight flex items-center gap-1.5">
                <span>Mobil Uygulamayı İndir</span>
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              </div>
              <div className="text-[11px] text-cyan-100 font-medium mt-0.5">
                Ana ekrana ekle, tek tıkla aç
              </div>
            </div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
            <Download className="h-4 w-4" />
          </div>
        </button>

        <PwaInstallModal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          isIos={true}
        />
        <PwaInstallModal
          isOpen={showGenericModal}
          onClose={() => setShowGenericModal(false)}
          isIos={false}
        />
      </>
    );
  }

  // 4. Admin Giriş Ekranı Canlı Kartı (Vibrant Card + Güvenlik Mührü)
  return (
    <>
      <div className={`rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/90 to-cyan-50/50 p-4 shadow-sm text-center ${className}`}>
        <button
          type="button"
          onClick={triggerInstall}
          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 active:scale-[0.99] transition-all cursor-pointer"
        >
          <ArrowDownToLine className="h-4 w-4 text-cyan-100 group-hover:translate-y-0.5 transition-transform" />
          <span className="tracking-tight">Mobil Uygulamayı İndir</span>
          <span className="inline-flex items-center rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
            PWA
          </span>
        </button>

        {showSubtitle && (
          <div className="mt-2.5 space-y-1">
            <p className="text-[11px] font-medium text-slate-600 leading-tight">
              Telefonunuza kurarak gelen yeni talepleri tek dokunuşla cebinizden yönetin.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Google Play Protect ve Apple standartlarında güvenli PWA</span>
            </div>
          </div>
        )}
      </div>

      <PwaInstallModal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
        isIos={true}
      />
      <PwaInstallModal
        isOpen={showGenericModal}
        onClose={() => setShowGenericModal(false)}
        isIos={false}
      />
    </>
  );
};
