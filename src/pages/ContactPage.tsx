import React from 'react';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { buildWhatsAppLink, generateGeneralWhatsAppMessage } from '../utils/whatsapp.js';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const generalMsg = generateGeneralWhatsAppMessage();
  const wa = buildWhatsAppLink(siteConfig.whatsappNumarasi, generalMsg);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-md bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider mb-3">
            Bize Ulaşın
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            İletişim
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Sigorta teklifleri, poliçe yenilemeleri ve tüm danışmanlık talepleriniz için bize ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* İletişim Kanalları */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Acente İletişim Kanalları</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ofis Adresi</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{siteConfig.adres}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Müşteri Hattı</p>
                  <a
                    href={siteConfig.telefon}
                    className="text-sky-700 hover:underline font-mono text-xs mt-0.5 inline-block"
                  >
                    {siteConfig.telefonDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">E-Posta</p>
                  <a
                    href={`mailto:${siteConfig.eposta}`}
                    className="text-sky-700 hover:underline text-xs mt-0.5 inline-block"
                  >
                    {siteConfig.eposta}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Çalışma Saatleri</p>
                  <p className="text-slate-600 text-xs mt-0.5">{siteConfig.calismaSaatleri}</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp ve Hızlı Mesaj Kutusu */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">WhatsApp Danışma Hattı</h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Acentemize WhatsApp üzerinden anında yazabilir, poliçeleriniz veya teklif talepleriniz hakkında doğrudan bilgi alabilirsiniz.
              </p>

              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-900 mb-6">
                <p className="font-semibold mb-1">WhatsApp Hattımız:</p>
                <p className="font-mono text-sm font-bold text-emerald-800">
                  +{siteConfig.whatsappNumarasi}
                </p>
              </div>
            </div>

            <div>
              <a
                href={wa.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{wa.primaryLabel}</span>
              </a>

              {!wa.isMobile && (
                <div className="mt-2.5 text-center">
                  <a
                    href={wa.directAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1"
                  >
                    <span>Masaüstü uygulaması ile aç</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <AgencyBadge className="mt-10" />
      </div>
    </div>
  );
};
