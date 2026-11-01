import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';
import { PRODUCTS } from '../../data/products.js';
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  Search,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { PwaInstallButton } from '../pwa/PwaInstallButton.js';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Rota değiştiğinde menüleri kapat
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Arama filtrelemesi
  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleOfferClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('teklif');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#teklif');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Logo (Yalnızca Acente Markası) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline-brand focus-visible:outline-2 rounded-lg py-1"
            aria-label={`${siteConfig.acenteKisaAd} Ana Sayfa`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <Shield className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                {siteConfig.acenteKisaAd}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                Sigorta Aracılık
              </span>
            </div>
          </Link>

          {/* Masaüstü Menü (En fazla 5 öğe) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Ana Menü">
            {/* 1. Ürünler Açılır Menüsü */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-dark rounded-md transition-colors"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                <span>Ürünlerimiz</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* 2 Seviyeli Açılır Panel */}
              {productsOpen && (
                <div className="absolute left-0 top-full mt-1 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Sigorta Çözümleri
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {PRODUCTS.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/teklif/${prod.slug}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-dark transition-colors"
                      >
                        <span className="font-medium">{prod.title}</span>
                        <span className="text-xs text-slate-400">{prod.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Hakkımızda */}
            <Link
              to="/hakkimizda"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-dark rounded-md transition-colors"
            >
              Hakkımızda
            </Link>

            {/* 3. Hasar Bildirimi Bilgi Sayfası */}
            <Link
              to="/hasar-bildirimi"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-dark rounded-md transition-colors"
            >
              Hasar Bildirimi
            </Link>

            {/* 4. İletişim */}
            <Link
              to="/iletisim"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-dark rounded-md transition-colors"
            >
              İletişim
            </Link>
          </nav>

          {/* Sağ Alan: Arama, PWA Yükle, Hemen Ara ve Teklif Butonu */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Sigorta ürünü ara"
            >
              <Search className="h-4 w-4" />
            </button>

            <PwaInstallButton variant="header" />

            <a
              href={siteConfig.telefon}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <Phone className="h-4 w-4 text-brand" />
              <span>Hemen Ara</span>
            </a>

            <button
              type="button"
              onClick={handleOfferClick}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark active:scale-[0.98] transition-all"
            >
              <span>Teklif Talep Et</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobilde Hamburger ve Hızlı PWA Butonu */}
          <div className="flex sm:hidden items-center gap-1.5">
            <PwaInstallButton variant="header" className="!px-2.5 !py-1.5 !text-xs !gap-1" />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Ara"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-brand"
              aria-expanded={mobileMenuOpen}
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobil Çekmece Menü */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900">{siteConfig.acenteKisaAd}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3.5">
                <PwaInstallButton variant="drawer" />
              </div>

              <nav className="mt-4 flex flex-col gap-1">
                <div className="py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ürünlerimiz
                </div>
                {PRODUCTS.map((prod) => (
                  <Link
                    key={prod.id}
                    to={`/teklif/${prod.slug}`}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-soft hover:text-brand-dark"
                  >
                    {prod.title}
                  </Link>
                ))}

                <div className="my-2 border-t border-slate-100" />
                <Link
                  to="/hakkimizda"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/hasar-bildirimi"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hasar Bildirimi
                </Link>
                <Link
                  to="/iletisim"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  İletişim
                </Link>
              </nav>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={siteConfig.telefon}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800"
              >
                <Phone className="h-4 w-4 text-brand" />
                <span>{siteConfig.telefonDisplay}</span>
              </a>
              <button
                type="button"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleOfferClick(e);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                <span>Teklif Talep Et</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arama Modalı */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Sigorta Ürünü Arama</h3>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: Kasko, Sağlık, DASK, Konut..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-brand focus:outline-none"
                autoFocus
              />
            </div>

            <div className="mt-4 max-h-60 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  Aramak istediğiniz ürün adını yazınız.
                </p>
              ) : filteredProducts.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/teklif/${p.slug}`}
                      className="flex items-center justify-between rounded-lg p-2.5 hover:bg-brand-soft text-slate-800"
                    >
                      <div>
                        <div className="text-sm font-medium">{p.title}</div>
                        <div className="text-xs text-slate-500">{p.shortDesc}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-brand shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  "{searchQuery}" ile eşleşen bir ürün bulunamadı.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
