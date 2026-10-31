import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { FileText, ShieldAlert } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();

  let title = 'Hukuki Bilgilendirme';
  if (location.pathname.includes('kvkk')) {
    title = 'KVKK Aydınlatma Metni';
  } else if (location.pathname.includes('gizlilik')) {
    title = 'Gizlilik Politikası';
  } else if (location.pathname.includes('cerez')) {
    title = 'Çerez (Cookie) Politikası';
  } else if (location.pathname.includes('kullanim-sartlari')) {
    title = 'Kullanım Şartları';
  }

  // Düzeltme 7: Arama motorlarının yer tutucu sayfaları dizine eklemesini engelle (noindex)
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow');

    return () => {
      metaTag?.setAttribute('content', 'index, follow');
    };
  }, [location.pathname]);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block rounded-md bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Yasal Bilgilendirme
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Yasal Metin Alanı</span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 leading-relaxed">
            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="font-medium text-slate-700">Bu metin acente yetkilisi tarafından eklenecektir.</p>
          </div>
        </div>

        <AgencyBadge className="mt-8" />
      </div>
    </div>
  );
};
