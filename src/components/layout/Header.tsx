import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';
import { PRODUCTS, Product } from '../../data/products.js';
import { CAMPAIGNS } from '../../data/campaigns.js';
import { INSTITUTION_CATEGORIES } from '../../data/institutions.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Logo } from './Logo.js';
import {
  Phone,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Menu,
  MessageCircle,
  Car,
  HeartPulse,
  PiggyBank,
  Building,
  Home,
  Key,
  Plane,
  Stethoscope,
  ShieldAlert,
  PawPrint,
  Gift,
  Hospital,
  Sparkles,
  PhoneCall,
  Check,
  User,
} from 'lucide-react';
import { PwaInstallButton } from '../pwa/PwaInstallButton.js';
import { CustomerAuthModal } from '../auth/CustomerAuthModal.js';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMegaOpen, setProductsMegaOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Rota değiştiğinde menüleri ve aramayı kapat
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsMegaOpen(false);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Dışarı tıklandığında aramayı veya mega menüyü kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node)
      ) {
        setProductsMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Canlı Arama Filtrelemesi
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = trimmedSearch
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmedSearch) ||
          p.shortDesc.toLowerCase().includes(trimmedSearch) ||
          p.category.toLowerCase().includes(trimmedSearch)
      )
    : [];

  const filteredCampaigns = trimmedSearch
    ? CAMPAIGNS.filter(
        (c) =>
          c.title.toLowerCase().includes(trimmedSearch) ||
          c.description.toLowerCase().includes(trimmedSearch) ||
          c.badge.toLowerCase().includes(trimmedSearch)
      )
    : [];

  const filteredInstitutions = trimmedSearch
    ? INSTITUTION_CATEGORIES.filter(
        (i) =>
          i.name.toLowerCase().includes(trimmedSearch) ||
          i.shortDesc.toLowerCase().includes(trimmedSearch) ||
          i.examples.some((ex) => ex.name.toLowerCase().includes(trimmedSearch))
      )
    : [];

  const hasSearchResults =
    filteredProducts.length > 0 ||
    filteredCampaigns.length > 0 ||
    filteredInstitutions.length > 0;

  const handleOfferClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    setProductsMegaOpen(false);
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

  const getProductIcon = (name: Product['iconName'], className = 'h-5 w-5') => {
    switch (name) {
      case 'Car':
        return <Car className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'PiggyBank':
        return <PiggyBank className={className} />;
      case 'Building':
        return <Building className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Key':
        return <Key className={className} />;
      case 'Plane':
        return <Plane className={className} />;
      case 'Stethoscope':
        return <Stethoscope className={className} />;
      case 'PawPrint':
        return <PawPrint className={className} />;
      default:
        return <Car className={className} />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* ========================================================= */}
      {/* 1. SIRA: EN ÜST BAR (#00357B ALLIANZ LACİVERTİ - BEYAZ YAZILAR) */}
      {/* ========================================================= */}
      <div className="w-full bg-[#00357B] text-white border-b border-blue-900/40 relative z-30">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          {/* 1. En Sol: 13 Sigorta Logosu (Beyaz Versiyon) */}
          <div className="flex items-center shrink-0">
            <Logo variant="white" imgClassName="h-8 sm:h-10 w-auto" />
          </div>

          {/* 2. Sol Orta: WhatsApp & Telefon İkonu + 0543 696 13 13 */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <div className="flex items-center rounded-full bg-white/10 hover:bg-white/15 border border-white/20 p-1 pl-2 pr-3 transition-colors">
              {/* WhatsApp İkonu */}
              <a
                href={`https://wa.me/${siteConfig.whatsappNumarasi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-400 hover:scale-105 transition-all mr-2"
                title="WhatsApp ile anında yazın"
                aria-label="WhatsApp Destek Hattı"
              >
                <MessageCircle className="h-4 w-4 fill-white text-emerald-500" />
              </a>

              {/* Telefon İkonu ve Arama Linki */}
              <a
                href={siteConfig.telefon}
                className="flex items-center gap-1.5 text-xs lg:text-sm font-bold text-white hover:text-emerald-300 transition-colors tracking-wide"
                title="Hemen aramak için tıklayın"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>{siteConfig.telefonDisplay}</span>
              </a>
            </div>
          </div>

          {/* 3. Sağ Orta: İnteraktif Arama Kutusu ("Ne aramıştınız?") */}
          <div
            ref={searchContainerRef}
            className="hidden sm:flex relative flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder={t('topbar.searchPlaceholder')}
                className="w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-9 py-1.5 text-xs sm:text-sm text-white placeholder-blue-100/70 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Canlı Filtrelenen Arama Sonuç Paneli */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-slate-800 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                {trimmedSearch === '' ? (
                  <div className="p-3 text-center text-xs text-slate-500">
                    <p className="font-medium text-slate-700 mb-1">
                      {t('search.title')}
                    </p>
                    <p>{t('search.hint')}</p>
                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                      {PRODUCTS.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(p.title);
                          }}
                          className="rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#00357B] px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors"
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : hasSearchResults ? (
                  <div className="space-y-3">
                    {/* Sigorta Ürünleri Sonuçları */}
                    {filteredProducts.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                          {t('search.products')} ({filteredProducts.length})
                        </div>
                        <div className="space-y-1">
                          {filteredProducts.map((p) => (
                            <Link
                              key={p.id}
                              to={`/teklif/${p.slug}`}
                              onClick={() => {
                                setSearchFocused(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between rounded-xl p-2 hover:bg-[#eaf1fa] text-slate-800 transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00357B]/10 text-[#00357B] shrink-0">
                                  {getProductIcon(p.iconName, 'h-4 w-4')}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#00357B] truncate">
                                    {p.title}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {p.shortDesc}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-[#00357B] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Kampanyalar Sonuçları */}
                    {filteredCampaigns.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 px-2 py-1 flex items-center gap-1">
                          <Gift className="h-3 w-3" />
                          <span>{t('search.campaigns')} ({filteredCampaigns.length})</span>
                        </div>
                        <div className="space-y-1">
                          {filteredCampaigns.map((c) => (
                            <Link
                              key={c.id}
                              to={`/kampanyalar`}
                              onClick={() => {
                                setSearchFocused(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between rounded-xl p-2 hover:bg-amber-50 text-slate-800 transition-colors group"
                            >
                              <div>
                                <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                                  {c.title}
                                </p>
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {c.description}
                                </p>
                              </div>
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-md px-2 py-0.5 shrink-0 ml-2">
                                {c.discount}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Anlaşmalı Kurumlar Sonuçları */}
                    {filteredInstitutions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 px-2 py-1 flex items-center gap-1">
                          <Hospital className="h-3 w-3" />
                          <span>{t('search.institutions')} ({filteredInstitutions.length})</span>
                        </div>
                        <div className="space-y-1">
                          {filteredInstitutions.map((inst) => (
                            <Link
                              key={inst.id}
                              to={`/anlasmali-kurumlar`}
                              onClick={() => {
                                setSearchFocused(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between rounded-xl p-2 hover:bg-sky-50 text-slate-800 transition-colors group"
                            >
                              <div>
                                <p className="text-xs font-bold text-slate-900 group-hover:text-sky-800">
                                  {inst.name}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {inst.countBadge}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-sky-700 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">
                      "{searchQuery}"
                    </p>
                    <p className="mt-1">{t('search.noResults')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. En Sağ: Dil Değiştirici (TR / EN) ve Sağ Aksiyonlar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* TR / EN Seçici */}
            <div className="flex items-center rounded-full bg-black/20 p-0.5 border border-white/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('tr')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'tr'
                    ? 'bg-white text-[#00357B] shadow-sm font-extrabold'
                    : 'text-white/80 hover:text-white'
                }`}
                aria-label="Türkçe Dili Seç"
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#00357B] shadow-sm font-extrabold'
                    : 'text-white/80 hover:text-white'
                }`}
                aria-label="Select English"
              >
                EN
              </button>
            </div>

            {/* Mobilde Arama Butonu */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Arama Aç"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Mobilde WhatsApp Kısayolu */}
            <a
              href={`https://wa.me/${siteConfig.whatsappNumarasi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm"
              aria-label="WhatsApp Danışma"
            >
              <MessageCircle className="h-4 w-4 fill-white text-emerald-500" />
            </a>

            {/* Mobilde Hamburger Menü Butonu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobilde Açılır Arama Çubuğu */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-3 pb-3 border-t border-blue-900/60 bg-[#002659] pt-2 animate-in slide-in-from-top-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('topbar.searchPlaceholder')}
                className="w-full rounded-xl bg-white/15 pl-9 pr-8 py-2 text-xs text-white placeholder-blue-100/70 focus:bg-white focus:text-slate-900 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobilde Arama Sonuçları */}
            {searchQuery.trim() && (
              <div className="mt-2 rounded-xl bg-white p-3 text-slate-900 shadow-xl max-h-64 overflow-y-auto">
                {hasSearchResults ? (
                  <div className="space-y-2 text-xs">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/teklif/${p.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50"
                      >
                        <span className="font-semibold text-slate-900">{p.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#00357B]" />
                      </Link>
                    ))}
                    {filteredCampaigns.map((c) => (
                      <Link
                        key={c.id}
                        to={`/kampanyalar`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-amber-900"
                      >
                        <span className="font-semibold">{c.title}</span>
                        <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                          {c.discount}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-slate-500 py-2">
                    {t('search.noResults')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. SIRA: ANA NAVİGASYON MENÜSÜ (BEYAZ ARKA PLAN - LACİVERT YAZILAR) */}
      {/* ========================================================= */}
      <div className="hidden lg:block w-full bg-white border-b border-slate-200">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Soldan Sağa Tam 5 Başlık */}
          <nav className="flex items-center gap-1 xl:gap-3" aria-label="Ana Navigasyon">
            {/* 1. TEKLİF AL */}
            <button
              type="button"
              onClick={handleOfferClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-[#00357B] hover:text-[#00224f] hover:bg-[#eaf1fa] rounded-lg transition-colors group"
            >
              <Sparkles className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>{t('nav.getQuote')}</span>
            </button>

            {/* 2. ÜRÜNLER (MEGA-DROPDOWN PANEL) */}
            <div
              ref={megaMenuRef}
              className="relative"
              onMouseEnter={() => setProductsMegaOpen(true)}
              onMouseLeave={() => setProductsMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProductsMegaOpen(!productsMegaOpen)}
                className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-bold transition-colors rounded-lg ${
                  productsMegaOpen
                    ? 'text-[#00357B] bg-[#eaf1fa]'
                    : 'text-[#00357B] hover:text-[#00224f] hover:bg-[#eaf1fa]'
                }`}
                aria-expanded={productsMegaOpen}
              >
                <span>{t('nav.products')}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    productsMegaOpen ? 'rotate-180 text-[#00357B]' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Mega Dropdown Paneli */}
              {productsMegaOpen && (
                <div className="absolute left-0 top-full mt-0.5 w-[760px] xl:w-[820px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00357B] text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00357B]">
                        {t('menu.allProducts')} (10 Branş)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Allianz Sigorta A.Ş. Yetkili Acentesi
                    </span>
                  </div>

                  {/* 10 Ürün Grid Yapısı (2 Sütun x 5 Satır) */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3">
                    {PRODUCTS.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/teklif/${prod.slug}`}
                        onClick={() => setProductsMegaOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-[#eaf1fa] transition-all group border border-transparent hover:border-blue-100"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00357B]/10 text-[#00357B] group-hover:bg-[#00357B] group-hover:text-white transition-colors shrink-0 mt-0.5">
                          {getProductIcon(prod.iconName, 'h-5 w-5')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#00357B] transition-colors truncate">
                              {prod.title}
                            </h4>
                            {prod.badge && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2 shrink-0">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                            {prod.shortDesc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Alt Mega-Menu Eylem Bandı */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <PhoneCall className="h-4 w-4 text-[#00357B]" />
                      <span>Sorularınız mı var? Doğrudan uzmanımıza danışın:</span>
                      <a
                        href={siteConfig.telefon}
                        className="font-bold text-[#00357B] hover:underline"
                      >
                        {siteConfig.telefonDisplay}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        setProductsMegaOpen(false);
                        handleOfferClick(e);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#00357B] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#00224f] transition-all"
                    >
                      <span>Tüm Ürünleri Gör</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. KAMPANYALAR */}
            <Link
              to="/kampanyalar"
              className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-bold rounded-lg transition-colors ${
                location.pathname === '/kampanyalar'
                  ? 'text-[#00357B] bg-[#eaf1fa]'
                  : 'text-[#00357B] hover:text-[#00224f] hover:bg-[#eaf1fa]'
              }`}
            >
              <span>{t('nav.campaigns')}</span>
              <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-extrabold text-amber-800">
                Fırsat
              </span>
            </Link>

            {/* 4. ANLAŞMALI KURUMLAR */}
            <Link
              to="/anlasmali-kurumlar"
              className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-bold rounded-lg transition-colors ${
                location.pathname === '/anlasmali-kurumlar'
                  ? 'text-[#00357B] bg-[#eaf1fa]'
                  : 'text-[#00357B] hover:text-[#00224f] hover:bg-[#eaf1fa]'
              }`}
            >
              <span>{t('nav.institutions')}</span>
            </Link>

            {/* 5. İLETİŞİM */}
            <Link
              to="/iletisim"
              className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-bold rounded-lg transition-colors ${
                location.pathname === '/iletisim'
                  ? 'text-[#00357B] bg-[#eaf1fa]'
                  : 'text-[#00357B] hover:text-[#00224f] hover:bg-[#eaf1fa]'
              }`}
            >
              <span>{t('nav.contact')}</span>
            </Link>
          </nav>

          {/* Sağ Alan: "Giriş Yap / Üye Ol" Butonu ve PWA */}
          <div className="flex items-center gap-2.5">
            <PwaInstallButton variant="header" />
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00357B] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#00224f] active:scale-[0.98] transition-all cursor-pointer"
              aria-label={language === 'tr' ? 'Giriş Yap veya Üye Ol' : 'Login or Sign Up'}
            >
              <User className="h-3.5 w-3.5" />
              <span>{language === 'tr' ? 'Giriş Yap / Üye Ol' : 'Login / Sign Up'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBİL ÇEKMECE MENÜ (RESPONSIVE AÇILIR YAPI) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Karartma Zemin */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Çekmece Kutusu */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-50">
            <div>
              {/* Çekmece Başlığı: Lacivert Logo & Kapat Butonu */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo variant="blue" imgClassName="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Dil ve PWA */}
              <div className="mt-3 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Dil Seçimi:</span>
                <div className="flex items-center rounded-lg bg-white p-0.5 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLanguage('tr')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      language === 'tr' ? 'bg-[#00357B] text-white' : 'text-slate-600'
                    }`}
                  >
                    TR
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      language === 'en' ? 'bg-[#00357B] text-white' : 'text-slate-600'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Mobilde Giriş Yap / Üye Ol Butonu */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00357B] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00224f] transition-all cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>{language === 'tr' ? 'Giriş Yap / Üye Ol' : 'Login / Sign Up'}</span>
                </button>
              </div>

              {/* Mobil Navigasyon Öğeleri */}
              <nav className="mt-4 flex flex-col gap-1.5 text-sm">
                {/* 1. Teklif Al */}
                <button
                  type="button"
                  onClick={handleOfferClick}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 font-bold text-[#00357B] bg-[#eaf1fa] hover:bg-[#d6e5f7] text-left transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>{t('nav.getQuote')}</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* 2. Ürünler (Akordeon) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#00357B]" />
                      <span>{t('nav.products')} (10)</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        mobileProductsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileProductsOpen && (
                    <div className="ml-3 pl-3 border-l-2 border-[#00357B]/30 my-1 space-y-1">
                      {PRODUCTS.map((prod) => (
                        <Link
                          key={prod.id}
                          to={`/teklif/${prod.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 px-2 text-xs font-semibold text-slate-700 hover:text-[#00357B] hover:bg-slate-50 rounded-lg"
                        >
                          <span className="flex items-center gap-2">
                            {getProductIcon(prod.iconName, 'h-4 w-4 text-[#00357B]')}
                            <span>{prod.title}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Kampanyalar */}
                <Link
                  to="/kampanyalar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-600" />
                    <span>{t('nav.campaigns')}</span>
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">
                    5 Kampanya
                  </span>
                </Link>

                {/* 4. Anlaşmalı Kurumlar */}
                <Link
                  to="/anlasmali-kurumlar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Hospital className="h-4 w-4 text-sky-700" />
                    <span>{t('nav.institutions')}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                {/* 5. İletişim */}
                <Link
                  to="/iletisim"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>{t('nav.contact')}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </nav>

              {/* 4 İletişim Telefon Numarası Kutusu */}
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#00357B]">
                  Doğrudan İletişim Hatlarımız
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {siteConfig.iletisimNumaralari.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white p-2 border border-slate-200/80 shadow-xs"
                    >
                      <div className="min-w-0 pr-1">
                        <p className="text-[10px] font-semibold text-slate-500 truncate">
                          {item.label}
                        </p>
                        <a
                          href={`tel:+${item.raw}`}
                          className="text-xs font-mono font-bold text-[#00357B] hover:underline"
                        >
                          {item.tel}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`tel:+${item.raw}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#00357B] hover:bg-[#00357B] hover:text-white transition-colors"
                          title="Ara"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${item.raw}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Çekmece Altı Butonlar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <PwaInstallButton variant="drawer" />
              <button
                type="button"
                onClick={handleOfferClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00357B] py-3 text-sm font-bold text-white shadow hover:bg-[#00224f] transition-all"
              >
                <span>Hemen Teklif İste</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Müşteri Giriş Yap / Üye Ol Modalı */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </header>
  );
};
