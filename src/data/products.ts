export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  category: 'Sağlık & Yaşam' | 'Oto' | 'Ev & Mülk' | 'Özel';
  iconName:
    | 'HeartPulse'
    | 'PiggyBank'
    | 'Car'
    | 'Plane'
    | 'Building'
    | 'Home'
    | 'Key'
    | 'Stethoscope'
    | 'ShieldAlert'
    | 'PawPrint';
  extraFieldLabel: string;
  extraFieldPlaceholder: string;
  extraFieldHelp?: string;
  placeholderText: string;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'tamamlayici-saglik',
    slug: 'tamamlayici-saglik',
    title: 'Tamamlayıcı Sağlık',
    shortDesc: 'Özel hastanelerde SGK fark ücreti ödemeden Allianz güvencesiyle VIP sağlık hizmeti.',
    category: 'Sağlık & Yaşam',
    iconName: 'HeartPulse',
    extraFieldLabel: 'Kişi Sayısı / Aile Kapsamı (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Tek kişi veya 3 kişilik aile',
    extraFieldHelp: 'TC kimlik veya geçmiş sağlık bilgisi talep edilmez.',
    placeholderText: 'SGK kapsamındaki bireylerin ve ailelerinin anlaşmalı seçkin özel sağlık kuruluşlarında fark ücreti ödemeden muayene, tahlil ve ameliyat hizmeti almasını sağlar.',
    badge: 'En Çok Tercih Edilen',
  },
  {
    id: 'bireysel-emeklilik',
    slug: 'bireysel-emeklilik',
    title: 'Bireysel Emeklilik (BES)',
    shortDesc: '%30 Devlet katkısı avantajıyla bugünden birikim yaparak refah dolu bir gelecek kurun.',
    category: 'Sağlık & Yaşam',
    iconName: 'PiggyBank',
    extraFieldLabel: 'Aylık Tasarruf Hedefi (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2.500 TL',
    placeholderText: 'Bireysel emeklilik sistemi, düzenli tasarruflarınızı uzman fon yöneticileri ve %30 devlet katkısıyla büyüterek emeklilik döneminizde yüksek hayat standardı sağlar.',
    badge: '%30 Devlet Katkısı',
  },
  {
    id: 'kasko',
    slug: 'kasko',
    title: 'Kasko Sigortası',
    shortDesc: 'Çarpma, çalınma, doğal afet ve terör risklerine karşı aracınıza tam kapsamlı güvence.',
    category: 'Oto',
    iconName: 'Car',
    extraFieldLabel: 'Araç Marka, Model ve Yıl (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2022 Volkswagen Golf',
    extraFieldHelp: 'Plaka veya ruhsat bilgisi talep edilmez.',
    placeholderText: 'Aracınızın kaza, hırsızlık, yangın, sel ve üçüncü şahıs kusurlarında oluşan tüm maddi hasarlarını yetkili servis ve orijinal parça garantisiyle karşılar.',
    badge: 'Genişletilmiş Koruma',
  },
  {
    id: 'seyahat-saglik',
    slug: 'seyahat-saglik',
    title: 'Seyahat Sağlık',
    shortDesc: 'Schengen ve dünya genelinde vize geçerli acil tıbbi yardım ve bagaj koruması.',
    category: 'Özel',
    iconName: 'Plane',
    extraFieldLabel: 'Gidilecek Ülke ve Süre (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Almanya / 15 Gün',
    placeholderText: 'Yurt dışı ve yurt içi seyahatlerinizde oluşabilecek acil tedavi giderleri, nakil ve bagaj kaybı gibi beklenmeyen durumlara karşı dünya çapında güvence sağlar.',
    badge: 'Vize Uyumlu',
  },
  {
    id: 'dask',
    slug: 'dask',
    title: 'DASK Deprem',
    shortDesc: 'Deprem ve deprem kaynaklı yangın, patlama, tsunami risklerine karşı yasal teminat.',
    category: 'Ev & Mülk',
    iconName: 'Building',
    extraFieldLabel: 'İl ve İlçe (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: İstanbul / Ataşehir',
    extraFieldHelp: 'Detaylı açık adres veya ada/parsel bilgisi talep edilmez.',
    placeholderText: 'Doğal Afet Sigortaları Kurumu kapsamında binanızda deprem kaynaklı oluşabilecek doğrudan maddi hasarları yasal limitler dahilinde tazmin eder.',
    badge: 'Yasal Zorunlu',
  },
  {
    id: 'konut',
    slug: 'konut',
    title: 'Konut Sigortası',
    shortDesc: 'Evinizi ve eşyalarınızı yangın, su basması, fırtına ve hırsızlığa karşı koruyun.',
    category: 'Ev & Mülk',
    iconName: 'Home',
    extraFieldLabel: 'İl, İlçe ve Metrekare (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Kadıköy / 120 m²',
    placeholderText: 'Ev sahipleri için özel tasarlanan konut paket sigortası; bina ve içindeki eşyaları yangın, dahili su, hırsızlık, cam kırılması ve komşuluk mali mesuliyetine karşı korur.',
  },
  {
    id: 'kiraci-konut',
    slug: 'kiraci-konut',
    title: 'Kiracı Konut Sigortası',
    shortDesc: 'Kiraladığınız evdeki tüm kişisel eşyalarınızı ve komşuluk sorumluluğunuzu güvenceye alın.',
    category: 'Ev & Mülk',
    iconName: 'Key',
    extraFieldLabel: 'Tahmini Eşya Bedeli (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 300.000 TL',
    extraFieldHelp: 'Bina değil, yalnızca size ait ev eşyaları ve sorumluluklar teminata alınır.',
    placeholderText: 'Kiracılar için özel olarak hazırlanan ekonomik güvence paketi; evinizdeki elektronik, mobilya ve değerli eşyalarınızı hırsızlık, su basması ve yangına karşı korurken ev sahibine ve komşulara karşı sorumluluklarınızı da teminat altına alır.',
    badge: 'Ekonomik Fiyat',
  },
  {
    id: 'dijital-doktor',
    slug: 'dijital-doktor',
    title: 'Dijital Doktorum',
    shortDesc: 'Sıra beklemeden alanında uzman doktorlarla 7/24 online görüntülü sağlık görüşmesi.',
    category: 'Sağlık & Yaşam',
    iconName: 'Stethoscope',
    extraFieldLabel: 'Görüşme Tercihi / Branş (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Genel Dahiliye, Çocuk, Diyetisyen',
    placeholderText: 'Mobil uygulama üzerinden sıra beklemeden uzman hekimler, psikologlar ve beslenme danışmanlarıyla sınırsız online görüntülü randevu ve sağlık danışmanlığı sağlar.',
    badge: '7/24 Online',
  },
  {
    id: 'zorunlu-trafik',
    slug: 'zorunlu-trafik',
    title: 'Zorunlu Trafik',
    shortDesc: 'Olası bir kazada karşı tarafa ve üçüncü şahıslara verilebilecek zararlara yasal kalkan.',
    category: 'Oto',
    iconName: 'ShieldAlert',
    extraFieldLabel: 'Araç Marka, Model ve Yıl (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2020 Fiat Egea',
    extraFieldHelp: 'Plaka veya ruhsat bilgisi talep edilmez.',
    placeholderText: 'Karayolları Trafik Kanunu uyarınca zorunlu olan trafik sigortası, aracınızın karıştığı bir kazada karşı tarafın bedeni ve maddi zararlarını yasal limitler kapsamında karşılar.',
    badge: 'Yasal Zorunlu',
  },
  {
    id: 'evcil-hayvan',
    slug: 'evcil-hayvan',
    title: 'Evcil Hayvan / Pati Sigortası',
    shortDesc: 'Kedi ve köpek dostlarınızın acil veteriner, ameliyat ve tedavi giderlerine güvence.',
    category: 'Özel',
    iconName: 'PawPrint',
    extraFieldLabel: 'Pati Türü, Irkı ve Yaşı (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Kedi, Tekir, 3 yaşında',
    placeholderText: 'Can dostlarınızın anlaşmalı veteriner kliniklerinde karşılaşabileceği acil müdahale, ameliyat, tahlil, röntgen ve mikroçip hizmetlerini geniş teminatla karşılar.',
    badge: 'Pati Dostu',
  },
];
