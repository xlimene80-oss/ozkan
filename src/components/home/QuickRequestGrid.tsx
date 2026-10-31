import React from 'react';
import { PRODUCTS } from '../../data/products.js';
import { ProductCard } from './ProductCard.js';

export const QuickRequestGrid: React.FC = () => {
  return (
    <section id="teklif" className="py-12 sm:py-18 bg-slate-50" aria-labelledby="teklif-heading">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı (Etiket/Pill kaldırıldı, başlık yalnız kaldı) */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 id="teklif-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Ücretsiz Teklif Talebi
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            İhtiyacınıza en uygun sigorta ürününü seçin; bağlayıcılığı olmadan acente danışmanımız sizinle iletişime geçsin.
          </p>
        </div>

        {/* 9 Ürünlük Dengeli Grid:
            - Mobil (≤640px): 2 Sütun, 9. kart col-span-2 ile tam genişlik dengelenir, taşma yapmaz
            - Tablet (640px - 1024px): 3 Sütun x 3 Satır = Tam 9 kart, sıfır boşluk
            - Masaüstü (≥1024px): 3 Sütun x 3 Satır ferah ve ortalı yerleşim
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
          {PRODUCTS.map((product, index) => {
            const isLastOnMobile = index === PRODUCTS.length - 1;
            return (
              <div
                key={product.id}
                className={`min-w-0 w-full ${isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
