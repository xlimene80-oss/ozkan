import { pool } from '../db/client.js';
import { CreateLeadDto, Lead, AdminLead, LeadFilter, LeadEvent, LeadStatus } from '../types/lead.js';
import { normalizePhoneNumber } from '../utils/phoneNormalizer.js';
import { hashIp, sanitizeString, sanitizeCsvCell } from '../utils/security.js';
import { dispatchLeadNotification } from './notificationService.js';
import crypto from 'crypto';

// In-memory fallback (PostgreSQL bağlantısı olmadığında test ve çevrimdışı geliştirme için)
const inMemoryLeads: Map<string, Lead> = new Map();
const inMemoryLeadEvents: LeadEvent[] = [];

/**
 * Lead nesnesinden ip_hash alanını çıkartarak AdminLead tipine dönüştürür.
 * Güvenlik ve Gizlilik kuralı: ip_hash veya ham IP hiçbir koşulda admin arayüzüne gönderilmez.
 */
function sanitizeLeadForAdmin(lead: Lead): AdminLead {
  const { ip_hash, ...rest } = lead;
  return rest;
}

export async function createOrUpdateLead(
  dto: CreateLeadDto,
  clientIp: string | undefined
): Promise<{ success: boolean; leadId: string; isRepeat: boolean; message: string }> {
  // 1. KVKK Onayı Zorunluluğu
  if (!dto.kvkk_accepted) {
    throw new Error('KVKK aydınlatma onayı zorunludur.');
  }

  // 2. Bot / Spam Koruması: Honeypot kontrolü
  if (dto._gotcha && dto._gotcha.trim().length > 0) {
    // Bot yakalandı: Sessizce başarı dön
    return {
      success: true,
      leadId: crypto.randomUUID(),
      isRepeat: false,
      message: 'Talebiniz başarıyla alındı.',
    };
  }

  // 3. Bot / Spam Koruması: Minimum form doldurma süresi (2.5 saniye)
  if (dto.form_start_time) {
    const elapsedSeconds = (Date.now() - Number(dto.form_start_time)) / 1000;
    if (elapsedSeconds < 2.5) {
      return {
        success: true,
        leadId: crypto.randomUUID(),
        isRepeat: false,
        message: 'Talebiniz başarıyla alındı.',
      };
    }
  }

  // 4. Telefon Normalizasyonu
  const normalizedPhone = normalizePhoneNumber(dto.phone);
  if (!normalizedPhone) {
    throw new Error('Lütfen geçerli bir Türkiye cep telefonu numarası giriniz (05xx...).');
  }

  // 5. Girdi Temizleme ve Sınırlandırma
  const sanitizedName = sanitizeString(dto.name, 150);
  if (!sanitizedName || sanitizedName.length < 2) {
    throw new Error('Lütfen geçerli bir Ad Soyad giriniz.');
  }

  const sanitizedEmail = dto.email ? sanitizeString(dto.email, 255) : null;
  const sanitizedProductSlug = sanitizeString(dto.product_slug, 100);
  if (!sanitizedProductSlug) {
    throw new Error('Lütfen ilgilendiğiniz ürünü belirtiniz.');
  }

  const sanitizedCallTime = sanitizeString(dto.call_time || 'Fark etmez', 50);
  const sanitizedNote = dto.note ? sanitizeString(dto.note, 500) : null;
  const sanitizedProductExtra = dto.product_extra ? sanitizeString(dto.product_extra, 255) : null;
  const sanitizedSourcePage = sanitizeString(dto.source_page || '/teklif/' + sanitizedProductSlug, 255);
  const consentVersion = sanitizeString(dto.consent_version || 'v1.0', 50);

  const utmSource = dto.utm_source ? sanitizeString(dto.utm_source, 100) : null;
  const utmMedium = dto.utm_medium ? sanitizeString(dto.utm_medium, 100) : null;
  const utmCampaign = dto.utm_campaign ? sanitizeString(dto.utm_campaign, 100) : null;
  const referrer = dto.referrer ? sanitizeString(dto.referrer, 500) : null;
  const ipHashed = hashIp(clientIp);

  const timestampStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

  // 6. 24 Saat İçinde Tekrar Talep Kontrolü (notun üzerine yazılmaz, tarih damgasıyla altına eklenir)
  if (pool) {
    const checkSql = `
      SELECT id, repeat_count, note
      FROM leads
      WHERE phone = $1 AND product_slug = $2 AND created_at > NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const checkRes = await pool.query(checkSql, [normalizedPhone, sanitizedProductSlug]);

    if (checkRes.rows.length > 0) {
      const existing = checkRes.rows[0];
      const newRepeatCount = (existing.repeat_count || 1) + 1;
      const existingNote = existing.note || '';
      const newEntry = sanitizedNote
        ? `[${timestampStr} - TEKRAR TALEP]: ${sanitizedNote}`
        : `[${timestampStr} - TEKRAR TALEP]`;
      const combinedNote = existingNote ? `${existingNote}\n${newEntry}` : newEntry;

      const updateSql = `
        UPDATE leads
        SET repeat_count = $1, last_repeated_at = NOW(), note = $2
        WHERE id = $3
        RETURNING *;
      `;
      const updateRes = await pool.query(updateSql, [newRepeatCount, combinedNote, existing.id]);
      const updatedLead = updateRes.rows[0] as Lead;

      // Olay kaydı
      await recordLeadEvent(existing.id, 'repeat_request', `Tekrar Talep #${newRepeatCount}`);

      // Bildirim tetikle
      dispatchLeadNotification(updatedLead).catch((err) =>
        console.error('[Notification Error]:', err.message)
      );

      return {
        success: true,
        leadId: existing.id,
        isRepeat: true,
        message: 'Talebiniz sistemimizde kayıtlıdır, en kısa sürede sizinle iletişime geçeceğiz.',
      };
    }

    // Yeni Kayıt Ekle
    const insertSql = `
      INSERT INTO leads (
        source_page, product_slug, name, phone, email, call_time, note,
        product_extra, kvkk_accepted, marketing_consent, consent_version, consent_at,
        utm_source, utm_medium, utm_campaign, referrer, ip_hash, status, repeat_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(),
        $12, $13, $14, $15, $16, 'Yeni', 1
      )
      RETURNING *;
    `;

    const values = [
      sanitizedSourcePage,
      sanitizedProductSlug,
      sanitizedName,
      normalizedPhone,
      sanitizedEmail,
      sanitizedCallTime,
      sanitizedNote,
      sanitizedProductExtra,
      true,
      Boolean(dto.marketing_consent),
      consentVersion,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      ipHashed,
    ];

    const insertRes = await pool.query(insertSql, values);
    const newLead = insertRes.rows[0] as Lead;

    // Olay kaydı
    await recordLeadEvent(newLead.id, 'created', 'Yeni talep oluşturuldu');

    // Bildirim tetikle (asenkron ve talep kaydını engellemeden)
    dispatchLeadNotification(newLead)
      .then((summary) => updateLeadNotificationResult(newLead.id, summary.notify_status, summary.notify_error))
      .catch((err) => console.error('[Notification Error]:', err.message));

    return {
      success: true,
      leadId: newLead.id,
      isRepeat: false,
      message: 'Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    };
  }

  // Fallback: In-memory store (Veritabanı bağlantısı yoksa, dev/test ortamında)
  const now = new Date();
  const existingInMemory = Array.from(inMemoryLeads.values()).find((l) => {
    const isSamePhone = l.phone === normalizedPhone;
    const isSameProduct = l.product_slug === sanitizedProductSlug;
    const diffHours = (now.getTime() - new Date(l.created_at).getTime()) / (1000 * 60 * 60);
    return isSamePhone && isSameProduct && diffHours < 24;
  });

  if (existingInMemory) {
    existingInMemory.repeat_count += 1;
    existingInMemory.last_repeated_at = now.toISOString();

    const newEntry = sanitizedNote
      ? `[${timestampStr} - TEKRAR TALEP]: ${sanitizedNote}`
      : `[${timestampStr} - TEKRAR TALEP]`;

    existingInMemory.note = existingInMemory.note
      ? `${existingInMemory.note}\n${newEntry}`
      : newEntry;

    // Olay kaydı
    await recordLeadEvent(existingInMemory.id, 'repeat_request', `Tekrar Talep #${existingInMemory.repeat_count}`);

    // Bildirimi tekrar tetikle
    dispatchLeadNotification(existingInMemory)
      .then((summary) => updateLeadNotificationResult(existingInMemory.id, summary.notify_status, summary.notify_error))
      .catch(() => {});

    return {
      success: true,
      leadId: existingInMemory.id,
      isRepeat: true,
      message: 'Talebiniz sistemimizde kayıtlıdır, en kısa sürede sizinle iletişime geçeceğiz.',
    };
  }

  const generatedId = crypto.randomUUID();
  const memoryLead: Lead = {
    id: generatedId,
    created_at: now.toISOString(),
    source_page: sanitizedSourcePage,
    product_slug: sanitizedProductSlug,
    name: sanitizedName,
    phone: normalizedPhone,
    email: sanitizedEmail,
    call_time: sanitizedCallTime,
    note: sanitizedNote,
    product_extra: sanitizedProductExtra,
    kvkk_accepted: true,
    marketing_consent: Boolean(dto.marketing_consent),
    consent_version: consentVersion,
    consent_at: now.toISOString(),
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    referrer,
    ip_hash: ipHashed,
    status: 'Yeni',
    assigned_to: null,
    first_contacted_at: null,
    repeat_count: 1,
    last_repeated_at: null,
    notify_status: 'pending',
    notify_error: null,
  };

  inMemoryLeads.set(generatedId, memoryLead);
  await recordLeadEvent(generatedId, 'created', 'Yeni talep oluşturuldu');
  dispatchLeadNotification(memoryLead)
    .then((summary) => updateLeadNotificationResult(memoryLead.id, summary.notify_status, summary.notify_error))
    .catch(() => {});

  return {
    success: true,
    leadId: generatedId,
    isRepeat: false,
    message: 'Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
  };
}

