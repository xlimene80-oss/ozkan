export interface Campaign {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
  discount: string;
  validUntil: string;
  productSlug: string;
  featured?: boolean;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'kasko-kampanyalari',
    slug: 'kasko-kampanyalari',
    title: 'Kasko Kampanyaları',
    category: 'Oto Sigortası',
    badge: 'Acente Özel İndirimi',
    description: 'Allianz Kasko poliçelerinde %20’ye varan acente avantajı, 15 gün ücretsiz ikame araç ve sınırsız cam teminatı.',
    highlights: [
      'Yetkili servislerde orijinal yedek parça garantisi',
      'Yılda 2 kez ücretsiz mini onarım hakkı',
      'Kaza anında aynı gün kapınıza teslim ikame araç',
      'Hasarsızlık koruma klozu avantajı',
    ],
    discount: '%20 İndirim',
    validUntil: 'Ay Sonuna Kadar Geçerli',
    productSlug: 'kasko',
    featured: true,
  },
  {
    id: 'saglik-kampanyalari',
    slug: 'saglik-kampanyalari',
    title: 'Sağlık Kampanyaları',
    category: 'Sağlık & Yaşam',
    badge: 'Aile & Bireysel Paket',
    description: 'Tamamlayıcı Sağlık Sigortası yaptıranlara ücretsiz kapsamlı Check-Up, diş temizliği ve göz tarama paketi hediye.',
    highlights: [
      'Seçkin özel hastanelerde SGK fark ücretine son',
      'Yılda 1 kez kapsamlı Check-Up ve EKG kontrolü',
      'Ücretsiz diş taşı temizliği ve panoramik röntgen',
      'Aile poliçelerinde ekstra %10 indirim',
    ],
    discount: 'Ücretsiz Check-Up',
    validUntil: 'Sınırlı Kontenjan',
    productSlug: 'tamamlayici-saglik',
    featured: true,
  },
  {
    id: 'dask-konut-kampanyalari',
    slug: 'dask-konut-kampanyalari',
    title: 'DASK & Konut Sigortası Kampanyaları',
    category: 'Ev & Mülk',
    badge: 'Birlikte Daha Avantajlı',
    description: 'Zorunlu DASK poliçesiyle birlikte Konut veya Kiracı Sigortası yaptıranlara %25 ek paket indirimi ve kombi/klima bakımı hediyesi.',
    highlights: [
      'Deprem, yangın, sel ve hırsızlığa karşı çifte koruma',
      'Yılda 1 kez ücretsiz kombi veya klima bakım hizmeti',
      '7/24 çilingir, su tesisatı ve elektrik acil destek',
      'Ev sahibi ve kiracılara özel esnek teminatlar',
    ],
    discount: '%25 Ekstra İndirim',
    validUntil: 'Güncel Kampanya',
    productSlug: 'konut',
  },
  {
    id: 'bes-kampanyalari',
    slug: 'bes-kampanyalari',
    title: 'BES Kampanyaları',
    category: 'Emeklilik & Birikim',
    badge: '%30 Devlet Katkısı',
    description: 'Bireysel Emeklilik Sistemine 13 Sigorta güvencesiyle başlayın; %30 devlet katkısının yanı sıra profesyonel fon dağılım danışmanlığı kazanın.',
    highlights: [
      'Yatırdığınız her 1.000 TL için 300 TL doğrudan devlet katkısı',
      'Alanında uzman portföy danışmanlığı ile yüksek getiri hedefi',
      '18 yaş altı çocuklar için geleceğe yatırım fonları',
      'Esnek ödeme planı ve ara verme imkanı',
    ],
    discount: '%30 Devlet Desteği',
    validUntil: 'Sürekli Geçerli',
    productSlug: 'bireysel-emeklilik',
  },
  {
    id: '365-kampanyalari',
    slug: '365-kampanyalari',
    title: '365 Kampanyaları',
    category: 'Yıl Boyu Ayrıcalık',
    badge: '7/24 Kesintisiz Asistans',
    description: '365 gün boyunca acil çekici, yol yardım, medikal ambulans ve danışmanlık hizmetlerinde limitsiz acente önceliği.',
    highlights: [
      'Türkiye genelinde 365 gün 7/24 acil çekici ve kurtarıcı',
      'Lastik patlaması ve akü takviyesinde yerinde anında müdahale',
      'Acil sağlık durumlarında doktorlu ambulans yönlendirmesi',
      '13 Sigorta müşterilerine özel 4 hat üzerinden VIP müşteri desteği',
    ],
    discount: '365 Gün VIP Destek',
    validUntil: 'Tüm Poliçelerde Geçerli',
    productSlug: 'kasko',
  },
];
