import React from 'react';
import { PRODUCTS } from '../../data/products.js';
import { ProductCard } from './ProductCard.js';
import { Sparkles } from 'lucide-react';

export const QuickRequestGrid: React.FC = () => {
  return (
    <section id="teklif" className="py-12 sm:py-16 bg-slate-50" aria-labelledby="teklif-heading">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf1fa] px-3.5 py-1 text-xs font-bold text-[#00357B] uppercase tracking-wider mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Allianz Güvencesiyle 13 Sigorta Çözümleri</span>
          </div>
          <h2 id="teklif-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Ücretsiz Teklif Talebi
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            İhtiyacınıza en uygun sigorta branşını seçin; bağlayıcılığı olmadan, TC kimlik ve ruhsat bilgisi talep edilmeden uzman acente danışmanımız sizin için en avantajlı teklifi hazırlasın.
          </p>
        </div>

        {/* 10 Ürünlük Modern Grid:
            - Mobil (≤640px): 2 Sütun
            - Tablet (640px - 1024px): 3 Sütun
            - Masaüstü (≥1024px): 5 Sütun x 2 Satır veya 3/4 dengeli dağılım
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="min-w-0 w-full flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
