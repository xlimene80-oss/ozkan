import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CAMPAIGNS, Campaign } from '../data/campaigns.js';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import {
  Gift,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tüm Kampanyalar' },
    { id: 'Oto Sigortası', label: 'Kasko & Oto' },
    { id: 'Sağlık & Yaşam', label: 'Sağlık' },
    { id: 'Ev & Mülk', label: 'DASK & Konut' },
    { id: 'Emeklilik & Birikim', label: 'BES' },
    { id: 'Yıl Boyu Ayrıcalık', label: '365 Asistans' },
  ];

  const filtered =
    selectedCategory === 'all'
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === selectedCategory);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Açıklama Metni */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">
            <Gift className="h-3.5 w-3.5 text-amber-600" />
            <span>13 Sigorta Avantajları</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Güncel Sigorta Kampanyaları ve Özel Acente İndirimleri
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            Allianz Sigorta kalitesiyle poliçenizi yaptırırken acentemize özel ek indirimler, hediye asistans paketleri ve avantajlı ödeme koşullarından yararlanın.
          </p>

          {/* Kategori Filtresi */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00357B] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Kutucuklu Kartlar Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((camp) => (
            <div
              key={camp.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#00357B]/40 transition-all group"
            >
              <div>
                {/* Üst Rozet & İndirim */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eaf1fa] px-2.5 py-1 text-xs font-bold text-[#00357B]">
                    <Sparkles className="h-3.5 w-3.5 text-[#00357B]" />
                    <span>{camp.badge}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <Tag className="h-3 w-3" />
                    <span>{camp.discount}</span>
                  </span>
                </div>

                {/* Kampanya Başlığı */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00357B] transition-colors">
                  {camp.title}
                </h3>

                {/* Açıklama */}
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {camp.description}
                </p>

                {/* Maddeli Öne Çıkan Özellikler */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {camp.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alt Alan: Süre ve Teklif Al Butonu */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{camp.validUntil}</span>
                </div>

                <Link
                  to={`/teklif/${camp.productSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00357B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00224f] transition-all group-hover:translate-x-0.5"
                >
                  <span>Teklif Al</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Danışma & Acente İletişim Bandı */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#00357B] via-[#002b66] to-[#00224f] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-black">
              Size Özel En Uygun Kampanyayı Birlikte Belirleyelim
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Aracınız, sağlığınız veya eviniz için birden fazla poliçeyi birleştirerek maksimum indirimden yararlanmak için uzman teknik danışmanlarımıza anında ulaşabilirsiniz.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumarasi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp ile Sorun</span>
            </a>
            <a
              href={siteConfig.telefon}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{siteConfig.telefonDisplay}</span>
            </a>
          </div>
        </div>

        <AgencyBadge className="mt-12 max-w-4xl mx-auto" />
      </div>
    </div>
  );
};
