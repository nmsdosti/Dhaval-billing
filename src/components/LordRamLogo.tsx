import React from 'react';

interface LordRamLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const LordRamLogo: React.FC<LordRamLogoProps> = ({ 
  className = "w-10 h-10", 
  size = 40,
  showText = false 
}) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
      >
        <defs>
          {/* Radial Gradient for Aura */}
          <radialGradient id="ramAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
          </radialGradient>

          {/* Golden Bow Gradient */}
          <linearGradient id="goldBow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Saffron Flame Gradient */}
          <linearGradient id="saffronFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#E02424" />
          </linearGradient>
        </defs>

        {/* Outer Aura Circle */}
        <circle cx="50" cy="50" r="48" fill="url(#ramAura)" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />

        {/* Suryavanshi Sun Rays Halo */}
        <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <line x1="50" y1="6" x2="50" y2="14" />
          <line x1="50" y1="86" x2="50" y2="94" />
          <line x1="6" y1="50" x2="14" y2="50" />
          <line x1="86" y1="50" x2="94" y2="50" />
          <line x1="19" y1="19" x2="25" y2="25" />
          <line x1="75" y1="75" x2="81" y2="81" />
          <line x1="81" y1="19" x2="75" y2="25" />
          <line x1="25" y1="75" x2="19" y2="81" />
        </g>

        {/* Tilak / Divine Crest at Top */}
        <path
          d="M50 16 C53 24, 55 28, 55 33 C55 36, 52.8 38, 50 38 C47.2 38, 45 36, 45 33 C45 28, 47 24, 50 16 Z"
          fill="url(#saffronFlame)"
        />
        <circle cx="50" cy="33" r="2.5" fill="#FDE68A" />

        {/* Lord Ram's Kodanda Bow (Sacred Bow Curve) */}
        <path
          d="M22 28 C15 45, 15 55, 22 72 C25 60, 25 40, 22 28 Z"
          fill="url(#goldBow)"
          stroke="#7C2D12"
          strokeWidth="0.8"
        />
        
        {/* Bow Details & Grip */}
        <rect x="18" y="46" width="6" height="8" rx="2" fill="#7C2D12" stroke="#FDE68A" strokeWidth="0.8" />
        
        {/* Bowstring */}
        <line x1="22" y1="28" x2="22" y2="72" stroke="#FFF" strokeWidth="1.2" opacity="0.8" />

        {/* Sacred Arrow (Baan) */}
        {/* Shaft */}
        <line x1="14" y1="50" x2="78" y2="50" stroke="url(#goldBow)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Arrow Tip (Divine Arrowhead) */}
        <path
          d="M78 50 L64 42 L68 50 L64 58 Z"
          fill="url(#goldBow)"
          stroke="#FFF"
          strokeWidth="0.5"
        />

        {/* Feather Fletching at Arrow Tail */}
        <path
          d="M16 50 L10 43 M18 50 L12 43 M16 50 L10 57 M18 50 L12 57"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Om / Sacred Symbol in Background or Core Star */}
        <circle cx="50" cy="50" r="3" fill="#FDE68A" />
      </svg>

      {showText && (
        <span className="font-bold text-amber-400 text-xs ml-2 tracking-wider">
          जय श्री राम
        </span>
      )}
    </div>
  );
};
