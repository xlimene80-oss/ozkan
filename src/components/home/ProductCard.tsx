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
    const props = { className: 'h-6 w-6 sm:h-7 sm:w-7 text-sky-600 stroke-[1.75]' };
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
      className="product-card-hover group flex flex-col justify-between w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm transition-all duration-200 focus-visible:outline-brand focus-visible:outline-2"
      aria-label={`${product.title} teklif talep sayfasına git`}
    >
      <div className="min-w-0">
        {/* İnce Çizgili İkon */}
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-sky-50 transition-colors group-hover:bg-sky-100 mb-3 sm:mb-4 shrink-0">
          {getIcon(product.iconName)}
        </div>

        {/* Ürün Adı */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors break-words">
          {product.title}
        </h3>

        {/* Kısa Açıklama (Cümle ortasında kesilmeyecek biçimde line-clamp-3) */}
        <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-3 break-words">
          {product.shortDesc}
        </p>
      </div>

      <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-sky-600">
        <span>Teklif İste</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
      </div>
    </Link>
  );
};
