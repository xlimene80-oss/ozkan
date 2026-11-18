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
      className="product-card-hover group flex flex-col justify-between w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#00357B]/40 hover:shadow-md focus-visible:outline-[#00357B] focus-visible:outline-2"
      aria-label={`${product.title} teklif talep sayfasına git`}
    >
      <div className="min-w-0">
        {/* Üst Kısım: İkon ve Varsa Rozet */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#eaf1fa] group-hover:bg-[#00357B] text-[#00357B] group-hover:text-white transition-all shrink-0">
            {getIcon(product.iconName)}
          </div>
          {product.badge && (
            <span className="text-[10px] font-bold text-[#00357B] bg-[#eaf1fa] px-2 py-0.5 rounded-full border border-blue-200/60 truncate max-w-[120px]">
              {product.badge}
            </span>
          )}
        </div>

        {/* Ürün Adı */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00357B] transition-colors line-clamp-2">
          {product.title}
        </h3>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#00357B]">
        <span>Teklif Al</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
      </div>
    </Link>
  );
};
