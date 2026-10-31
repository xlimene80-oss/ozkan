import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';
import { ProductLeadForm } from '../components/forms/ProductLeadForm.js';
import { siteConfig } from '../config/site.js';
import { ArrowLeft, Check, Shield } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Geri Dönüş Linki */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tüm Sigorta Ürünlerine Dön</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon: Ürün Tanıtımı & Yer Tutucu Açıklama */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <span className="inline-block rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider mb-3">
                {product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.title}
              </h1>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {product.shortDesc}
              </p>

              <div className="my-6 border-t border-slate-100" />

              {/* Yer Tutucu Açıklama */}
              <div className="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-4 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-700 mb-1">Ürün Bilgilendirmesi:</p>
                <p>{product.placeholderText}</p>
              </div>

              {/* Acente Süreç Avantajları */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Neden Acentemizden Teklif Almalısınız?
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Ücretsiz ve bağlayıcılığı olmayan teklif çalışması</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>SEGEM belgeli teknik personel tarafından poliçe analizi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Olası hasar durumunda dosya takibi ve rehberlik desteği</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Shield className="h-4 w-4 text-sky-600 shrink-0" />
                <span>{siteConfig.yetkiliSirket}</span>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Teklif Talep Formu */}
          <div className="lg:col-span-7">
            <ProductLeadForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
