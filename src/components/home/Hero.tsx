import React from 'react';
import { siteConfig } from '../../config/site.js';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('teklif');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-bgMain" aria-label="Giriş Bölümü">
      {/* 1. Üst Görsel Bandı: Marka renkli gradient */}
      <div
        className="h-44 sm:h-56 md:h-64 w-full bg-gradient-to-r from-brand-dark via-brand to-brand-dark"
        aria-hidden="true"
      />

      {/* 2. Marka renk paletiyle uyumlu --brand-soft şerit */}
      <div
        className="h-7 sm:h-8 w-full bg-brand-soft border-b border-brand/20"
        aria-hidden="true"
      />

      {/* 3. Şeride Oturan ve Banner'a Taşan Beyaz Kart */}
      <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
        <div className="-mt-20 sm:-mt-28 md:-mt-32 relative z-10 w-full rounded-2xl border border-borderMain bg-surface p-5 sm:p-10 md:p-12 shadow-xl text-center">
          {/* Üst Başlık (Acente Adı) */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-dark mb-2">
            {siteConfig.acenteKisaAd}
          </p>

          {/* H1 Başlık */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-textMain leading-tight max-w-2xl mx-auto mb-5 sm:mb-6 break-words">
            İhtiyacınıza Uygun Sigorta Çözümleri İçin Yanınızdayız
          </h1>

          {/* Tek Dolu Buton "Teklif Talep Et" (#teklif) */}
          <div>
            <a
              href="#teklif"
              onClick={scrollToOffer}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-brand-dark active:scale-[0.98] transition-all focus-visible:outline-brand"
            >
              <span>Teklif Talep Et</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
