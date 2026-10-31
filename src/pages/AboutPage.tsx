import React from 'react';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { Shield, Users, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Başlık Alanı */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block rounded-md bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider mb-3">
            Kurumsal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hakkımızda
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {siteConfig.acenteUnvani}, sigortalılarımızın güvenliğini ve memnuniyetini ön planda tutarak profesyonel sigorta aracılık hizmeti sunmaktadır.
          </p>
        </div>

        {/* Ana İçerik Kartı */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Yetkili Acentelik Bilgisi</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Acentemiz, <strong>{siteConfig.yetkiliSirket}</strong> olarak faaliyetlerini yürütmektedir.
              Sigortacılık mevzuatı, Türkiye Odalar ve Borsalar Birliği (TOBB) Levha kaydı ve Sigortacılık ve Özel Emeklilik Düzenleme ve Denetleme Kurumu (SEDDK) kuralları çerçevesinde şeffaf ve güvenilir bir hizmet anlayışını benimsemekteyiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Resmi Kayıt ve Tescil</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acente Levha No: <strong className="font-mono text-slate-800">{siteConfig.levhaNo}</strong>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Kayıt durumumuz TOBB Sigorta Acenteleri Levhası üzerinden sorgulanabilir.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Uzman Teknik Personel</h3>
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                {siteConfig.teknikPersonel.map((staff, i) => (
                  <li key={i}>
                    {staff.ad} - <span className="font-mono text-slate-500">{staff.kayitNo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Hizmet İlkelerimiz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>İhtiyaca özel, doğru teminat analizi ve bilgilendirme</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Şeffaf teklif süreci ve bağlayıcılığı olmayan teklifler</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hasar sürecinde kesintisiz dosya ve evrak rehberliği</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Kişisel Verilerin Korunması Kanunu (KVKK) ile tam uyum</span>
              </div>
            </div>
          </div>
        </div>

        <AgencyBadge className="mt-8" />
      </div>
    </div>
  );
};
