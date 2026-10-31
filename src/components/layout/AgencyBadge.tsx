import React from 'react';
import { siteConfig } from '../../config/site.js';
import { ShieldCheck } from 'lucide-react';

interface AgencyBadgeProps {
  className?: string;
}

export const AgencyBadge: React.FC<AgencyBadgeProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm text-sm text-slate-700 w-full min-w-0 ${className}`}
      role="region"
      aria-label="Acente Yasal Bilgileri"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <ShieldCheck className="h-6 w-6 text-brand" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-xs sm:text-sm break-words">{siteConfig.acenteUnvani}</p>
            <p className="text-xs text-slate-500">
              TOBB Levha No: <span className="font-mono font-medium text-slate-700">{siteConfig.levhaNo}</span>
            </p>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-2 md:border-t-0 md:pt-0 text-xs md:text-right text-slate-500 min-w-0">
          <p className="font-medium text-slate-800 break-words">{siteConfig.yetkiliSirket}</p>
          <p className="text-slate-500 text-[11px] sm:text-xs">Sigorta Aracılık Faaliyetleri Kanununa tabidir.</p>
        </div>
      </div>
    </div>
  );
};
