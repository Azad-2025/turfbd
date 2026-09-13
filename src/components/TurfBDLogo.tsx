import React from 'react';

export interface TurfBDLogoProps {
  variant?: 'brand' | 'dark' | 'light' | 'monochrome';
  layout?: 'horizontal' | 'vertical' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  showBadge?: boolean;
  badgeText?: string;
  useImage?: boolean;
  className?: string;
  id?: string;
  onClick?: () => void;
}

/**
 * Official TurfBD Brand Logo Component
 * Renders the official TurfBD brand identity:
 * - 3D metallic dark-forest shield/pin badge with bright lime athletic checkmark
 * - Signature metallic copper / bronze-rose 'TurfBD' typography
 * - 'Sports Turf Booking' tagline
 */
export const TurfBDLogo: React.FC<TurfBDLogoProps> = ({
  variant = 'brand',
  layout = 'horizontal',
  size = 'md',
  showTagline = false,
  taglineText = 'Sports Turf Booking',
  showBadge = false,
  badgeText = 'MVP',
  useImage = false,
  className = '',
  id = 'turfbd-logo',
  onClick,
}) => {
  // Dimensions map based on size
  const iconSizeMap = {
    xs: { w: 22, h: 25, imgH: 24, font: 'text-sm', subFont: 'text-[9px]' },
    sm: { w: 28, h: 32, imgH: 30, font: 'text-base', subFont: 'text-[10px]' },
    md: { w: 38, h: 44, imgH: 40, font: 'text-xl', subFont: 'text-[11px]' },
    lg: { w: 52, h: 60, imgH: 56, font: 'text-2xl sm:text-3xl', subFont: 'text-xs' },
    xl: { w: 76, h: 88, imgH: 80, font: 'text-4xl sm:text-5xl', subFont: 'text-sm' },
  };

  const currentSize = iconSizeMap[size] || iconSizeMap.md;

  // Text color styling based on variant
  // In official brand mode: signature metallic copper/rose gold gradient
  const copperGradient = 'bg-gradient-to-r from-[#F0C9B2] via-[#DFAC92] to-[#B87D64] bg-clip-text text-transparent drop-shadow-sm font-extrabold';

  const getWordmarkClass = () => {
    if (variant === 'brand') {
      return copperGradient;
    }
    if (variant === 'light') {
      return 'text-neutral-900 font-extrabold';
    }
    if (variant === 'dark') {
      return 'text-white font-extrabold';
    }
    return 'text-neutral-200 font-extrabold';
  };

  // Dedicated SVG Shield & Lime Checkmark Mark
  const renderMark = (extraClass = '') => (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${extraClass}`}
      style={{ width: currentSize.w, height: currentSize.h }}
    >
      <svg
        viewBox="0 0 160 180"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`gradOuter-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6A34" />
            <stop offset="40%" stopColor="#0D4820" />
            <stop offset="80%" stopColor="#062D13" />
            <stop offset="100%" stopColor="#041D0C" />
          </linearGradient>
          <linearGradient id={`gradBevel-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#52A86D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#021508" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`gradCheck-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3FF3B" />
            <stop offset="50%" stopColor="#78D81C" />
            <stop offset="100%" stopColor="#4EA008" />
          </linearGradient>
          <linearGradient id={`gradCheckHi-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#78D81C" stopOpacity="0.8" />
          </linearGradient>
          <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g transform="translate(80, 85)" filter={`url(#shadow-${id})`}>
          {/* Outer Metallic Green Shield */}
          <path
            d="M -52 -62
               C -52 -95, -38 -112, 0 -112
               C 38 -112, 52 -95, 52 -62
               C 52 -18, 30 22, 0 70
               C -30 22, -52 -18, -52 -62
               Z"
            fill={`url(#gradOuter-${id})`}
            stroke={`url(#gradBevel-${id})`}
            strokeWidth="6"
          />
          {/* Inner Goalpost Aperture Cavity */}
          <path
            d="M -32 -54
               C -32 -78, -22 -92, 0 -92
               C 22 -92, 32 -78, 32 -54
               C 32 -20, 16 8, 0 38
               C -16 8, -32 -20, -32 -54
               Z"
            fill="#031608"
            opacity="0.95"
          />
          {/* White Upper Crossbar/Goal Contour */}
          <path
            d="M -24 -68
               C -24 -80, -12 -86, 0 -86
               C 12 -86, 24 -80, 24 -68
               C 16 -62, 8 -58, 0 -58
               C -8 -58, -16 -62, -24 -68
               Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Glossy 3D Lime Checkmark */}
          <path
            d="M -16 -24
               L -2 -8
               L 26 -40"
            fill="none"
            stroke={`url(#gradCheck-${id})`}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M -16 -24
               L -2 -8
               L 26 -40"
            fill="none"
            stroke={`url(#gradCheckHi-${id})`}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );

  // If useImage is true, use the raster PNG
  if (useImage) {
    if (layout === 'icon') {
      return (
        <div id={id} className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
          <img
            src="/turflogo.png"
            alt="TurfBD Logo"
            className="object-contain"
            style={{ height: currentSize.imgH }}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div
          id={id}
          onClick={onClick}
          className={`flex flex-col items-center text-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
        >
          <img
            src="/turflogo.png"
            alt="TurfBD Logo"
            className="object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{ height: currentSize.imgH * 1.8 }}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
  }
      if (layout === 'horizontal') {
      return (
        <div
          id={id}
          onClick={onClick}
          className={`flex items-center gap-2.5 select-none ${
            onClick ? 'cursor-pointer group' : ''
          } ${className}`}
        >
          <img
            src="/turflogo.png"
            alt="TurfBD Logo"
            className="object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{ height: currentSize.imgH * 1.5 }}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
  // Icon only layout
  if (layout === 'icon') {
    return (
      <div id={id} className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        {renderMark()}
      </div>
    );
  }

  // Vertical stacked layout (matching the uploaded official logo format)
  if (layout === 'vertical') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      >
        {renderMark('mb-2.5')}
        <div className="flex items-center gap-1 leading-none">
          <span className={`tracking-tight ${currentSize.font} ${getWordmarkClass()}`}>
            TurfBD
          </span>
          {showBadge && (
            <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded ml-1">
              {badgeText}
            </span>
          )}
        </div>
        {showTagline && (
          <p className={`${currentSize.subFont} text-[#8B9AA7] font-semibold mt-1 tracking-wide`}>
            {taglineText}
          </p>
        )}
      </div>
    );
  }

  // Default: Horizontal layout (shield on left, TurfBD text on right)
  return (
    <div
      id={id}
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {renderMark()}
      <div className="text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`tracking-tight ${currentSize.font} ${getWordmarkClass()}`}>
            TurfBD
          </span>
          {showBadge && (
            <span className="text-[10px] uppercase font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded ml-0.5 tracking-wider">
              {badgeText}
            </span>
          )}
        </div>
        {showTagline && (
          <p className={`${currentSize.subFont} text-[#8B9AA7] font-medium mt-1`}>
            {taglineText}
          </p>
        )}
      </div>
    </div>
  );
};
