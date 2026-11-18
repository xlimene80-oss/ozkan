import React from 'react';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Headphones,
  CheckCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Başlık Alanı */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block rounded-full bg-[#eaf1fa] px-3.5 py-1 text-xs font-bold text-[#00357B] uppercase tracking-wider mb-3">
            7/24 Yanınızdayız
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            İletişim & Danışma Hatlarımız
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Acentemizin doğrudan yetkili 4 telefon hattı üzerinden teklif alma, poliçe yenileme, hasar bildirimi ve acil asistans desteği için bize hemen ulaşabilirsiniz.
          </p>
        </div>

        {/* 4 ÖZEL TELEFON NUMARASI KURUMSAL KARTLARI */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="h-5 w-5 text-[#00357B]" />
            <h2 className="text-lg font-bold text-slate-900">
              Doğrudan İletişim Hatlarımız (Tek Tıkla Arayın veya WhatsApp'tan Yazın)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {siteConfig.iletisimNumaralari.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#00357B]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B] font-bold text-xs">
                      0{idx + 1}
                    </span>
                    {item.isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Merkez Hat
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {item.sublabel}
                  </p>

                  <div className="my-4 pt-3 border-t border-slate-100">
                    <span className="text-base sm:text-lg font-mono font-black text-[#00357B] tracking-tight block">
                      {item.tel}
                    </span>
                  </div>
                </div>

                {/* Çift Buton: Ara & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:+${item.raw}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#00357B] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#00224f] transition-colors"
                    title={`${item.tel} numarasını hemen arayın`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Ara</span>
                  </a>

                  <a
                    href={`https://wa.me/${item.raw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    title={`${item.tel} numarasına WhatsApp ile yazın`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ofis & Şirket Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolon 1: Ofis Adresi & Bilgiler */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#00357B]" />
              <span>Acente Genel Bilgileri</span>
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Merkez Ofis Adresi</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{siteConfig.adres}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B] shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Resmi E-Posta</p>
                  <a
                    href={`mailto:${siteConfig.eposta}`}
                    className="text-[#00357B] hover:underline text-xs mt-0.5 inline-block font-medium"
                  >
                    {siteConfig.eposta}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf1fa] text-[#00357B] shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Çalışma Saatleri</p>
                  <p className="text-slate-600 text-xs mt-0.5">{siteConfig.calismaSaatleri}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Hasar ve Acil Durum Hattı 7/24 Açıktır</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolon 2: Hızlı WhatsApp Danışma & Acente Güvencesi */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Canlı WhatsApp Danışma</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                Poliçe teklifi almak, teminat detaylarını öğrenmek veya mevcut sigortanızı yenilemek için evrak fotoğrafını WhatsApp üzerinden danışmanlarımıza anında gönderebilirsiniz.
              </p>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 mb-6 space-y-1">
                <p className="font-bold text-emerald-900">Doğrudan WhatsApp İletişim:</p>
                <p className="font-mono text-base font-black text-emerald-800">
                  0543 696 13 13
                </p>
                <p className="text-[11px] text-emerald-700">
                  Ruhsat veya TC talep edilmeden ön bilgi ve fiyat aralığı sunulur.
                </p>
              </div>
            </div>

            <div>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumarasi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp ile Hemen Başlat</span>
              </a>
            </div>
          </div>
        </div>

        <AgencyBadge className="mt-12 max-w-4xl mx-auto" />
      </div>
    </div>
  );
};
