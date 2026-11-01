export type LeadStatus = 'Yeni' | 'Arandı' | 'Ulaşılamadı' | 'Teklif Verildi' | 'Poliçeleşti' | 'İptal' | 'Kaybedildi';

export interface Lead {
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
  ip_hash: string;
  status: LeadStatus;
  assigned_to: string | null;
  first_contacted_at: string | null;
  repeat_count: number;
  last_repeated_at: string | null;
  notify_status: string;
  notify_error: string | null;
}

export type AdminLead = Omit<Lead, 'ip_hash'>;

export interface LeadEvent {
  id: string;
  lead_id: string;
  created_at: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
}

export interface CreateLeadDto {
  source_page?: string;
  product_slug: string;
  name: string;
  phone: string;
  email?: string;
  call_time?: string;
  note?: string;
  product_extra?: string;
  kvkk_accepted: boolean;
  marketing_consent?: boolean;
  consent_version?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  // Bot koruması (honeypot & timing)
  _gotcha?: string;
  form_start_time?: number;
}

export interface LeadFilter {
  product_slug?: string;
  status?: string;
  date_start?: string;
  date_end?: string;
  q?: string;
  limit?: number;
  offset?: number;
  page?: number;
}
