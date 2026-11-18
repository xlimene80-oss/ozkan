export interface InstitutionCategory {
  id: string;
  name: string;
  shortDesc: string;
  iconName: 'Hospital' | 'Wrench' | 'Smile' | 'Eye' | 'Pill' | 'PawPrint';
  countBadge: string;
  examples: {
    name: string;
    city: string;
    type: string;
    features: string;
  }[];
}

export const INSTITUTION_CATEGORIES: InstitutionCategory[] = [
  {
    id: 'hastaneler',
    name: 'Anlaşmalı Özel Hastaneler',
    shortDesc: 'Tamamlayıcı ve Özel Sağlık poliçelerinizde SGK farkı ödemeden yararlanabileceğiniz A+ sağlık kuruluşları.',
    iconName: 'Hospital',
    countBadge: '850+ Anlaşmalı Hastane',
    examples: [
      { name: 'Acıbadem Sağlık Grubu', city: 'Tüm Türkiye', type: 'Tam Teşekküllü A+ Hastane', features: 'Yatarak & Ayakta Tedavi, VIP Hizmet' },
      { name: 'Memorial Sağlık Grubu', city: 'İstanbul, Ankara, Antalya', type: 'Genel Hastane & Onkoloji', features: 'Farksız SGK & Özel Sağlık Anlaşması' },
      { name: 'Medical Park & Liv Hospital', city: '30+ İl Geneli', type: 'Yaygın Özel Hastane Ağı', features: 'Ayakta Muayene, Ameliyat ve Tahlil' },
      { name: 'Florence Nightingale', city: 'İstanbul', type: 'Kardiyoloji & Kalp Cerrahisi', features: 'Acentemiz Öncelikli Yatış Onayı' },
      { name: 'Medipol Mega Üniversite Hastanesi', city: 'İstanbul, Ankara', type: 'Üniversite Araştırma Hastanesi', features: 'Kapsamlı Tetkik & İleri Teşhis' },
      { name: 'Amerikan Hastanesi & Koç Üniversitesi', city: 'İstanbul', type: 'A+ Uluslararası Akredite', features: 'Özel Sağlık Poliçeleri Kapsamında' },
    ],
  },
  {
    id: 'oto-servisleri',
    name: 'Yetkili & Anlaşmalı Oto Servisleri',
    shortDesc: 'Kasko poliçeniz kapsamında orijinal yedek parça ve usta işçilik garantisi sunan servis ağımız.',
    iconName: 'Wrench',
    countBadge: '1.200+ Servis Noktası',
    examples: [
      { name: 'Doğuş Otomotiv Yetkili Servisleri', city: 'VW, Audi, Seat, Skoda, Porsche', type: 'Yetkili Marka Servisi', features: 'Orijinal Parça, Garantili Kaporta & Boya' },
      { name: 'Borusan Oto Yetkili Servisleri', city: 'BMW, MINI, Land Rover', type: 'Premium Yetkili Servis', features: 'Hızlı İkame Araç & Doğrudan Onay' },
      { name: 'Otokoç Yetkili Servisleri', city: 'Ford, Fiat, Alfa Romeo, Jeep', type: 'Geniş Servis İstasyonu', features: 'Yerinde Teslimat & Vale Hizmeti' },
      { name: 'Renault Mais & Dacia Servisleri', city: '81 İl Geneli', type: 'Yetkili Marka Ağı', features: 'Hızlı Onarım & Orijinal Parça Garantisi' },
      { name: 'Bosch Car Service Ağı', city: 'Tüm Türkiye (400+ Nokta)', type: 'Çok Markalı Sertifikalı Servis', features: 'Mini Onarım & Hızlı Hasar Dosyası' },
      { name: 'Auto King Onarım Merkezleri', city: 'Tüm Büyükşehirler', type: 'Mini Onarım & Boyasız Göçük', features: 'Poliçe Delinmeden Ücretsiz Mini Onarım' },
    ],
  },
  {
    id: 'dis-merkezleri',
    name: 'Anlaşmalı Diş Sağlığı & Poliklinikler',
    shortDesc: 'Yılda 1 kez ücretsiz diş taşı temizliği, hekim muayenesi ve panoramik röntgen ayrıcalığı.',
    iconName: 'Smile',
    countBadge: '350+ Diş Polikliniği',
    examples: [
      { name: 'Hospitadent Diş Hastaneleri', city: 'İstanbul, Ankara, Kayseri', type: 'Ağız ve Diş Sağlığı Merkezi', features: 'Ücretsiz Yıllık Diş Bakım Paketi' },
      { name: 'Dentistanbul Diş Hastanesi', city: 'İstanbul', type: 'Özel Diş Hastanesi', features: 'Çocuk Diş Hekimliği & İmplant İndirimi' },
      { name: 'Dentaluna Ağız & Diş Sağlığı', city: 'İstanbul (Nişantaşı)', type: 'Estetik Diş Kliniği', features: 'Rutin Kontrol & Temizlik Paketi' },
      { name: 'DentGroup Diş Klinikleri', city: '15+ İl Geneli', type: 'Kurumsal Klinik Zinciri', features: 'Acente Müşterilerine Özel %20 İndirim' },
    ],
  },
  {
    id: 'goz-merkezleri',
    name: 'Anlaşmalı Göz Sağlığı Merkezleri',
    shortDesc: 'Göz muayenesi, kırma kusuru tetkikleri ve katarakt operasyonlarında özel anlaşmalı merkezler.',
    iconName: 'Eye',
    countBadge: '180+ Göz Merkezi',
    examples: [
      { name: 'Dünyagöz Hastaneler Grubu', city: 'Tüm Türkiye (25+ Şube)', type: 'İhtisas Göz Hastanesi', features: 'SGK Fark Ücretsiz Muayene & Lazer Tetkiki' },
      { name: 'Veni Vidi Göz Sağlığı', city: 'İstanbul, Ankara, İzmir', type: 'Göz Cerrahisi Merkezi', features: 'Katarakt ve Akıllı Lens Danışmanlığı' },
      { name: 'Kudret Göz Hastanesi', city: 'Ankara, İstanbul', type: 'Özel Göz Hastanesi', features: 'Retina & Kornea Uzman Hekim Ağı' },
      { name: 'Göz Vakfı Bayrampaşa Göz Hastanesi', city: 'İstanbul', type: 'Vakıf Sağlık Kuruluşu', features: 'Özel Acente İndirim Protokolü' },
    ],
  },
  {
    id: 'eczane-medikal',
    name: 'Anlaşmalı Eczane & Evde Bakım Ağı',
    shortDesc: 'Reçeteli ilaç temini, evde hemşirelik, serum takma ve fizik tedavi organizasyonları.',
    iconName: 'Pill',
    countBadge: 'Geniş Medikal Ağ',
    examples: [
      { name: 'Evde Sağlık & Hemşirelik Ağı', city: 'İstanbul, Ankara, İzmir', type: 'Evde Bakım Hizmeti', features: 'Kan Alma, Enjeksiyon, Serum & Pansuman' },
      { name: 'Anlaşmalı Medikal Cihaz Sağlayıcıları', city: 'Türkiye Geneli', type: 'Medikal Ürün Temini', features: 'Tekerlekli Sandalye, Solunum Cihazı vb.' },
      { name: 'Dijital Reçete & İlaç Sevkiyat Hattı', city: 'Metropol İller', type: 'Acil İlaç Yönlendirme', features: '7/24 Nöbetçi Eczane Koordinasyonu' },
    ],
  },
  {
    id: 'veterinerler',
    name: 'Anlaşmalı Veteriner Klinikleri',
    shortDesc: 'Pati dostlarınızın kaza, zehirlenme ve acil operasyonlarında güvenebileceğiniz veteriner ağı.',
    iconName: 'PawPrint',
    countBadge: '450+ Veteriner Kliniği',
    examples: [
      { name: 'İstanbul Vetart Hayvan Hastanesi', city: 'İstanbul (Kadıköy)', type: '7/24 Hayvan Hastanesi', features: 'Acil Müdahale, Röntgen & Ameliyat' },
      { name: 'Ankara Petical Veteriner Tıp Merkezi', city: 'Ankara (Çankaya)', type: 'Tam Donanımlı Cerrahi', features: 'Mikroçip, Tahlil & Yatarak Tedavi' },
      { name: 'İzmir Mavişehir Veteriner Polikliniği', city: 'İzmir (Karşıyaka)', type: 'Veteriner Kliniği', features: 'Acil Kaza & Zehirlenme Teminatı' },
      { name: 'Petcode Hayvan Hastanesi', city: 'Bursa, Antalya', type: 'Acil Hayvan Hastanesi', features: '13 Sigorta Pati Kartı Doğrudan Onay' },
    ],
  },
];
