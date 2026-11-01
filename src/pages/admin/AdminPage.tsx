import React, { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl, parseJsonResponse, DEFAULT_API_URL } from '../../config/api.js';
import { siteConfig } from '../../config/site.js';
import { buildWhatsAppLink, buildAdminWhatsAppLink } from '../../utils/whatsapp.js';
import { PwaInstallButton } from '../../components/pwa/PwaInstallButton.js';
import {
  Lock,
  Search,
  Download,
  LogOut,
  RefreshCw,
  Phone,
  Clock,
  MessageSquare,
  History,
  AlertCircle,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type LeadStatus =
  | 'Yeni'
  | 'Arandı'
  | 'Ulaşılamadı'
  | 'Teklif Verildi'
  | 'Poliçeleşti'
  | 'İptal'
  | 'Kaybedildi';

export interface AdminLead {
  id: string;
  created_at: string;
  source_page: string;
  product_slug: string;
  name: string;
  phone: string;
  email: string | null;
  call_time: string;
  note: string | null;
  product_extra: string | null;
  kvkk_accepted: boolean;
  marketing_consent: boolean;
  consent_version: string;
  consent_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  first_contacted_at: string | null;
  repeat_count: number;
  last_repeated_at: string | null;
  notify_status: string;
  notify_error: string | null;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  created_at: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
}

const STORAGE_KEY = '13sigorta_admin_token';
const DEMO_TOKEN = 'demo_preview_token';

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  Yeni: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Arandı: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  Ulaşılamadı: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Teklif Verildi': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Poliçeleşti: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  İptal: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  Kaybedildi: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

// Backend henüz deploy edilmediğinde veya uykudayken önizleme amacıyla kullanılan örnek veriler
const INITIAL_MOCK_LEADS: AdminLead[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    source_page: '/teklif/kasko',
    product_slug: 'kasko',
    name: 'Ahmet Yılmaz',
    phone: '05321112233',
    email: 'ahmet.yilmaz@example.com',
    call_time: 'Sabah (09:00 - 12:00)',
    note: 'Aracım 2022 model, kasko teklifi rica ediyorum.',
    product_extra: '2022 Model Sedan',
    kvkk_accepted: true,
    marketing_consent: true,
    consent_version: 'v1.0',
    consent_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'kasko_kampanya',
    referrer: 'https://google.com',
    status: 'Yeni',
    assigned_to: null,
    first_contacted_at: null,
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'sent_log',
    notify_error: null,
  },
  {
    id: 'c9a646d3-9c61-4cd9-bc15-4581f6943a45',
    created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    source_page: '/teklif/tamamlayici-saglik',
    product_slug: 'tamamlayici-saglik',
    name: 'Fatma Demir',
    phone: '05442223344',
    email: 'fatma.demir@example.com',
    call_time: 'Öğleden sonra (13:00 - 17:00)',
    note: 'Ailem için tamamlayıcı sağlık sigortası kapsamı öğrenmek istiyorum.',
    product_extra: '3 Kişi',
    kvkk_accepted: true,
    marketing_consent: false,
    consent_version: 'v1.0',
    consent_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    referrer: null,
    status: 'Arandı',
    assigned_to: 'Ahmet Yetkili',
    first_contacted_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'sent_log',
    notify_error: null,
  },
  {
    id: 'b1290f04-080e-40d5-9c5e-821bc9cbb6f3',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    source_page: '/',
    product_slug: 'danisman',
    name: 'Mehmet Özkan',
    phone: '05553334455',
    email: null,
    call_time: 'Fark etmez',
    note: 'İş yeri yangın ve sorumluluk sigortası hakkında bilgi alabilir miyim?',
    product_extra: null,
    kvkk_accepted: true,
    marketing_consent: true,
    consent_version: 'v1.0',
    consent_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    referrer: null,
    status: 'Yeni',
    assigned_to: null,
    first_contacted_at: null,
    repeat_count: 2,
    last_repeated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notify_status: 'sent_log',
    notify_error: null,
  },
  {
    id: 'e7dcbca7-b721-4efd-9234-bf643edc32ad',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    source_page: '/teklif/zorunlu-trafik',
    product_slug: 'zorunlu-trafik',
    name: 'Zeynep Kaya',
    phone: '05304445566',
    email: 'zeynep@example.com',
    call_time: 'Akşam (17:00 - 19:00)',
    note: 'Trafik sigortası yenileme tarihim yaklaştı.',
    product_extra: null,
    kvkk_accepted: true,
    marketing_consent: false,
    consent_version: 'v1.0',
    consent_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    referrer: null,
    status: 'Teklif Verildi',
    assigned_to: 'Ahmet Yetkili',
    first_contacted_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'sent_log',
    notify_error: null,
  },
  {
    id: '8f030a98-67dd-4751-8cf2-72b6f97dcd54',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    source_page: '/teklif/dask',
    product_slug: 'dask',
    name: 'Mustafa Çelik',
    phone: '05425556677',
    email: 'mustafa@example.com',
    call_time: 'Fark etmez',
    note: 'DASK poliçemi yenilemek istiyorum.',
    product_extra: '120 m2 Daire',
    kvkk_accepted: true,
    marketing_consent: true,
    consent_version: 'v1.0',
    consent_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    referrer: null,
    status: 'Poliçeleşti',
    assigned_to: 'Ahmet Yetkili',
    first_contacted_at: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'sent_log',
    notify_error: null,
  },
];

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [allowDemoFallback, setAllowDemoFallback] = useState(false);

  // Veri Durumu
  const [mockLeads, setMockLeads] = useState<AdminLead[]>(INITIAL_MOCK_LEADS);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);

  // Filtreler
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Detay Çekmecesi
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [leadEvents, setLeadEvents] = useState<LeadEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [notifyConfigured, setNotifyConfigured] = useState<boolean | null>(null);
  const [renotifying, setRenotifying] = useState<boolean>(false);

  const isDemo = token === DEMO_TOKEN;

  // Sağlık ve Bildirim Yapılandırma Kontrolü
  useEffect(() => {
    if (token && token !== DEMO_TOKEN) {
      const targetApi = getApiBaseUrl();
      fetch(`${targetApi}/health`)
        .then((r) => r.json())
        .then((data) => {
          if (typeof data.notify_configured === 'boolean') {
            setNotifyConfigured(data.notify_configured);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // Noindex Meta Başlığı (Arama Motoru Koruması)
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  // Çıkış Yap
  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setLeads([]);
    setSelectedLead(null);
    setAllowDemoFallback(false);
  };

  // Önizleme / Demo Modunda Giriş
  const handleEnterDemo = () => {
    sessionStorage.setItem(STORAGE_KEY, DEMO_TOKEN);
    setToken(DEMO_TOKEN);
    setPassword('');
    setLoginError(null);
  };

  // Giriş Yap
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    setAllowDemoFallback(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const targetApi = getApiBaseUrl();
      const res = await fetch(`${targetApi}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Giriş başarısız oldu (${res.status}).`);
      }

      sessionStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      setPassword('');
    } catch (err: any) {
      clearTimeout(timeoutId);

      const isNetworkErr =
        err.name === 'AbortError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Sistem API servisine bağlanılamadı');

      if (isNetworkErr) {
        setLoginError('API servisine ulaşılamadı. Lütfen internet bağlantınızı kontrol ediniz.');
        if (password === '13Sigortaozkanliozkan') {
          setAllowDemoFallback(true);
        }
      } else {
        setLoginError(err.message || 'Hatalı şifre veya bağlantı sorunu.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Talepleri Yükle
  const fetchLeads = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);

    // 1. Demo / Önizleme Modu
    if (token === DEMO_TOKEN) {
      let filtered = [...mockLeads];
      if (statusFilter !== 'all') filtered = filtered.filter((l) => l.status === statusFilter);
      if (productFilter !== 'all') filtered = filtered.filter((l) => l.product_slug === productFilter);
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q)
        );
      }

      setLeads(filtered);
      setTotal(filtered.length);
      setTotalPages(1);
      setNewCount(mockLeads.filter((l) => l.status === 'Yeni').length);
      setDataLoading(false);
      return;
    }

    // 2. Canlı API Modu
    try {
      const targetApi = getApiBaseUrl();
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '50');
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (productFilter !== 'all') params.set('product_slug', productFilter);
      if (search.trim()) params.set('q', search.trim());
      if (dateStart) params.set('date_start', dateStart);
      if (dateEnd) params.set('date_end', dateEnd);

      const res = await fetch(`${targetApi}/admin/leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        handleLogout();
        throw new Error('Oturum süresi doldu, lütfen tekrar giriş yapınız.');
      }

      const data = await parseJsonResponse(res);
      if (data.success) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setNewCount(data.newCount || 0);
      }
    } catch (err: any) {
      console.error('[Admin] Talep yükleme hatası:', err.message);
    } finally {
      setDataLoading(false);
    }
  }, [token, mockLeads, page, statusFilter, productFilter, search, dateStart, dateEnd]);

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token, fetchLeads]);

  // Talep Detayı Açıldığında Olay Geçmişini Getir
  const handleSelectLead = async (lead: AdminLead) => {
    setSelectedLead(lead);
    setNewNote('');
    if (!token) return;

    if (token === DEMO_TOKEN) {
      setLeadEvents([
        {
          id: '1',
          lead_id: lead.id,
          created_at: lead.created_at,
          action: 'created',
          old_value: null,
          new_value: 'Talep oluşturuldu',
        },
        ...(lead.status !== 'Yeni'
          ? [
              {
                id: '2',
                lead_id: lead.id,
                created_at: lead.first_contacted_at || lead.created_at,
                action: 'status_change',
                old_value: 'Yeni',
                new_value: lead.status,
              },
            ]
          : []),
      ]);
      return;
    }

    setEventsLoading(true);
    try {
      const targetApi = getApiBaseUrl();
      const res = await fetch(`${targetApi}/admin/leads/${lead.id}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonResponse(res);
      if (data.success) {
        setLeadEvents(data.events || []);
      }
    } catch (err) {
      console.error('[Admin] Olay geçmişi hatası:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  // Talep Güncelle (Durum, Atanan, Not)
  const handleUpdateLead = async (updates: {
    status?: LeadStatus;
    assigned_to?: string | null;
    note?: string;
  }) => {
    if (!selectedLead || !token) return;
    setUpdating(true);

    // 1. Demo Modunda Güncelleme
    if (token === DEMO_TOKEN) {
      setTimeout(() => {
        const timestamp = new Date().toLocaleString('tr-TR');
        const updated = { ...selectedLead };

        if (updates.status) {
          updated.status = updates.status;
          if (updates.status === 'Arandı' && !updated.first_contacted_at) {
            updated.first_contacted_at = new Date().toISOString();
          }
        }
        if (updates.assigned_to !== undefined) {
          updated.assigned_to = updates.assigned_to;
        }
        if (updates.note && updates.note.trim()) {
          const entry = `[${timestamp} - Yetkili]: ${updates.note.trim()}`;
          updated.note = updated.note ? `${updated.note}\n${entry}` : entry;
        }

        setMockLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setSelectedLead(updated);
        setNewNote('');
        setUpdating(false);
      }, 200);
      return;
    }

    // 2. Canlı API Modunda Güncelleme
    try {
      const targetApi = getApiBaseUrl();
      const res = await fetch(`${targetApi}/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await parseJsonResponse(res);
      if (data.success) {
        setSelectedLead(data.lead);
        setNewNote('');
        fetchLeads();
        // Olay geçmişini güncelle
        const evRes = await fetch(`${targetApi}/admin/leads/${selectedLead.id}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const evData = await parseJsonResponse(evRes);
        if (evData.success) setLeadEvents(evData.events || []);
      }
    } catch (err) {
      console.error('[Admin] Güncelleme hatası:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Başarısız / Kısmi Bildirimi Yeniden Tetikle (Renotify)
  const handleRenotify = async (leadId: string) => {
    if (!selectedLead || !token) return;
    setRenotifying(true);

    if (token === DEMO_TOKEN) {
      setTimeout(() => {
        const updated = {
          ...selectedLead,
          notify_status: 'sent',
          notify_error: null,
        };
        setSelectedLead(updated);
        setMockLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setRenotifying(false);
      }, 400);
      return;
    }

    try {
      const targetApi = getApiBaseUrl();
      const res = await fetch(`${targetApi}/admin/leads/${leadId}/renotify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonResponse(res);
      if (data.success && data.lead) {
        setSelectedLead(data.lead);
        fetchLeads();
        // Olay geçmişini yenile
        const evRes = await fetch(`${targetApi}/admin/leads/${leadId}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const evData = await parseJsonResponse(evRes);
        if (evData.success) setLeadEvents(evData.events || []);
      }
    } catch (err: any) {
      console.error('[Admin] Renotify hatası:', err.message);
    } finally {
      setRenotifying(false);
    }
  };

  // CSV Dışa Aktar
  const handleExportCsv = async () => {
    if (!token) return;

    if (token === DEMO_TOKEN) {
      const headers = ['ID', 'Tarih', 'Ürün', 'Müşteri', 'Telefon', 'Durum', 'Not'];
      const rows = mockLeads.map((l) => [l.id, l.created_at, l.product_slug, l.name, l.phone, l.status, l.note || '']);
      const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `13sigorta-talepler-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      return;
    }

    try {
      const targetApi = getApiBaseUrl();
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (productFilter !== 'all') params.set('product_slug', productFilter);
      if (search.trim()) params.set('q', search.trim());
      if (dateStart) params.set('date_start', dateStart);
      if (dateEnd) params.set('date_end', dateEnd);

      const res = await fetch(`${targetApi}/admin/leads/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Dışa aktarma başarısız oldu.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `13sigorta-talepler-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err: any) {
      alert(err.message || 'CSV indirilemedi.');
    }
  };

  // 1. Giriş Formu (Oturum Açılmamışsa)
  if (!token) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4 mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-center text-slate-900 mb-1">
            {siteConfig.acenteKisaAd} - Yönetici Girişi
          </h1>
          <p className="text-xs text-center text-slate-500 mb-6">
            Gelen teklif taleplerini görüntülemek ve yönetmek için şifrenizi giriniz.
          </p>

          {loginError && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>

              {allowDemoFallback && (
                <div className="pt-2 border-t border-rose-200/60">
                  <button
                    type="button"
                    onClick={handleEnterDemo}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white py-2 text-xs font-semibold shadow-xs transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Şifreniz Doğru: Önizleme Modunda Paneli Aç</span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-1">
                    (API henüz aktif olmadığı için paneli örnek verilerle hemen test edebilirsiniz)
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pwd" className="block text-xs font-semibold text-slate-700 mb-1">
                Yönetici Şifresi
              </label>
              <input
                id="admin-pwd"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow hover:bg-sky-700 active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{loginLoading ? 'Giriş Yapılıyor...' : 'Oturum Aç'}</span>
            </button>
          </form>

          <PwaInstallButton variant="admin" className="mt-5" />

          <p className="text-[11px] text-center text-slate-400 mt-6">
            Bu ekran yetkisiz erişimlere ve arama motorlarına kapalıdır (noindex).
          </p>
        </div>
      </div>
    );
  }

  // 2. Admin Dashboard (Oturum Açılmışsa)
  return (
    <div className="min-h-screen bg-slate-50 py-6 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Demo / Önizleme Modu Bilgilendirme Bandı */}
        {isDemo && (
          <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 sm:p-4 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Önizleme / Demo Modu:</strong> Canlı API servisi henüz aktif olmadığı için panel yerel önizleme verileriyle çalışmaktadır. Tüm filtreleri, not eklemeyi ve CSV indirmeyi test edebilirsiniz.
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-3 shrink-0 rounded-lg bg-amber-200/60 px-2.5 py-1 font-semibold text-amber-900 hover:bg-amber-200"
            >
              Canlı Girişe Dön
            </button>
          </div>
        )}

        {/* Bildirim Yapılandırma Uyarısı */}
        {notifyConfigured === false && !isDemo && (
          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 sm:p-4 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Bildirim Yapılandırması Eksik:</strong> Dış bildirim kanalları (E-posta veya WhatsApp Cloud API) henüz ortam değişkenlerinde tanımlanmamış. Müşteri talepleri veritabanına eksiksiz kaydedilmektedir, ancak harici bildirim gönderilememektedir.
            </span>
          </div>
        )}

        {/* Üst Yönetici Başlık Çubuğu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Talep Yönetim Paneli
              </h1>
              {newCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 animate-pulse">
                  {newCount} Yeni Talep
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {siteConfig.acenteKisaAd} • {total} başvuru listeleniyor {isDemo ? '(Önizleme Modu)' : `(${getApiBaseUrl()})`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PwaInstallButton variant="header" className="!text-xs !py-2 !px-3" />

            <button
              type="button"
              onClick={fetchLeads}
              disabled={dataLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              title="Yenile"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Yenile</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              title="CSV Dışa Aktar"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>CSV İndir</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 transition-all"
              title="Çıkış Yap"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Filtre ve Arama Araç Çubuğu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="İsim veya telefon ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="Yeni">Yeni</option>
              <option value="Arandı">Arandı</option>
              <option value="Ulaşılamadı">Ulaşılamadı</option>
              <option value="Teklif Verildi">Teklif Verildi</option>
              <option value="Poliçeleşti">Poliçeleşti</option>
              <option value="İptal">İptal</option>
              <option value="Kaybedildi">Kaybedildi</option>
            </select>
          </div>

          {/* Ürün Filtresi */}
          <div>
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
            >
              <option value="all">Tüm Ürünler</option>
              <option value="kasko">Kasko</option>
              <option value="zorunlu-trafik">Zorunlu Trafik</option>
              <option value="tamamlayici-saglik">Tamamlayıcı Sağlık</option>
              <option value="bireysel-emeklilik">Bireysel Emeklilik</option>
              <option value="dask">DASK</option>
              <option value="konut">Konut</option>
              <option value="seyahat-saglik">Seyahat Sağlık</option>
              <option value="dijital-doktor">Dijital Doktor</option>
              <option value="evcil-hayvan">Evcil Hayvan</option>
              <option value="danisman">Danışman Talebi</option>
            </select>
          </div>

          {/* Tarih Başlangıç */}
          <div>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
              title="Başlangıç Tarihi"
            />
          </div>

          {/* Tarih Bitiş */}
          <div>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
              title="Bitiş Tarihi"
            />
          </div>
        </div>

        {/* Talep Tablosu (Masaüstü) / Kart Listesi (Mobil) */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {dataLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Yükleniyor...</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Kriterlere uygun başvuru bulunamadı.
            </div>
          ) : (
            <>
              {/* Masaüstü Tablo */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Tarih</th>
                      <th className="py-3 px-4">Ürün</th>
                      <th className="py-3 px-4">Müşteri</th>
                      <th className="py-3 px-4">Telefon</th>
                      <th className="py-3 px-4">Arama Tercihi</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Tekrar</th>
                      <th className="py-3 px-4">İlk Dönüş</th>
                      <th className="py-3 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => {
                      const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS.Yeni;
                      let contactTimeStr = '-';
                      if (lead.first_contacted_at) {
                        const mins = Math.max(
                          0,
                          Math.round(
                            (new Date(lead.first_contacted_at).getTime() -
                              new Date(lead.created_at).getTime()) /
                              60000
                          )
                        );
                        contactTimeStr = mins < 60 ? `${mins} dk` : `${Math.round(mins / 60)} sa`;
                      }

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          onClick={() => handleSelectLead(lead)}
                        >
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                            {new Date(lead.created_at).toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex rounded-lg bg-sky-50 px-2 py-0.5 font-semibold text-sky-700">
                              {lead.product_slug}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{lead.name}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <a
                              href={`tel:${lead.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sky-700 hover:underline font-mono font-medium"
                            >
                              {lead.phone}
                            </a>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            {lead.call_time}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            {lead.repeat_count > 1 ? (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                                #{lead.repeat_count}
                              </span>
                            ) : (
                              <span className="text-slate-300">1</span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                            {contactTimeStr}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={buildAdminWhatsAppLink(lead)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Müşteriye WhatsApp Web'den mesaj yaz"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                              >
                                <MessageSquare className="h-3 w-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectLead(lead);
                                }}
                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                              >
                                Detay
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobil Kart Görünümü */}
              <div className="md:hidden divide-y divide-slate-100">
                {leads.map((lead) => {
                  const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS.Yeni;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className="p-4 space-y-2 active:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(lead.created_at).toLocaleString('tr-TR')}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                          <p className="text-xs text-sky-700 font-mono mt-0.5">{lead.phone}</p>
                        </div>
                        <span className="rounded-lg bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                          {lead.product_slug}
                        </span>
                      </div>

                      {lead.note && (
                        <p className="text-xs text-slate-600 line-clamp-1 bg-slate-50 p-2 rounded-lg">
                          {lead.note}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <a
                          href={buildAdminWhatsAppLink(lead)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-semibold hover:bg-emerald-100"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                          <span>WhatsApp'tan Yaz</span>
                        </a>
                        <span className="text-xs font-semibold text-sky-700">Detay Gör →</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-slate-50 text-xs text-slate-600">
                  <span>
                    Sayfa {page} / {totalPages} (Toplam {total})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-700 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-700 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DETAY VE YÖNETİM ÇEKMECESİ / MODALI */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setSelectedLead(null)}
            aria-hidden="true"
          />

          <div className="relative w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Çekmece Başlığı */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 p-4 text-white">
              <div>
                <h2 className="font-bold text-base leading-tight">Talep Detayı & İşlemler</h2>
                <p className="text-xs text-slate-400 mt-0.5">ID: {selectedLead.id.slice(0, 8)}...</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* İçerik */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Müşteri ve İletişim Kartı */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{selectedLead.name}</h3>
                  <span className="rounded-lg bg-sky-100 text-sky-800 px-2 py-0.5 text-xs font-bold">
                    {selectedLead.product_slug}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Telefon:</span>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="font-mono font-semibold text-sky-700 hover:underline"
                    >
                      {selectedLead.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">E-posta:</span>
                    <span className="font-medium text-slate-800">
                      {selectedLead.email || 'Belirtilmedi'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Arama Tercihi:</span>
                    <span className="font-medium text-slate-800">{selectedLead.call_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Başvuru Tarihi:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(selectedLead.created_at).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>

                {selectedLead.product_extra && (
                  <div className="text-xs border-t border-slate-200 pt-2">
                    <span className="text-slate-500 font-semibold">Ürüne Özel Bilgi:</span>{' '}
                    <span className="text-slate-800">{selectedLead.product_extra}</span>
                  </div>
                )}

                {/* Doğrudan WhatsApp Web / Uygulama Yönlendirmesi */}
                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={buildAdminWhatsAppLink(selectedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-2.5 px-4 text-xs font-bold shadow-sm transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp'tan Yaz (Web / Uygulama)</span>
                  </a>
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Meta Cloud API gerekmeden doğrudan WhatsApp Web üzerinden hazır teklif mesajını açar.
                  </p>
                </div>

                {/* Bildirim Durumu & Yeniden Bildir (Failed/Partial) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-200 pt-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-semibold">Bildirim Durumu:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        selectedLead.notify_status === 'sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedLead.notify_status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedLead.notify_status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedLead.notify_status || 'pending'}
                    </span>
                    {selectedLead.notify_error && (
                      <span className="text-[10px] text-rose-600 font-mono">
                        ({selectedLead.notify_error})
                      </span>
                    )}
                  </div>

                  {(selectedLead.notify_status === 'failed' || selectedLead.notify_status === 'partial') && (
                    <button
                      type="button"
                      disabled={renotifying}
                      onClick={() => handleRenotify(selectedLead.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-900 disabled:opacity-50 transition-all shrink-0"
                    >
                      <RefreshCw className={`h-3 w-3 ${renotifying ? 'animate-spin' : ''}`} />
                      <span>{renotifying ? 'Bildiriliyor...' : 'Yeniden Bildir'}</span>
                    </button>
                  )}
                </div>

                {/* Tek Tıkla WhatsApp İletişim Butonu (Cihaz Tespitiyle) */}
                {(() => {
                  const waMsg = `Merhaba Sayın ${selectedLead.name}, 13 SİGORTA'dan arıyorum. Web sitemizden iletmiş olduğunuz ${selectedLead.product_slug} teklif talebinizle ilgili görüşebilir miyiz?`;
                  const waUrl = buildWhatsAppLink(
                    selectedLead.phone.replace(/\D/g, ''),
                    waMsg
                  );
                  return (
                    <div className="pt-2 border-t border-slate-200">
                      <a
                        href={waUrl.primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-semibold shadow-sm transition-all"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Müşteriye WhatsApp'tan Yaz</span>
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Durum ve Temsilci Atama Formu */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Talep Durumu & Temsilci
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Durum
                    </label>
                    <select
                      value={selectedLead.status}
                      disabled={updating}
                      onChange={(e) =>
                        handleUpdateLead({ status: e.target.value as LeadStatus })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                    >
                      <option value="Yeni">Yeni</option>
                      <option value="Arandı">Arandı</option>
                      <option value="Ulaşılamadı">Ulaşılamadı</option>
                      <option value="Teklif Verildi">Teklif Verildi</option>
                      <option value="Poliçeleşti">Poliçeleşti</option>
                      <option value="İptal">İptal</option>
                      <option value="Kaybedildi">Kaybedildi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Atanan Yetkili
                    </label>
                    <input
                      type="text"
                      placeholder="Temsilci Adı"
                      value={selectedLead.assigned_to || ''}
                      disabled={updating}
                      onBlur={(e) => handleUpdateLead({ assigned_to: e.target.value })}
                      onChange={(e) =>
                        setSelectedLead({ ...selectedLead, assigned_to: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Not Ekleme ve Not Geçmişi */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Notlar ve Görüşme Geçmişi
                </h4>

                {selectedLead.note ? (
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 space-y-1 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-200">
                    {selectedLead.note}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Henüz not eklenmemiş.</p>
                )}

                <div className="pt-2">
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Yeni görüşme notu ekle..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      disabled={updating || !newNote.trim()}
                      onClick={() => handleUpdateLead({ note: newNote })}
                      className="rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" />
                      <span>Notu Kaydet</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Olay Zaman Çizelgesi (Audit Trail) */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  <span>Olay Geçmişi</span>
                </h4>

                {eventsLoading ? (
                  <p className="text-xs text-slate-400">Yükleniyor...</p>
                ) : leadEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Olay kaydı bulunmuyor.</p>
                ) : (
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2 text-xs">
                    {leadEvents.map((ev) => (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-sky-500" />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(ev.created_at).toLocaleString('tr-TR')}
                        </span>
                        <p className="text-slate-800 font-medium">
                          {ev.action === 'created'
                            ? 'Talep Oluşturuldu'
                            : ev.action === 'status_change'
                            ? `Durum Değişti: ${ev.old_value || '-'} ➔ ${ev.new_value}`
                            : ev.action === 'note_added'
                            ? `Not Eklendi: ${ev.new_value}`
                            : ev.action === 'repeat_request'
                            ? `${ev.new_value}`
                            : `${ev.action}: ${ev.new_value || ''}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Yasal Uyumluluk ve Onay Kaydı */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-[11px] text-slate-500 space-y-1">
                <p>
                  <strong>KVKK Sürümü:</strong> {selectedLead.consent_version} (Onay:{' '}
                  {new Date(selectedLead.consent_at).toLocaleString('tr-TR')})
                </p>
                <p>
                  <strong>Ticari Elektronik İleti:</strong>{' '}
                  {selectedLead.marketing_consent ? 'Onaylandı' : 'Onaylanmadı'}
                </p>
                <p>
                  <strong>Kaynak Sayfa:</strong> {selectedLead.source_page}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