/**
 * Talep olay geçmişi kaydı (Olay Zaman Çizelgesi)
 */
export async function recordLeadEvent(
  leadId: string,
  action: string,
  newValue?: string | null,
  oldValue?: string | null
): Promise<void> {
  const event: LeadEvent = {
    id: crypto.randomUUID(),
    lead_id: leadId,
    created_at: new Date().toISOString(),
    action,
    old_value: oldValue || null,
    new_value: newValue || null,
  };

  if (pool) {
    try {
      const sql = `
        INSERT INTO lead_events (id, lead_id, action, old_value, new_value, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `;
      await pool.query(sql, [event.id, leadId, action, oldValue || null, newValue || null]);
    } catch (e: any) {
      console.error('[DB LeadEvent Error]:', e.message);
    }
  } else {
    inMemoryLeadEvents.push(event);
  }
}

/**
 * Belirli bir talebe ait olay geçmişini döner
 */
export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
  if (pool) {
    const res = await pool.query(
      'SELECT id, lead_id, created_at, action, old_value, new_value FROM lead_events WHERE lead_id = $1 ORDER BY created_at DESC',
      [leadId]
    );
    return res.rows;
  }
  return inMemoryLeadEvents
    .filter((e) => e.lead_id === leadId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Admin Leads Listesi (Filtreleme, Sayfalama, ip_hash Hariç Tutma)
 */
export async function getLeads(filter: LeadFilter): Promise<{
  leads: AdminLead[];
  total: number;
  page: number;
  totalPages: number;
  newCount: number;
}> {
  const page = Math.max(1, Number(filter.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filter.limit) || 50));
  const offset = (page - 1) * limit;

  if (pool) {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filter.product_slug && filter.product_slug !== 'all') {
      conditions.push(`product_slug = $${idx++}`);
      values.push(filter.product_slug);
    }
    if (filter.status && filter.status !== 'all') {
      conditions.push(`status = $${idx++}`);
      values.push(filter.status);
    }
    if (filter.date_start) {
      conditions.push(`created_at >= $${idx++}`);
      values.push(filter.date_start);
    }
    if (filter.date_end) {
      conditions.push(`created_at <= $${idx++}`);
      values.push(filter.date_end);
    }
    if (filter.q) {
      conditions.push(`(name ILIKE $${idx} OR phone ILIKE $${idx})`);
      values.push(`%${filter.q}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM leads ${whereClause}`;
    const countRes = await pool.query(countSql, values);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const newCountSql = `SELECT COUNT(*) as new_count FROM leads WHERE status = 'Yeni'`;
    const newCountRes = await pool.query(newCountSql);
    const newCount = parseInt(newCountRes.rows[0]?.new_count || '0', 10);

    const selectSql = `
      SELECT id, created_at, source_page, product_slug, name, phone, email,
             call_time, note, product_extra, kvkk_accepted, marketing_consent,
             consent_version, consent_at, utm_source, utm_medium, utm_campaign,
             referrer, status, assigned_to, first_contacted_at, repeat_count,
             last_repeated_at, notify_status, notify_error
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const leadsRes = await pool.query(selectSql, [...values, limit, offset]);

    return {
      leads: leadsRes.rows as AdminLead[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      newCount,
    };
  }

  // In-memory mod
  let all = Array.from(inMemoryLeads.values());

  if (filter.product_slug && filter.product_slug !== 'all') {
    all = all.filter((l) => l.product_slug === filter.product_slug);
  }
  if (filter.status && filter.status !== 'all') {
    all = all.filter((l) => l.status === filter.status);
  }
  if (filter.date_start) {
    const start = new Date(filter.date_start).getTime();
    all = all.filter((l) => new Date(l.created_at).getTime() >= start);
  }
  if (filter.date_end) {
    const end = new Date(filter.date_end).getTime();
    all = all.filter((l) => new Date(l.created_at).getTime() <= end);
  }
  if (filter.q) {
    const qLower = filter.q.toLowerCase();
    all = all.filter(
      (l) => l.name.toLowerCase().includes(qLower) || l.phone.includes(filter.q!)
    );
  }

  const total = all.length;
  const newCount = Array.from(inMemoryLeads.values()).filter((l) => l.status === 'Yeni').length;

  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const paginated = all.slice(offset, offset + limit).map(sanitizeLeadForAdmin);

  return {
    leads: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    newCount,
  };
}

/**
 * Talep Güncelleme (Durum, Atanan Temsilci, Not Ekleme, İlk Dönüş Süresi)
 */
export async function updateLead(
  id: string,
  updates: { status?: LeadStatus; note?: string; assigned_to?: string | null },
  adminName = 'Yetkili'
): Promise<AdminLead> {
  const timestampStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

  if (pool) {
    const currentRes = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      throw new Error('Talep bulunamadı.');
    }
    const current = currentRes.rows[0] as Lead;

    const setClauses: string[] = [];
    const values: any[] = [];
    let idx = 1;

    // 1. Durum Değişikliği
    if (updates.status && updates.status !== current.status) {
      setClauses.push(`status = $${idx++}`);
      values.push(updates.status);

      // İlk kez "Arandı" durumuna geçtiğinde first_contacted_at damgalanır
      if (updates.status === 'Arandı' && !current.first_contacted_at) {
        setClauses.push(`first_contacted_at = NOW()`);
      }

      await recordLeadEvent(id, 'status_change', updates.status, current.status);
    }

    // 2. Temsilci Atama
    if (updates.assigned_to !== undefined && updates.assigned_to !== current.assigned_to) {
      setClauses.push(`assigned_to = $${idx++}`);
      values.push(updates.assigned_to);
      await recordLeadEvent(id, 'assigned_to', updates.assigned_to, current.assigned_to);
    }

    // 3. Not Ekleme (Mevcut notun altına tarih damgalı eklenir)
    if (updates.note && updates.note.trim()) {
      const sanitizedNewNote = sanitizeString(updates.note, 500);
      const noteEntry = `[${timestampStr} - ${adminName}]: ${sanitizedNewNote}`;
      const combinedNote = current.note ? `${current.note}\n${noteEntry}` : noteEntry;
      setClauses.push(`note = $${idx++}`);
      values.push(combinedNote);
      await recordLeadEvent(id, 'note_added', sanitizedNewNote);
    }

    if (setClauses.length === 0) {
      return sanitizeLeadForAdmin(current);
    }

    const updateSql = `
      UPDATE leads
      SET ${setClauses.join(', ')}
      WHERE id = $${idx++}
      RETURNING *;
    `;
    values.push(id);
    const result = await pool.query(updateSql, values);
    return sanitizeLeadForAdmin(result.rows[0] as Lead);
  }

  // In-memory mod
  const lead = inMemoryLeads.get(id);
  if (!lead) {
    throw new Error('Talep bulunamadı.');
  }

  if (updates.status && updates.status !== lead.status) {
    const oldStatus = lead.status;
    lead.status = updates.status;
    if (updates.status === 'Arandı' && !lead.first_contacted_at) {
      lead.first_contacted_at = new Date().toISOString();
    }
    await recordLeadEvent(id, 'status_change', updates.status, oldStatus);
  }

  if (updates.assigned_to !== undefined && updates.assigned_to !== lead.assigned_to) {
    const oldAssigned = lead.assigned_to;
    lead.assigned_to = updates.assigned_to;
    await recordLeadEvent(id, 'assigned_to', updates.assigned_to, oldAssigned);
  }

  if (updates.note && updates.note.trim()) {
    const sanitizedNewNote = sanitizeString(updates.note, 500);
    const noteEntry = `[${timestampStr} - ${adminName}]: ${sanitizedNewNote}`;
    lead.note = lead.note ? `${lead.note}\n${noteEntry}` : noteEntry;
    await recordLeadEvent(id, 'note_added', sanitizedNewNote);
  }

  return sanitizeLeadForAdmin(lead);
}

/**
 * CSV Dışa Aktarımı (UTF-8 BOM + Formül Enjeksiyonu Korumalı)
 */
export async function exportLeadsToCsv(filter: LeadFilter): Promise<string> {
  // Filtreye göre kayıtları al (limit 5000)
  const result = await getLeads({ ...filter, limit: 5000, page: 1 });
  const leads = result.leads;

  const headers = [
    'ID',
    'Tarih',
    'Kaynak Sayfa',
    'Ürün',
    'Müşteri Adı',
    'Telefon',
    'E-posta',
    'Arama Tercihi',
    'Durum',
    'Atanan Temsilci',
    'İlk Dönüş Süresi (dk)',
    'Tekrar Sayısı',
    'Ek Bilgi',
    'Notlar',
    'KVKK Sürümü',
    'KVKK Onay Zamanı',
    'Pazarlama Onayı',
  ];

  const rows = leads.map((lead) => {
    // İlk dönüş süresi hesaplama (dakika)
    let contactMinutes = '';
    if (lead.first_contacted_at) {
      const created = new Date(lead.created_at).getTime();
      const contacted = new Date(lead.first_contacted_at).getTime();
      contactMinutes = Math.max(0, Math.round((contacted - created) / 60000)).toString();
    }

    return [
      sanitizeCsvCell(lead.id),
      sanitizeCsvCell(new Date(lead.created_at).toLocaleString('tr-TR')),
      sanitizeCsvCell(lead.source_page),
      sanitizeCsvCell(lead.product_slug),
      sanitizeCsvCell(lead.name),
      sanitizeCsvCell(lead.phone),
      sanitizeCsvCell(lead.email || ''),
      sanitizeCsvCell(lead.call_time),
      sanitizeCsvCell(lead.status),
      sanitizeCsvCell(lead.assigned_to || ''),
      sanitizeCsvCell(contactMinutes),
      sanitizeCsvCell(lead.repeat_count),
      sanitizeCsvCell(lead.product_extra || ''),
      sanitizeCsvCell(lead.note || ''),
      sanitizeCsvCell(lead.consent_version),
      sanitizeCsvCell(new Date(lead.consent_at).toLocaleString('tr-TR')),
      sanitizeCsvCell(lead.marketing_consent ? 'Evet' : 'Hayır'),
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ile başla (Excel Türkçe karakter desteği için)
  return '\uFEFF' + headers.join(',') + '\r\n' + rows.join('\r\n');
}

export async function updateLeadNotificationResult(
  leadId: string,
  notifyStatus: string,
  notifyError: string | null
): Promise<void> {
  if (pool) {
    try {
      await pool.query(
        'UPDATE leads SET notify_status = $1, notify_error = $2 WHERE id = $3',
        [notifyStatus, notifyError, leadId]
      );
    } catch (e: any) {
      console.error('[DB Notify Update Error]:', e.message);
    }
  }
  const mem = inMemoryLeads.get(leadId);
  if (mem) {
    mem.notify_status = notifyStatus;
    mem.notify_error = notifyError;
  }
}

/**
 * Başarısız veya kısmi bildirimleri manuel olarak yeniden tetikler
 */
export async function renotifyLead(id: string): Promise<AdminLead> {
  let targetLead: Lead | null = null;
  if (pool) {
    const res = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    if (res.rows.length > 0) {
      targetLead = res.rows[0] as Lead;
    }
  } else {
    targetLead = inMemoryLeads.get(id) || null;
  }

  if (!targetLead) {
    throw new Error('Talep bulunamadı.');
  }

  const oldStatus = targetLead.notify_status;
  const dispatchSummary = await dispatchLeadNotification(targetLead);

  await updateLeadNotificationResult(
    id,
    dispatchSummary.notify_status,
    dispatchSummary.notify_error
  );
  await recordLeadEvent(id, 'renotify', dispatchSummary.notify_status, oldStatus);

  targetLead.notify_status = dispatchSummary.notify_status;
  targetLead.notify_error = dispatchSummary.notify_error;

  return sanitizeLeadForAdmin(targetLead);
}

export function getInMemoryLeads(): Lead[] {
  return Array.from(inMemoryLeads.values());
}

export function clearInMemoryLeads(): void {
  inMemoryLeads.clear();
  inMemoryLeadEvents.length = 0;
}
