import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/products.js';
import {
  Car,
  ShieldAlert,
  HeartPulse,
  PiggyBank,
  Building,
  Home,
  Key,
  Plane,
  Stethoscope,
  PawPrint,
  ArrowRight,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Her kategoriye özel canlı gradyanlar, hover renkleri ve rozet stilleri
  const getCategoryTheme = (slug: string) => {
    switch (slug) {
      case 'tamamlayici-saglik':
      case 'dijital-doktor':
        // Sağlık / Dijital Doktorum: Canlı Mercan Kırmızısı / Pembe gradyan (#FF4B6E - #FF758C)
        return {
          gradient: 'from-[#FF4B6E] to-[#FF758C]',
          hoverText: 'group-hover:text-[#FF4B6E]',
          hoverBorder: 'hover:border-[#FF4B6E]/40',
          hoverShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(255,75,110,0.18)]',
          topBar: 'bg-gradient-to-r from-[#FF4B6E] to-[#FF758C]',
          badge: 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]',
        };
      case 'kasko':
      case 'zorunlu-trafik':
        // Kasko / Trafik: Canlı Elektrik Mavisi / Turkuaz gradyan (#0072FF - #00C6FF)
        return {
          gradient: 'from-[#0072FF] to-[#00C6FF]',
          hoverText: 'group-hover:text-[#0072FF]',
          hoverBorder: 'hover:border-[#0072FF]/40',
          hoverShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(0,114,255,0.18)]',
          topBar: 'bg-gradient-to-r from-[#0072FF] to-[#00C6FF]',
          badge: 'bg-[#F0F7FF] text-[#0284C7] border-[#BAE6FD]',
        };
      case 'dask':
      case 'konut':
      case 'kiraci-konut':
        // Konut / DASK: Canlı Zümrüt Yeşili gradyan (#059669 - #34D399)
        return {
          gradient: 'from-[#059669] to-[#34D399]',
          hoverText: 'group-hover:text-[#059669]',
          hoverBorder: 'hover:border-[#059669]/40',
          hoverShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(5,150,105,0.18)]',
          topBar: 'bg-gradient-to-r from-[#059669] to-[#34D399]',
          badge: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        };
      case 'bireysel-emeklilik':
        // BES / Hayat: Canlı Altın Sarısı / Turuncu gradyan (#F59E0B - #FBBF24)
        return {
          gradient: 'from-[#F59E0B] to-[#FBBF24]',
          hoverText: 'group-hover:text-[#D97706]',
          hoverBorder: 'hover:border-[#F59E0B]/50',
          hoverShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.22)]',
          topBar: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
          badge: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        };
      case 'seyahat-saglik':
      case 'evcil-hayvan':
      default:
        // Seyahat / Evcil Hayvan: Canlı Mor / İndigo gradyan (#7C3AED - #A78BFA)
        return {
          gradient: 'from-[#7C3AED] to-[#A78BFA]',
          hoverText: 'group-hover:text-[#7C3AED]',
          hoverBorder: 'hover:border-[#7C3AED]/40',
          hoverShadow: 'hover:shadow-[0_10px_25px_-5px_rgba(124,58,237,0.18)]',
          topBar: 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]',
          badge: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
        };
    }
  };

  const theme = getCategoryTheme(product.slug);

  const getIcon = (name: Product['iconName']) => {
    const props = { className: 'h-5 w-5 sm:h-6 sm:w-6 text-white stroke-[2]' };
    switch (name) {
      case 'Car':
        return <Car {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'HeartPulse':
        return <HeartPulse {...props} />;
      case 'PiggyBank':
        return <PiggyBank {...props} />;
      case 'Building':
        return <Building {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Key':
        return <Key {...props} />;
      case 'Plane':
        return <Plane {...props} />;
      case 'Stethoscope':
        return <Stethoscope {...props} />;
      case 'PawPrint':
        return <PawPrint {...props} />;
      default:
        return <Car {...props} />;
    }
  };

  return (
    <Link
      to={`/teklif/${product.slug}`}
      className={`product-card-hover group relative flex flex-col justify-between w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 ${theme.hoverBorder} ${theme.hoverShadow} overflow-hidden focus-visible:outline-2`}
      aria-label={`${product.title} teklif talep sayfasına git`}
    >
      {/* Kartın üst kenarında ince renkli vurgu çizgisi (hover ile belirir) */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${theme.topBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      <div className="min-w-0">
        {/* Üst Kısım: İkon ve Varsa Rozet */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-3">
          <div
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-md shadow-slate-900/10 group-hover:scale-105 group-hover:brightness-105 transition-all duration-300 shrink-0`}
          >
            {getIcon(product.iconName)}
          </div>
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border truncate max-w-[125px] ${theme.badge}`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Ürün Adı: Varsayılan #0F172A, hover durumunda kategori rengi */}
        <h3
          className={`text-xs sm:text-sm font-bold text-[#0F172A] ${theme.hoverText} transition-colors line-clamp-2`}
        >
          {product.title}
        </h3>
      </div>

      {/* Alt Kısım: Teklif Al Linki: hover durumunda kategori rengi */}
      <div
        className={`mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 ${theme.hoverText} transition-colors`}
      >
        <span>Teklif Al</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
      </div>
    </Link>
  );
};
