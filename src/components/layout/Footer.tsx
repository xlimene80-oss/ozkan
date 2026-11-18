import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';
import { PRODUCTS } from '../../data/products.js';
import { Logo } from './Logo.js';
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-sm">
      {/* Üst Bilgi Alanı */}
      <div className="mx-auto max-w-7xl px-3 py-10 sm:py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Kolon 1: Acente Bilgileri & Kurumsal Logo (Lacivert Logo Beyaz Zemin Üzerinde) */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo variant="blue" imgClassName="h-10 w-auto" />
            </div>
            <p className="font-medium text-slate-800 text-xs leading-relaxed">
              {siteConfig.acenteUnvani}
            </p>
            <div className="rounded-xl bg-[#eaf1fa] border border-blue-100 p-3.5 text-xs space-y-1">
              <p className="font-bold text-[#00357B]">
                TOBB Levha No: <span className="font-mono text-slate-900">{siteConfig.levhaNo}</span>
              </p>
              <p className="text-slate-700">{siteConfig.yetkiliSirket}</p>
            </div>
            {/* WhatsApp Butonu */}
            <div>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumarasi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp Danışma Hattı</span>
              </a>
            </div>
          </div>

          {/* Kolon 2: Hızlı Ürün Bağlantıları (10 Branş) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00357B] mb-3">
              Sigorta Çözümlerimiz
            </h4>
            <ul className="space-y-1.5 text-xs">
              {PRODUCTS.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/teklif/${p.slug}`}
                    className="hover:text-[#00357B] hover:underline transition-colors flex items-center justify-between"
                  >
                    <span>{p.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/#teklif"
                  className="text-xs font-bold text-[#00357B] hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Tüm 10 Branşı İncele</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolon 3: Hızlı Sayfalar & Teknik Kadro */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00357B] mb-2.5">
                Kurumsal & Hizmetler
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link to="/kampanyalar" className="hover:text-[#00357B] transition-colors">
                    Özel Kampanyalar & İndirimler
                  </Link>
                </li>
                <li>
                  <Link to="/anlasmali-kurumlar" className="hover:text-[#00357B] transition-colors">
                    Anlaşmalı Hastane ve Servisler
                  </Link>
                </li>
                <li>
                  <Link to="/hasar-bildirimi" className="hover:text-[#00357B] transition-colors">
                    Hasar Rehberi & Acil İhbar
                  </Link>
                </li>
                <li>
                  <Link to="/hakkimizda" className="hover:text-[#00357B] transition-colors">
                    Hakkımızda & Acentelik
                  </Link>
                </li>
                <li>
                  <Link to="/iletisim" className="hover:text-[#00357B] transition-colors">
                    İletişim & Danışma Hatları
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Çalışma Saatleri</span>
              </h5>
              <p className="text-xs text-slate-500">{siteConfig.calismaSaatleri}</p>
            </div>
          </div>

          {/* Kolon 4: 4 İletişim Telefon Numarası */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00357B] mb-2">
              İletişim & Destek Hatları
            </h4>
            <div className="space-y-2 text-xs">
              {siteConfig.iletisimNumaralari.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1.5 last:border-0">
                  <div className="min-w-0 pr-1">
                    <span className="text-[10px] text-slate-500 block truncate">{item.label}</span>
                    <a
                      href={`tel:+${item.raw}`}
                      className="font-bold text-slate-800 hover:text-[#00357B] font-mono text-xs"
                    >
                      {item.tel}
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${item.raw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 p-1"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 pt-1 flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{siteConfig.adres}</span>
            </p>
          </div>
        </div>

        {/* Yasal & Telif Alt Satırı */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/kvkk" className="hover:text-slate-800 transition-colors">
              KVKK Aydınlatma Metni
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/gizlilik" className="hover:text-slate-800 transition-colors">
              Gizlilik Politikası
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/cerez-politikasi" className="hover:text-slate-800 transition-colors">
              Çerez Politikası
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/kullanim-sartlari" className="hover:text-slate-800 transition-colors">
              Kullanım Şartları
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} {siteConfig.acenteKisaAd}. Tüm hakları saklıdır.</span>
            <span>({siteConfig.surum})</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
