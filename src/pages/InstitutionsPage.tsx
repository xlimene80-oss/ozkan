import React, { useState } from 'react';
import { INSTITUTION_CATEGORIES, InstitutionCategory } from '../data/institutions.js';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import {
  Hospital,
  Wrench,
  Smile,
  Eye,
  Pill,
  PawPrint,
  Search,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const InstitutionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getCategoryIcon = (iconName: InstitutionCategory['iconName']) => {
    const props = { className: 'h-6 w-6 text-[#00357B]' };
    switch (iconName) {
      case 'Hospital':
        return <Hospital {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'Smile':
        return <Smile {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Pill':
        return <Pill {...props} />;
      case 'PawPrint':
        return <PawPrint {...props} />;
      default:
        return <Hospital {...props} />;
    }
  };

  const filteredCategories = INSTITUTION_CATEGORIES.filter((cat) => {
    const matchesTab = activeTab === 'all' || cat.id === activeTab;
    const matchesSearch =
      searchTerm.trim() === '' ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.examples.some(
        (ex) =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ex.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ex.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık & Açıklama Metni */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold text-[#00357B] uppercase tracking-wider mb-3">
            <Hospital className="h-3.5 w-3.5 text-[#00357B]" />
            <span>Geniş Hizmet Ağı</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Anlaşmalı Sağlık, Servis ve Kurum Ağımız
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
            Allianz güvencesiyle Türkiye genelindeki 850'den fazla özel hastanede, 1.200'ü aşkın yetkili otomotiv servisinde ve uzman sağlık merkezlerinde ayrıcalıklı hizmet alın.
          </p>

          {/* Kurum Arama Çubuğu */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kurum adı, hastane, servis veya il arayın..."
              className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 shadow-sm focus:border-[#00357B] focus:outline-none focus:ring-2 focus:ring-[#00357B]/20"
            />
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#00357B] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tüm Kategoriler
            </button>
            {INSTITUTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === cat.id
                    ? 'bg-[#00357B] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Kurumsal Kart / Izgara (Grid) Yapısı - Kampanyalar Tasarım Diliyle Özdeş */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[#00357B]/40 transition-all"
            >
              <div>
                {/* Üst Başlık & Rozet */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B] shrink-0">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {cat.name}
                      </h2>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {cat.countBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Açıklama */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cat.shortDesc}
                </p>

                {/* Öne Çıkan Kurum Örnekleri Tablosu / Listesi */}
                <div className="mt-5 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Öne Çıkan Anlaşmalı Noktalar
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {cat.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {ex.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span>{ex.city}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-medium text-slate-600">{ex.type}</span>
                            </p>
                          </div>
                          <span className="text-[10px] text-[#00357B] font-semibold bg-[#eaf1fa] px-2 py-0.5 rounded shrink-0">
                            Anlaşmalı
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{ex.features}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alt Bilgi & Doğrudan Danışma */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Şehrinizdeki kurumları sorgulayın:
                </span>
                <a
                  href={`tel:+905436961313`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00357B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#00224f] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Kurum Teyit Hattı</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Kurum Bilgi & Hasar Koordinasyon Notu */}
        <div className="mt-12 rounded-2xl border border-blue-200 bg-[#eaf1fa] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00357B] text-white shrink-0 mt-1">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Poliçeniz Kapsamındaki Kurumu Doğrulamak İster Misiniz?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Tedaviye başlamadan veya aracınızı servise bırakmadan önce acente temsilcimize ulaşarak provizyon durumunu, anlaşma tipini ve ücretsiz çekici/ikame araç hakkınızı anında teyit ettirebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/905436961313"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp ile Sorun</span>
            </a>
          </div>
        </div>

        <AgencyBadge className="mt-12 max-w-4xl mx-auto" />
      </div>
    </div>
  );
};
