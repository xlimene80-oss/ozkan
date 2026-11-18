import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Top Bar
    'topbar.callUs': 'Müşteri Hattı & WhatsApp',
    'topbar.searchPlaceholder': 'Ne aramıştınız?',
    'topbar.directCall': 'Hemen Ara',
    'topbar.whatsapp': 'WhatsApp ile Yaz',

    // Nav
    'nav.getQuote': 'Teklif Al',
    'nav.products': 'Ürünler',
    'nav.campaigns': 'Kampanyalar',
    'nav.institutions': 'Anlaşmalı Kurumlar',
    'nav.contact': 'İletişim',

    // Mega Menu
    'menu.allProducts': 'Tüm Sigorta Branşları',
    'menu.auto': 'Araç Sigortaları',
    'menu.health': 'Sağlık & Yaşam',
    'menu.home': 'Konut & Mülk',
    'menu.special': 'Özel Güvenceler',
    'menu.quickOffer': 'Hemen Teklif İste',

    // Search
    'search.title': 'Site İçi Canlı Arama',
    'search.hint': 'Sigorta ürünleri, kampanyalar veya anlaşmalı kurumlar arayın...',
    'search.products': 'Sigorta Ürünleri',
    'search.campaigns': 'Kampanyalar',
    'search.institutions': 'Anlaşmalı Kurumlar',
    'search.quickLinks': 'Hızlı Sayfalar',
    'search.noResults': 'Aramanızla eşleşen sonuç bulunamadı.',
    'search.viewAll': 'Sonucu Gör',

    // Hero
    'hero.badge': '13 SİGORTA ARACILIK HİZMETLERİ',
    'hero.title': 'İhtiyacınıza Uygun Sigorta Çözümleri İçin Yanınızdayız',
    'hero.subtitle': 'Allianz yetkili acentesi güvencesiyle en doğru teminat, en uygun fiyat ve hasar anında 7/24 yanınızda olan uzman danışmanlık.',
    'hero.cta': 'Teklif Talep Et',
    'hero.secondary': 'Kampanyaları İncele',

    // Products / Grid
    'products.heading': 'Ücretsiz Teklif Talebi',
    'products.subheading': 'İhtiyacınıza en uygun sigorta ürününü seçin; bağlayıcılığı olmadan acente danışmanımız sizinle iletişime geçsin.',
    'products.requestQuote': 'Teklif İste',

    // Contact
    'contact.title': 'İletişim & Danışma Hatlarımız',
    'contact.subtitle': 'Acentemizin 4 doğrudan iletişim hattından ihtiyacınıza uygun uzman temsilcimize anında ulaşabilirsiniz.',
    'contact.call': 'Ara',
    'contact.whatsapp': 'WhatsApp',
  },
  en: {
    // Top Bar
    'topbar.callUs': 'Customer Support & WhatsApp',
    'topbar.searchPlaceholder': 'What are you looking for?',
    'topbar.directCall': 'Call Now',
    'topbar.whatsapp': 'Message on WhatsApp',

    // Nav
    'nav.getQuote': 'Get a Quote',
    'nav.products': 'Products',
    'nav.campaigns': 'Campaigns',
    'nav.institutions': 'Contracted Institutions',
    'nav.contact': 'Contact Us',

    // Mega Menu
    'menu.allProducts': 'All Insurance Branches',
    'menu.auto': 'Vehicle Insurance',
    'menu.health': 'Health & Life',
    'menu.home': 'Home & Property',
    'menu.special': 'Special Coverage',
    'menu.quickOffer': 'Request Instant Quote',

    // Search
    'search.title': 'Live Site Search',
    'search.hint': 'Search insurance products, campaigns or contracted networks...',
    'search.products': 'Insurance Products',
    'search.campaigns': 'Special Campaigns',
    'search.institutions': 'Contracted Networks',
    'search.quickLinks': 'Quick Links',
    'search.noResults': 'No results matching your query.',
    'search.viewAll': 'View Result',

    // Hero
    'hero.badge': '13 INSURANCE BROKERAGE SERVICES',
    'hero.title': 'We Are by Your Side for Custom Insurance Solutions',
    'hero.subtitle': 'Authorized Allianz agency assurance with best coverage, competitive pricing, and 24/7 claim guidance.',
    'hero.cta': 'Request a Quote',
    'hero.secondary': 'Explore Campaigns',

    // Products / Grid
    'products.heading': 'Free Insurance Quote',
    'products.subheading': 'Choose the insurance coverage that suits your needs; our certified agents will contact you with no obligation.',
    'products.requestQuote': 'Get Quote',

    // Contact
    'contact.title': 'Contact & Support Lines',
    'contact.subtitle': 'Reach our certified insurance experts directly across our 4 dedicated support hotlines.',
    'contact.call': 'Call',
    'contact.whatsapp': 'WhatsApp',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('site_lang');
      return saved === 'en' ? 'en' : 'tr';
    } catch {
      return 'tr';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('site_lang', lang);
    } catch {}
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.tr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
