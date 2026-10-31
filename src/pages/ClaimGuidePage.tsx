import React from 'react';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { Phone, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const ClaimGuidePage: React.FC = () => {
  const hasarHatti = siteConfig.hasarHatti || 'Bilgi acente tarafından eklenecektir.';
  const hasarBilgiNotu = siteConfig.hasarBilgiNotu || 'Bilgi acente tarafından eklenecektir.';

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Başlık Alanı */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block rounded-md bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
            Rehber & Destek
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hasar Anında Ne Yapmalısınız?
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Hasar anında panik yapmadan aşağıdaki temel adımları izleyebilir, acentemizden dosya takibi için destek alabilirsiniz.
          </p>
        </div>

        {/* İhbar ve Acente İletişim Bandı */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-6 sm:p-8 mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Acente Hasar Destek Hattı
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                {hasarHatti}
              </p>
              <p className="text-xs text-slate-600 mt-1">{hasarBilgiNotu}</p>
            </div>
            <a
              href={siteConfig.telefon}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Acenteyi Ara</span>
            </a>
          </div>
        </div>

        {/* Temel Hasar Adımları */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Hasar Türüne Göre Genel İzlenecek Adımlar</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900 mb-1">1. Trafik ve Kasko Hasarları:</h3>
                <p className="leading-relaxed">
                  Can güvenliğinizi sağlayınız. Çift taraflı maddi hasarlı kazalarda taraflarla birlikte Maddi Hasarlı Trafik Kazası Tespit Tutanağı düzenleyiniz ve olay yeri fotoğraflarını çekiniz. Yaralanma veya kamu malı hasarı durumunda trafik polisine veya jandarmaya haber veriniz.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900 mb-1">2. Konut ve İş Yeri Hasarları:</h3>
                <p className="leading-relaxed">
                  Hasarın büyümesini önleyici acil tedbirleri alınız. Yangın ve patlama hallerinde derhal İtfaiye raporu, hırsızlık durumunda ise gecikmeksizin Polis/Jandarma ifade ve görgü tutanağı tanzim ettiriniz.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-900 mb-1">3. Acentenize Bilgi Verin:</h3>
                <p className="leading-relaxed">
                  Hasar evraklarınız ve poliçe numaranız ile birlikte acentemize başvurunuz. Uzman teknik personelimiz eksper ataması ve dosya takibi konusunda rehberlik edecektir.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-600" />
              <span>Hasar İhbarında Bulunması Gereken Temel Evraklar</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Poliçe Numarası ve Sigortalı Bilgileri</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Kaza / Olay Tespit Tutanağı</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Hasar Fotoğrafları ve Görseller</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Ruhsat ve Ehliyet Fotokopileri (Trafik/Kasko için)</span>
              </li>
            </ul>
          </div>
        </div>

        <AgencyBadge className="mt-8" />
      </div>
    </div>
  );
};
