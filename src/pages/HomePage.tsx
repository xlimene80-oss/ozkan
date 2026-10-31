import React from 'react';
import { Hero } from '../components/home/Hero.js';
import { QuickRequestGrid } from '../components/home/QuickRequestGrid.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { siteConfig } from '../config/site.js';
import { Shield, Clock, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Bölümü */}
      <Hero />

      {/* 2. Hızlı Talep Bölümü (#teklif) */}
      <QuickRequestGrid />

      {/* 3. Acente Tanıtım ve Güvenilirlik Özeti */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Neden {siteConfig.acenteKisaAd}?
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Yasal mevzuata tam uyumlu teknik kadromuz ile poliçe öncesi ve hasar anında yanınızdayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Yetkili Acente Güvencesi</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {siteConfig.yetkiliSirket} TOBB Levha No: {siteConfig.levhaNo} ile tescilli yasal acentelik.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sertifikalı Teknik Kadro</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                SEGEM kayıtlı sigorta uzmanlarımızla ihtiyacınıza en uygun teminatları belirliyoruz.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Doğrudan İletişim</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Çağrı merkezlerinde kaybolmadan, doğrudan acente temsilcinize ulaşarak destek alırsınız.
              </p>
            </div>
          </div>

          <AgencyBadge className="mt-12 max-w-4xl mx-auto" />
        </div>
      </section>
    </div>
  );
};
