import React from 'react';
import { X, Share, PlusSquare, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import { siteConfig } from '../../config/site.js';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIos?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose, isIos = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        {isIos ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {siteConfig.acenteKisaAd} Uygulamasını Yükleyin
                </h3>
                <p className="text-xs text-slate-500">
                  iPhone / iPad Safari Kurulum Adımları
                </p>
              </div>
            </div>

            <div className="space-y-3.5 my-5">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">
                  1
                </div>
                <div className="text-xs text-slate-700">
                  Safari ekranının en altındaki <strong className="text-sky-700 inline-flex items-center gap-1 font-semibold">Paylaş <Share className="h-3.5 w-3.5 inline" /></strong> simgesine dokunun.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">
                  2
                </div>
                <div className="text-xs text-slate-700">
                  Açılan menüyü aşağı kaydırarak <strong className="text-sky-700 inline-flex items-center gap-1 font-semibold"><PlusSquare className="h-3.5 w-3.5 inline" /> Ana Ekrana Ekle</strong> seçeneğine tıklayın.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-xs">
                  3
                </div>
                <div className="text-xs text-slate-700">
                  Sağ üst köşede yer alan <strong className="text-emerald-700 inline-flex items-center gap-1 font-semibold"><CheckCircle className="h-3.5 w-3.5 inline" /> Ekle</strong> butonuna basın.
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mb-5 leading-relaxed">
              Uygulama telefonunuzun ana ekranına eklenir ve tek dokunuşla adres çubuğu olmadan tam ekran açılır.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-sky-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 active:scale-[0.99] transition-all"
            >
              Anladım, Kapat
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {siteConfig.acenteKisaAd} Uygulama Kurulumu
                </h3>
                <p className="text-xs text-slate-500">
                  Hızlı Masaüstü ve Mobil Kurulum
                </p>
              </div>
            </div>

            <div className="space-y-3 my-5 text-xs text-slate-700">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <strong className="block text-slate-900 font-semibold mb-1">Android Cihazlarda:</strong>
                Tarayıcınızın sağ üstündeki <strong>üç nokta (⋮)</strong> menüsüne dokunun ve <strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                <strong className="block text-slate-900 font-semibold mb-1">Bilgisayar / Masaüstünde:</strong>
                Chrome veya Edge tarayıcınızın adres çubuğunun sağında beliren <strong>"Yükle" (⊕)</strong> simgesine tıklayarak uygulamayı bilgisayarınıza kurabilirsiniz.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-sky-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 active:scale-[0.99] transition-all"
            >
              Tamam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
