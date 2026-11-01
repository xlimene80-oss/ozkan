import React from 'react';
import { X, Share, PlusSquare, CheckCircle2, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/site.js';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIos?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose, isIos = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Arka Plan Bulanıklığı */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet */}
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Mobilde Çekmece Çizgisi */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        {isIos ? (
          <div>
            {/* iOS Safari Rehberi */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-sky-500/20">
                <Smartphone className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-0.5">
                  <Sparkles className="h-3 w-3" />
                  iPhone & iPad Kurulumu
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {siteConfig.acenteKisaAd} Uygulamasını Ekleyin
                </h3>
                <p className="text-xs text-slate-500">
                  Safari üzerinden ana ekranınıza tek dokunuşla ekleyin
                </p>
              </div>
            </div>

            <div className="space-y-2.5 my-5">
              <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs">
                  1
                </div>
                <div className="text-xs text-slate-800 leading-relaxed">
                  Safari ekranının altındaki <strong className="text-sky-700 inline-flex items-center gap-1 font-bold bg-sky-100/70 px-1.5 py-0.5 rounded-md">Paylaş <Share className="h-3.5 w-3.5 inline" /></strong> simgesine dokunun.
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs">
                  2
                </div>
                <div className="text-xs text-slate-800 leading-relaxed">
                  Açılan menüden <strong className="text-sky-700 inline-flex items-center gap-1 font-bold bg-sky-100/70 px-1.5 py-0.5 rounded-md"><PlusSquare className="h-3.5 w-3.5 inline" /> Ana Ekrana Ekle</strong> seçeneğine tıklayın.
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  3
                </div>
                <div className="text-xs text-slate-800 leading-relaxed">
                  Sağ üst köşedeki <strong className="text-emerald-700 inline-flex items-center gap-1 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded-md"><CheckCircle2 className="h-3.5 w-3.5 inline" /> Ekle</strong> butonuna basarak tamamlayın.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-md shadow-sky-600/25 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.99] transition-all"
            >
              Anladım, Kapat
            </button>
          </div>
        ) : (
          <div>
            {/* Android / Masaüstü Rehberi */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-sky-500/20">
                <Monitor className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-0.5">
                  <Sparkles className="h-3 w-3" />
                  Hızlı Kurulum
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {siteConfig.acenteKisaAd} Uygulamasını Yükleyin
                </h3>
                <p className="text-xs text-slate-500">
                  Ana ekranınıza ekleyerek tam ekran deneyimi yaşayın
                </p>
              </div>
            </div>

            <div className="space-y-3 my-5 text-xs text-slate-800">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <strong className="block text-slate-900 font-bold mb-1">Android Telefonlarda:</strong>
                Tarayıcınızın sağ üstündeki <strong>üç nokta (⋮)</strong> menüsüne dokunun ve <strong>"Ana Ekrana Ekle"</strong> veya <strong>"Uygulamayı Yükle"</strong> seçeneğini seçin.
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <strong className="block text-slate-900 font-bold mb-1">Bilgisayar / Masaüstünde:</strong>
                Tarayıcınızın adres çubuğunun sağ tarafındaki <strong>"Yükle" (⊕)</strong> simgesine tıklayarak uygulamayı ekleyebilirsiniz.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-md shadow-sky-600/25 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.99] transition-all"
            >
              Tamam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
