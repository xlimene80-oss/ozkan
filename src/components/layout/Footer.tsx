import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';
import { PRODUCTS } from '../../data/products.js';
import { buildWhatsAppLink, generateGeneralWhatsAppMessage } from '../../utils/whatsapp.js';
import { Phone, Mail, MapPin, Clock, Shield, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const generalMsg = generateGeneralWhatsAppMessage();
  const wa = buildWhatsAppLink(siteConfig.whatsappNumarasi, generalMsg);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-sm">
      {/* Üst Bilgi Alanı */}
      <div className="mx-auto max-w-7xl px-3 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolon 1: Acente Bilgileri */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">{siteConfig.acenteKisaAd}</span>
            </div>
            <p className="font-medium text-slate-800 text-xs leading-relaxed">
              {siteConfig.acenteUnvani}
            </p>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                TOBB Levha No: <span className="font-mono text-sky-700">{siteConfig.levhaNo}</span>
              </p>
              <p className="text-slate-600">{siteConfig.yetkiliSirket}</p>
            </div>
            {/* WhatsApp Butonu (Düz, PII içermeyen) */}
            <div>
              <a
                href={wa.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp ile Yazın</span>
              </a>
            </div>
          </div>

          {/* Kolon 2: Hızlı Ürün Bağlantıları */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Sigorta Çözümlerimiz
            </h4>
            <ul className="space-y-2 text-xs">
              {PRODUCTS.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link to={`/teklif/${p.slug}`} className="hover:text-sky-700 transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolon 3: Teknik Personel & Çalışma Saatleri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Yetkili Teknik Personel
            </h4>
            <ul className="text-xs space-y-1 text-slate-600">
              {siteConfig.teknikPersonel.map((staff, idx) => (
                <li key={idx} className="flex flex-col">
                  <span className="font-medium text-slate-800">{staff.ad}</span>
                  <span className="text-[11px] text-slate-500 font-mono">SEGEM: {staff.kayitNo}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Çalışma Saatleri</span>
              </h5>
              <p className="text-xs text-slate-500">{siteConfig.calismaSaatleri}</p>
            </div>
          </div>

          {/* Kolon 4: İletişim Bilgileri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              İletişim
            </h4>
            <div className="text-xs space-y-2.5">
              <p className="flex items-start gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{siteConfig.adres}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <a href={siteConfig.telefon} className="font-semibold text-slate-800 hover:text-sky-700">
                  {siteConfig.telefonDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href={`mailto:${siteConfig.eposta}`} className="text-slate-600 hover:text-sky-700">
                  {siteConfig.eposta}
                </a>
              </p>
            </div>
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
