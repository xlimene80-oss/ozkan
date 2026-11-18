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
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getIcon = (name: Product['iconName']) => {
    const props = { className: 'h-6 w-6 sm:h-7 sm:w-7 text-[#00357B] stroke-[1.8]' };
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
      className="product-card-hover group flex flex-col justify-between w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-[#00357B]/40 hover:shadow-md focus-visible:outline-[#00357B] focus-visible:outline-2"
      aria-label={`${product.title} teklif talep sayfasına git`}
    >
      <div className="min-w-0">
        {/* Üst Kısım: İkon ve Rozet */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#eaf1fa] group-hover:bg-[#00357B] text-[#00357B] group-hover:text-white transition-all shrink-0">
            {getIcon(product.iconName)}
          </div>
          {product.badge && (
            <span className="text-[10px] sm:text-[11px] font-bold text-[#00357B] bg-[#eaf1fa] px-2 py-0.5 rounded-full border border-blue-200/60 shrink-0">
              {product.badge}
            </span>
          )}
        </div>

        {/* Ürün Adı */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#00357B] transition-colors break-words">
          {product.title}
        </h3>

        {/* Kısa Açıklama */}
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-3 break-words">
          {product.shortDesc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00357B]">
        <span>Hemen Teklif İste</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
      </div>
    </Link>
  );
};
