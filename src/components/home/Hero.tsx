import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Car,
  Home,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Phone,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('teklif');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickCategories = [
    {
      title: 'Sağlık',
      link: '/teklif/tamamlayici-saglik',
      icon: <HeartPulse className="h-5 w-5 text-white stroke-[2]" />,
      gradient: 'from-[#FF4B6E] to-[#FF758C]',
      hoverBorder: 'hover:border-[#FF4B6E]',
      hoverShadow: 'hover:shadow-[0_8px_25px_rgba(255,75,110,0.35)]',
    },
    {
      title: 'Kasko & Trafik',
      link: '/teklif/kasko',
      icon: <Car className="h-5 w-5 text-white stroke-[2]" />,
      gradient: 'from-[#0072FF] to-[#00C6FF]',
      hoverBorder: 'hover:border-[#00C6FF]',
      hoverShadow: 'hover:shadow-[0_8px_25px_rgba(0,198,255,0.35)]',
    },
    {
      title: 'Konut & DASK',
      link: '/teklif/dask',
      icon: <Home className="h-5 w-5 text-white stroke-[2]" />,
      gradient: 'from-[#059669] to-[#34D399]',
      hoverBorder: 'hover:border-[#34D399]',
      hoverShadow: 'hover:shadow-[0_8px_25px_rgba(52,211,153,0.35)]',
    },
    {
      title: 'BES & Hayat',
      link: '/teklif/bireysel-emeklilik',
      icon: <PiggyBank className="h-5 w-5 text-white stroke-[2]" />,
      gradient: 'from-[#F59E0B] to-[#FBBF24]',
      hoverBorder: 'hover:border-[#FBBF24]',
      hoverShadow: 'hover:shadow-[0_8px_25px_rgba(251,191,36,0.35)]',
    },
  ];

  return (
    <section
      className="relative w-full min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] flex items-center bg-[#061a40] overflow-hidden"
      aria-label="13 Sigorta Ailesi Karşılama Alanı"
    >
      {/* 1. Arka Plan Görseli (hero-bg.png) */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover pointer-events-none"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
        }}
        aria-hidden="true"
      />

      {/* 2. Koyu Lacivert Geçiş Katmanı (Overlay) */}
      {/* Masaüstünde soldan sağa geçiş: Sol metinler berrak okunurken sağda aile görseli estetik görünür */}
      <div
        className="absolute inset-0 w-full h-full hidden lg:block pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(6, 26, 64, 0.92) 0%, rgba(6, 26, 64, 0.65) 50%, rgba(6, 26, 64, 0.15) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Mobilde daha koyu katman: Aile fotoğrafı ile metinlerin çakışmasını engeller */}
      <div
        className="absolute inset-0 w-full h-full lg:hidden pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(6, 26, 64, 0.96) 0%, rgba(6, 26, 64, 0.88) 50%, rgba(6, 26, 64, 0.85) 100%)',
        }}
        aria-hidden="true"
      />

      {/* 3. İçerik Alanı */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-2xl lg:max-w-3xl text-left">
          {/* 1. En Üstte: Ana Başlık & Açıklama Metni */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight drop-shadow-sm mb-3.5 sm:mb-4 text-center sm:text-left">
            <span className="block text-white">13 Sigorta</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-50 to-blue-200">
              Ailemize Hoş Geldiniz
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-blue-100/90 font-normal leading-relaxed max-w-2xl mb-6 sm:mb-7 text-center sm:text-left">
            Aracınızdan sağlığınıza, yuvanızdan geleceğinize kadar her an yanınızdayız.
          </p>

          {/* 2. Açıklamanın Hemen Altında: Yatayda Ortalanmış (Üst Ortaya) Turuncu Ana Buton */}
          <div className="flex justify-center w-full mb-6 sm:mb-8">
            <a
              href="#teklif"
              onClick={scrollToOffer}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              <Sparkles className="h-5 w-5 text-slate-950" />
              <span>Hemen Ücretsiz Teklif Al</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </a>
          </div>

          {/* 3. Butonun Altında: 4 Adet Hızlı Kategori Kartı (Cam Efekti / Glassmorphism - Mobilde 2x2 Izgara) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
            {quickCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className={`group relative flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/[0.18] border border-white/20 ${cat.hoverBorder} shadow-lg hover:-translate-y-1.5 ${cat.hoverShadow} transition-all duration-300`}
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-white shadow-md shadow-black/20 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 mb-2`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-white transition-colors leading-tight">
                  {cat.title}
                </span>
                <span className="text-[10px] text-[#FBBF24] font-bold mt-1 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  <span>Teklif Al</span>
                  <ArrowRight className="h-3 w-3 stroke-[2.2]" />
                </span>
              </Link>
            ))}
          </div>

          {/* 4. En Altta: (4 Kategori Kartının Altında) Ortalanmış "Bize Ulaşın" Butonu */}
          <div className="flex justify-center w-full pt-2">
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              <Phone className="h-4 w-4 text-emerald-400" />
              <span>Bize Ulaşın</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
