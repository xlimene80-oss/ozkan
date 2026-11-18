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
      icon: <HeartPulse className="h-5 w-5 stroke-[1.8]" />,
    },
    {
      title: 'Kasko & Trafik',
      link: '/teklif/kasko',
      icon: <Car className="h-5 w-5 stroke-[1.8]" />,
    },
    {
      title: 'Konut & DASK',
      link: '/teklif/dask',
      icon: <Home className="h-5 w-5 stroke-[1.8]" />,
    },
    {
      title: 'BES & Hayat',
      link: '/teklif/bireysel-emeklilik',
      icon: <PiggyBank className="h-5 w-5 stroke-[1.8]" />,
    },
  ];

  return (
    <section
      className="relative w-full min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center bg-[#061a40] overflow-hidden"
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

      {/* 3. Sol Alan (Güçlü Tipografi, Glassmorphism Kartlar ve CTA) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl lg:max-w-3xl text-left">
          {/* Ana Başlık: Güçlü ve Modern Tipografi ile Alt Alta 2 Satır */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight drop-shadow-sm mb-3.5 sm:mb-4">
            <span className="block text-white">13 Sigorta</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-50 to-blue-200">
              Ailemize Hoş Geldiniz
            </span>
          </h1>

          {/* Alt Açıklama Metni */}
          <p className="text-sm sm:text-base md:text-lg text-blue-100/90 font-normal leading-relaxed max-w-2xl mb-7 sm:mb-8">
            Aracınızdan sağlığınıza, yuvanızdan geleceğinize kadar her an yanınızdayız.
          </p>

          {/* Hızlı Kategori Kartları (Cam Efekti / Glassmorphism) - Mobilde 2x2 Izgara */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-7 sm:mb-9">
            {quickCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group relative flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white/15 group-hover:bg-white text-white group-hover:text-[#00357B] transition-colors mb-2 shadow-xs">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {cat.title}
                </span>
                <span className="text-[10px] text-blue-200/80 mt-1 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Teklif Al</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>

          {/* Ana Eylem Çağrısı (CTA) Butonları */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Dikkat Çekici Canlı Turuncu / Altın Sarısı Ana Teklif Butonu */}
            <a
              href="#teklif"
              onClick={scrollToOffer}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-slate-950" />
              <span>Hemen Ücretsiz Teklif Al</span>
            </a>

            {/* Şeffaf Çerçeveli Bize Ulaşın Butonu */}
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 sm:px-7 py-3.5 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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
