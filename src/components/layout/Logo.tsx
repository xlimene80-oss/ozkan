import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site.js';

interface LogoProps {
  variant?: 'white' | 'blue';
  className?: string;
  imgClassName?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'white',
  className = '',
  imgClassName = 'h-9 w-auto',
  showText = true,
}) => {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? '/logo-white.png' : '/logo-blue.png';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 focus-visible:outline-white focus-visible:outline-2 rounded-lg group ${className}`}
      aria-label={`${siteConfig.acenteKisaAd} Ana Sayfa`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src={logoSrc}
          alt="13 Sigorta Logo"
          className={`${imgClassName} object-contain transition-transform duration-200 group-hover:scale-105`}
          onError={(e) => {
            // Fallback to logo.png or logo2.png if needed
            const target = e.currentTarget;
            if (isWhite) {
              target.src = '/logo.png';
              target.className = `${imgClassName} object-contain mix-blend-screen`;
            } else {
              target.src = '/logo2.png';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`text-lg sm:text-xl font-black tracking-tight font-sans transition-colors ${
                isWhite ? 'text-white' : 'text-[#00357B]'
              }`}
            >
              13 SİGORTA
            </span>
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
              isWhite ? 'text-blue-100/80' : 'text-slate-500'
            }`}
          >
            Aracılık Hizmetleri
          </span>
        </div>
      )}
    </Link>
  );
};
