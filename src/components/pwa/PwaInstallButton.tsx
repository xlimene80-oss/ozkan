import React from 'react';
import { Smartphone, Download, Sparkles } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall.js';
import { PwaInstallModal } from './PwaInstallModal.js';

interface PwaInstallButtonProps {
  variant?: 'header' | 'admin' | 'drawer' | 'inline';
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
    showIosModal,
    setShowIosModal,
    showGenericModal,
    setShowGenericModal,
    triggerInstall,
  } = usePwaInstall();

  // Kullanıcı zaten standalone uygulama modunda çalıştırıyorsa butonu gösterme
  if (isStandalone || !isInstallable) {
    return null;
  }

  // Header Navigasyon Butonu
  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white px-3.5 py-2 text-sm font-semibold shadow-xs transition-all ${className}`}
          title="13 Sigorta Mobil Uygulamasını Cihazınıza İndirin"
          aria-label="Mobil Uygulamayı İndir"
        >
          <Smartphone className="h-4 w-4 text-sky-100 shrink-0" />
          <span className="hidden xl:inline">Mobil Uygulamayı İndir</span>
          <span className="xl:hidden">Uygulamayı İndir</span>
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

  // Mobil Çekmece (Hamburger Menü) Butonu
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`w-full flex items-center justify-between rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white p-3.5 shadow-sm transition-all ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold leading-tight">Mobil Uygulamayı İndir</div>
              <div className="text-[11px] text-sky-100">Ana ekrana ekle, tek tıkla aç</div>
            </div>
          </div>
          <Download className="h-4 w-4 text-sky-200" />
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

  // Admin Giriş Ekranı Butonu
  if (variant === 'admin') {
    return (
      <>
        <div className={`rounded-xl border border-sky-100 bg-sky-50/70 p-3.5 text-center ${className}`}>
          <button
            type="button"
            onClick={triggerInstall}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white py-2.5 px-3 text-xs font-semibold shadow-xs transition-all"
          >
            <Smartphone className="h-4 w-4 text-sky-100 shrink-0" />
            <span>Mobil Uygulamayı İndir</span>
          </button>
          {showSubtitle && (
            <p className="text-[11px] text-slate-500 mt-2 leading-tight">
              Telefonunuza kurarak gelen yeni talepleri tek dokunuşla cebinizden yönetin.
            </p>
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
  }

  // Sade Satır İçi Buton
  return (
    <>
      <button
        type="button"
        onClick={triggerInstall}
        className={`inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white px-4 py-2 text-sm font-semibold shadow-xs transition-all ${className}`}
      >
        <Smartphone className="h-4 w-4 text-sky-100 shrink-0" />
        <span>Mobil Uygulamayı İndir</span>
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
};
