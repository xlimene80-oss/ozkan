export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  category: 'Oto' | 'Sağlık & Yaşam' | 'Ev & Mülk' | 'Özel';
  iconName:
    | 'Car'
    | 'ShieldAlert'
    | 'HeartPulse'
    | 'PiggyBank'
    | 'Building'
    | 'Home'
    | 'Plane'
    | 'Stethoscope'
    | 'PawPrint';
  extraFieldLabel: string;
  extraFieldPlaceholder: string;
  extraFieldHelp?: string;
  placeholderText: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'kasko',
    slug: 'kasko',
    title: 'Kasko Sigortası',
    shortDesc: 'Aracınızı çarpma, çalınma ve afet risklerine karşı tam koruma altına alın.',
    category: 'Oto',
    iconName: 'Car',
    extraFieldLabel: 'Araç Marka, Model ve Yıl (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2021 Renault Megane',
    extraFieldHelp: 'Plaka veya ruhsat bilgisi talep edilmez.',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Kasko sigortası, aracınızın karşılaşabileceği hasarları geniş teminat seçenekleriyle güvence altına alır.',
  },
  {
    id: 'zorunlu-trafik',
    slug: 'zorunlu-trafik',
    title: 'Zorunlu Trafik',
    shortDesc: 'Trafiğe güvenle çıkmanız için yasal üçüncü şahıs mali sorumluluk güvencesi.',
    category: 'Oto',
    iconName: 'ShieldAlert',
    extraFieldLabel: 'Araç Marka, Model ve Yıl (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2019 Fiat Egea',
    extraFieldHelp: 'Plaka veya ruhsat bilgisi talep edilmez.',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Karayolları Trafik Kanunu uyarınca motorlu araç işletenlerinin yaptırmakla yükümlü olduğu güvencedir.',
  },
  {
    id: 'tamamlayici-saglik',
    slug: 'tamamlayici-saglik',
    title: 'Tamamlayıcı Sağlık',
    shortDesc: 'Özel hastanelerde SGK fark ücreti ödemeden ayrıcalıklı sağlık hizmeti.',
    category: 'Sağlık & Yaşam',
    iconName: 'HeartPulse',
    extraFieldLabel: 'Kişi Sayısı (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Tek kişi veya 3 kişilik aile',
    extraFieldHelp: 'TC kimlik veya geçmiş sağlık bilgisi talep edilmez.',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. SGK kapsamındaki vatandaşlarımızın anlaşmalı özel sağlık kuruluşlarında fark ödemeden tedavi görmelerini sağlar.',
  },
  {
    id: 'bireysel-emeklilik',
    slug: 'bireysel-emeklilik',
    title: 'Bireysel Emeklilik',
    shortDesc: 'Devlet katkısı avantajıyla düzenli tasarruf ederek geleceğinizi planlayın.',
    category: 'Sağlık & Yaşam',
    iconName: 'PiggyBank',
    extraFieldLabel: 'Aylık Tasarruf Hedefi (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: 2.000 TL',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Bireysel emeklilik sistemi, mevcut kamu sosyal güvenlik sistemine ek olarak refah seviyenizi korumayı hedefler.',
  },
  {
    id: 'dask',
    slug: 'dask',
    title: 'DASK Deprem',
    shortDesc: 'Deprem ve deprem kaynaklı risklere karşı konutunuz için yasal koruma.',
    category: 'Ev & Mülk',
    iconName: 'Building',
    extraFieldLabel: 'İl ve İlçe (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: İstanbul / Kadıköy',
    extraFieldHelp: 'Detaylı adres veya ada/parsel bilgisi talep edilmez.',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Doğal Afet Sigortaları Kurumu güvencesiyle depremin doğrudan veya dolaylı sebep olduğu maddi zararları karşılar.',
  },
  {
    id: 'konut',
    slug: 'konut',
    title: 'Konut Sigortası',
    shortDesc: 'Evinizi yangın, su baskını ve hırsızlık gibi risklere karşı güvenceye alın.',
    category: 'Ev & Mülk',
    iconName: 'Home',
    extraFieldLabel: 'İl ve İlçe (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Ankara / Çankaya',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Konut ve içerisindeki eşyaları çeşitli rizikolara karşı koruyan esnek teminatlı bir güvence paketidir.',
  },
  {
    id: 'seyahat-saglik',
    slug: 'seyahat-saglik',
    title: 'Seyahat Sağlık',
    shortDesc: 'Yurt içi ve vize başvurulu seyahatlerinizde acil sağlık güvencesi.',
    category: 'Özel',
    iconName: 'Plane',
    extraFieldLabel: 'Gidilecek Ülke ve Süre (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Almanya, 15 gün',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Seyahat sırasında aniden gelişebilecek acil hastalık, kaza veya bagaj kaybı gibi durumları teminat altına alır.',
  },
  {
    id: 'dijital-doktor',
    slug: 'dijital-doktor',
    title: 'Dijital Doktor',
    shortDesc: 'Uzman hekimlerle online görüntülü görüşme ve 7/24 sağlık rehberliği.',
    category: 'Sağlık & Yaşam',
    iconName: 'Stethoscope',
    extraFieldLabel: 'Görüşme Tercihi / Konu (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Genel danışmanlık',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Uzman hekimlerle mobil ortamda anında online sağlık danışmanlığı ve yönlendirme hizmeti sunar.',
  },
  {
    id: 'evcil-hayvan',
    slug: 'evcil-hayvan',
    title: 'Evcil Hayvan',
    shortDesc: 'Kedi ve köpek dostlarınızın acil muayene ve tedavi giderlerine güvence.',
    category: 'Özel',
    iconName: 'PawPrint',
    extraFieldLabel: 'Evcil Hayvan Türü ve Yaşı (Opsiyonel)',
    extraFieldPlaceholder: 'Örn: Kedi, 2 yaşında',
    placeholderText: 'Bu metin acente yetkilisi tarafından eklenecektir. Sevimli patili dostlarınızın veteriner kliniklerinde gerçekleşen acil tedavi ve ameliyat giderlerini güvenceye alır.',
  },
];
