import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';
import { ArrowDown, Sparkles, Gift, ShieldCheck, Phone } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('teklif');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-slate-50" aria-label="Giriş Bölümü">
      {/* 1. Üst Görsel Bandı: Allianz Laciverti (#00357B) gradient */}
      <div
        className="h-44 sm:h-56 md:h-64 w-full bg-gradient-to-r from-[#00224f] via-[#00357B] to-[#0047a5]"
        aria-hidden="true"
      />

      {/* 2. Marka renk paletiyle uyumlu --brand-soft şerit */}
      <div
        className="h-7 sm:h-8 w-full bg-[#eaf1fa] border-b border-[#00357B]/20"
        aria-hidden="true"
      />

      {/* 3. Şeride Oturan ve Banner'a Taşan Beyaz Kart */}
      <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
        <div className="-mt-20 sm:-mt-28 md:-mt-32 relative z-10 w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-10 md:p-12 shadow-xl text-center">
          {/* Üst Başlık (Acente Adı) */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf1fa] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#00357B] mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>{siteConfig.acenteKisaAd} ARACILIK HİZMETLERİ</span>
          </div>

          {/* H1 Başlık */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-2xl mx-auto mb-4 sm:mb-5 break-words">
            İhtiyacınıza Uygun Sigorta Çözümleri İçin Yanınızdayız
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
            Allianz yetkili acentesi güvencesiyle Kasko, Tamamlayıcı Sağlık, BES, Konut ve DASK poliçelerinde uzman danışmanlık ve en avantajlı teklifler.
          </p>

          {/* Eylem Butonları: Teklif Talep Et & Kampanyalar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#teklif"
              onClick={scrollToOffer}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00357B] px-6 sm:px-8 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:bg-[#00224f] active:scale-[0.98] transition-all focus-visible:outline-[#00357B]"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Teklif Talep Et</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>

            <Link
              to="/kampanyalar"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 sm:px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Gift className="h-4 w-4 text-amber-600" />
              <span>Güncel Kampanyalar</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
