# 13 SİGORTA - Netlify Dağıtım ve Yönetim Kılavuzu

Bu belge, **13 SİGORTA** (Allianz Sigorta A.Ş. Yetkili Acentesi) web platformunun **%100 Netlify** (Frontend: Vite SPA + Backend: Netlify Serverless Functions) mimarisindeki kurulum, dağıtım ve yönetim adımlarını açıklamaktadır.

---

## 1. Mimari Genel Bakış

- **Frontend (İstemci):** React 18, Vite, Tailwind CSS, TypeScript. Netlify üzerinde barındırılır (`https://13sigorta.netlify.app`).
- **Backend (API):** Node.js, Express, TypeScript, Serverless HTTP. Netlify Serverless Functions üzerinde çalışır (`/.netlify/functions/api` -> `/api/*`).
- **Veritabanı:** PostgreSQL bağlantısı (bağlantı dizesi `DATABASE_URL` ortam değişkeniyle verilir; girilmediğinde test/önizleme için in-memory mod devrededir).
- **Bildirimler:** E-posta (SMTP / Nodemailer) ve Meta WhatsApp Cloud API (Çift kanallı bağımsız mimari).

---

## 2. Netlify Ortam Değişkenleri Tablosu

Netlify Dashboard > **Site configuration > Environment variables** alanına eklenebilecek değişkenler:

| Değişken Adı | Açıklama | Zorunlu mu? | Gizli (Secret)? |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `production` veya `development` | Evet | Hayır |
| `DATABASE_URL` | PostgreSQL bağlantı adresi (Neon, Supabase vb.) | Canlı veri için: Evet | **Evet** |
| `FRONTEND_URL` | İzinli frontend origin'i (`https://13sigorta.netlify.app`) | Evet | Hayır |
| `IP_HASH_SALT` | IP hashleme için tuz (en az 32 karakter) | Prod: Evet | **Evet** |
| `ADMIN_PASSWORD` | Yönetici paneli şifresi (`13Sigortaozkanliozkan`) | Prod: Evet | **Evet** |
| `ADMIN_TOKEN_SECRET` | 8 saatlik JWT oturum imzalama anahtarı (en az 32 karakter) | Prod: Evet | **Evet** |
| `LEAD_RETENTION_DAYS` | Talep verilerinin saklanma süresi (Gün, varsayılan: `365`) | Hayır | Hayır |
| `LEAD_NOTIFY_MODE` | Bildirim kanalları (`log,email,whatsapp_cloud`) | Hayır | Hayır |
| `SMTP_HOST` | E-posta sunucu adresi (örn: `smtp.gmail.com`) | E-posta aktifse: Evet | Hayır |
| `SMTP_PORT` | SMTP portu (`587` veya `465`) | E-posta aktifse: Evet | Hayır |
| `SMTP_SECURE` | SSL/TLS (`true` veya `false`) | Hayır | Hayır |
| `SMTP_USER` | SMTP kullanıcı adı / e-posta adresi | E-posta aktifse: Evet | **Evet** |
| `SMTP_PASS` | SMTP uygulama şifresi / parolası | E-posta aktifse: Evet | **Evet** |
| `EMAIL_FROM` | Gönderen adı ve adresi (`13 Sigorta <bildirim@13sigorta.com>`) | Hayır | Hayır |
| `NOTIFY_EMAIL_TO` | Taleplerin düşeceği e-posta(lar) (virgülle çoklu) | E-posta aktifse: Evet | **Evet** |
| `WHATSAPP_API_VERSION` | Meta Graph API sürümü (`v21.0` veya `v22.0`) | WA aktifse: Evet | Hayır |
| `WHATSAPP_TOKEN` | Meta kalıcı Sistem Kullanıcısı Token'ı | WA aktifse: Evet | **Evet** |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Telefon Numarası ID | WA aktifse: Evet | Hayır |
| `WHATSAPP_NOTIFY_TO` | Bildirim gidecek acente telefonları (örn: `905321112233`) | WA aktifse: Evet | **Evet** |
| `WHATSAPP_TEMPLATE_NAME` | Onaylı şablon adı (`teklif_talebi_bildirimi`) | Hayır | Hayır |
| `WHATSAPP_TEMPLATE_LANG` | Şablon dili (`tr`) | Hayır | Hayır |
| `VITE_ALLOW_INDEXING` | Arama motoru indeksleme izni (`true` yapılmadıkça `noindex`) | Hayır | Hayır |

---

## 3. Netlify Üzerinde Dağıtım

Proje GitHub üzerindeki `https://github.com/xlimene80-oss/ozkan.git` reposundan çalışır:
- **`main` Dalı:** Netlify Frontend Web Sitesini barındırır.
- **`backend` Dalı:** Netlify Serverless Functions API altyapısını barındırır.

Netlify panelinde **Add new site > Import an existing project** diyerek:
- Branch: `backend`
- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions` (otomatik algılanır)
seçilerek API servisi anında devreye alınır.
