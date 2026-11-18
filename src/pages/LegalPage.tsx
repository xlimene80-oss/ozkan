import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { siteConfig } from '../config/site.js';
import { AgencyBadge } from '../components/layout/AgencyBadge.js';
import { Shield, Cookie, Lock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isCookiePage = path.includes('cerez');
  const isKvkkPage = path.includes('kvkk');
  const isPrivacyPage = path.includes('gizlilik');

  let title = 'Hukuki Bilgilendirme ve Aydınlatma Metinleri';
  if (isCookiePage) {
    title = 'Çerez (Cookie) Politikası ve Aydınlatma Metni';
  } else if (isKvkkPage) {
    title = '6698 Sayılı KVKK Kapsamında Aydınlatma Metni';
  } else if (isPrivacyPage) {
    title = 'Gizlilik Politikası ve Veri Güvenliği';
  } else if (path.includes('kullanim-sartlari')) {
    title = 'Kullanım Şartları ve Yasal Uyarılar';
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  const openCookieModal = () => {
    window.dispatchEvent(new CustomEvent('open_cookie_preferences'));
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Üst Başlık */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf1fa] px-3.5 py-1 text-xs font-bold text-[#00357B] uppercase tracking-wider mb-3">
            <Shield className="h-3.5 w-3.5" />
            <span>Yasal Uyum ve Şeffaflık</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {siteConfig.acenteUnvani} • Son Güncelleme: Kasım 2026
          </p>
        </div>

        {/* Kurumsal Metin Kartı */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Çerez Politikası İçeriği */}
          {isCookiePage && (
            <>
              <div className="rounded-2xl bg-[#eaf1fa] border border-blue-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00357B] text-white shrink-0">
                    <Cookie className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Çerez Tercihlerinizi Yönetin</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      İstediğiniz zaman çerez ayarlarınızı güncelleyebilir veya reddedebilirsiniz.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openCookieModal}
                  className="rounded-xl bg-[#00357B] px-4 py-2 text-xs font-bold text-white hover:bg-[#00224f] transition-colors shrink-0 cursor-pointer"
                >
                  Tercihleri Aç
                </button>
              </div>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">1. Çerez (Cookie) Nedir?</h2>
                <p>
                  Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler sitenin verimli çalışmasını sağlamak, güvenliği artırmak ve kullanıcı deneyiminizi geliştirmek için kullanılır.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">2. 13 Sigorta'da Kullanılan Çerez Türleri</h2>
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>a) Zorunlu Teknik Çerezler (Strictly Necessary Cookies)</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sitenin temel fonksiyonlarının çalışması, teklif formlarının güvenli iletilmesi ve oturum sürekliliği için şarttır. Bu çerezler olmadan web sitesi düzgün çalışamaz ve devre dışı bırakılamaz.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-[#00357B]" />
                      <span>b) Performans ve Analitik Çerezleri</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ziyaretçilerin siteyi nasıl kullandığını, hangi sayfaların daha çok tıklandığını anonim olarak ölçümleyerek kullanıcı deneyimini iyileştirmemize yardımcı olur.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                      <span>c) Pazarlama ve Kampanya Çerezleri</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      İlgi alanlarınıza uygun kişiselleştirilmiş sigorta kampanyaları ve avantajları sunmak amacıyla yalnızca açık rızanız doğrultusunda kullanılır.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">3. Çerezlerin Yönetimi ve Silinmesi</h2>
                <p>
                  Çerez tercihlerinizi sitemizin sol alt köşesindeki veya sayfa altındaki bağlantıdan dilediğiniz zaman değiştirebilirsiniz. Ayrıca kullandığınız internet tarayıcısının (Chrome, Safari, Firefox, Edge) ayarlarından tüm çerezleri silebilir veya engelleyebilirsiniz.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">4. Veri Sorumlusu İletişim</h2>
                <p>
                  6698 sayılı Kanun kapsamındaki haklarınız ve çerez uygulamalarımız ile ilgili sorularınız için{' '}
                  <a href={`mailto:${siteConfig.eposta}`} className="text-[#00357B] font-bold underline">
                    {siteConfig.eposta}
                  </a>{' '}
                  adresi üzerinden veri sorumlusu sıfatıyla acentemizle iletişime geçebilirsiniz.
                </p>
              </section>
            </>
          )}

          {/* KVKK & Diğer Sayfalar */}
          {!isCookiePage && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">1. Veri Sorumlusu</h2>
                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, <strong>{siteConfig.acenteUnvani}</strong> (TOBB Levha No: {siteConfig.levhaNo}) olarak, sigorta aracılık faaliyetlerimiz kapsamında kişisel verilerinizi mevzuata tam uyumlu olarak işlemekte ve korumaktayız.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">2. İşlenen Kişisel Veriler ve Amaçları</h2>
                <p>
                  Teklif talebi formları ve iletişim kanallarımız aracılığıyla paylaştığınız Ad-Soyad, İletişim Numarası, E-posta ve talep ettiğiniz sigorta branşına ilişkin bilgiler; size en uygun sigorta teklifini hazırlamak, poliçe düzenleme süreçlerini yönetmek ve yasal mevzuat yükümlülüklerimizi yerine getirmek amacıyla işlenmektedir.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900">3. Veri Güvenliği ve Haklarınız</h2>
                <p>
                  Kişisel verileriniz hiçbir surette yetkisiz üçüncü şahıslarla paylaşılmaz. KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini talep etme ve silinmesini isteme haklarına sahipsiniz.
                </p>
              </section>
            </div>
          )}
        </div>

        <AgencyBadge className="mt-8" />
      </div>
    </div>
  );
};
