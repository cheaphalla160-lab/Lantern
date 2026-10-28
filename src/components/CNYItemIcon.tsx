import React from 'react';
import { CNYWord } from '../types';

interface CNYItemIconProps {
  word: CNYWord;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  className?: string;
  showStickerImage?: boolean;
}

export const CNYItemIcon: React.FC<CNYItemIconProps> = ({
  word,
  size = 'md',
  className = '',
  showStickerImage = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-4xl',
    giant: 'w-36 h-36 text-6xl',
  };

  // If the word has a custom generated sticker image and showStickerImage is true
  if (showStickerImage && word.image) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm border border-amber-200/60 bg-white/90 p-1 ${sizeMap[size]} ${className}`}>
        <img
          src={word.image}
          alt={word.word}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-sm select-none"
        />
      </div>
    );
  }

  // Adorable custom SVG vector graphics for all items
  const renderVector = () => {
    switch (word.id) {
      case 'dumplings':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Dumpling plate */}
            <ellipse cx="32" cy="46" rx="28" ry="12" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
            <ellipse cx="32" cy="45" rx="24" ry="9" fill="#FFFBEB" />
            {/* Golden ingots / Dumpling */}
            <path
              d="M16 38 C 16 22, 48 22, 48 38 C 48 42, 16 42, 16 38 Z"
              fill="#FEF08A"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            {/* Dumpling pleats */}
            <path d="M22 28 Q 26 33 26 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 25 Q 32 32 32 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 28 Q 38 33 38 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            {/* Cute eyes */}
            <circle cx="28" cy="33" r="2" fill="#78350F" />
            <circle cx="36" cy="33" r="2" fill="#78350F" />
            {/* Happy smile */}
            <path d="M30 36 Q 32 38 34 36" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
            {/* Steam */}
            <path d="M26 18 Q 29 14 26 10" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M36 17 Q 39 13 36 9" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </svg>
        );

      case 'fish':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Red & Gold Koi fish */}
            <path
              d="M44 32 C 40 20, 20 22, 12 32 C 20 42, 40 44, 44 32 Z"
              fill="#F87171"
              stroke="#DC2626"
              strokeWidth="2.5"
            />
            {/* Fish tail */}
            <path
              d="M12 32 L 4 20 C 8 30, 8 34, 4 44 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="2"
            />
            {/* Golden scales */}
            <path d="M25 27 Q 28 32 25 37" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 28 Q 35 32 32 36" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eye */}
            <circle cx="38" cy="30" r="3" fill="#FFFFFF" />
            <circle cx="39" cy="30" r="1.5" fill="#1F2937" />
            {/* Water bubble */}
            <circle cx="48" cy="24" r="3" fill="#BAE6FD" opacity="0.8" />
            <circle cx="53" cy="18" r="2" fill="#BAE6FD" opacity="0.8" />
          </svg>
        );

      case 'tangyuan':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Bowl */}
            <path
              d="M12 30 Q 12 52 32 52 Q 52 52 52 30 Z"
              fill="#FEE2E2"
              stroke="#E11D48"
              strokeWidth="2.5"
            />
            <ellipse cx="32" cy="30" rx="20" ry="6" fill="#FFF1F2" stroke="#E11D48" strokeWidth="2" />
            {/* Tangyuan balls */}
            <circle cx="24" cy="27" r="7" fill="#FFFFFF" stroke="#FB7185" strokeWidth="1.5" />
            <circle cx="38" cy="26" r="7" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
            <circle cx="31" cy="22" r="7" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            {/* Cute smiles */}
            <circle cx="22" cy="26" r="1" fill="#881337" />
            <circle cx="26" cy="26" r="1" fill="#881337" />
            <circle cx="36" cy="25" r="1" fill="#713F12" />
            <circle cx="40" cy="25" r="1" fill="#713F12" />
            <path d="M30 22 Q 31 23 32 22" stroke="#831843" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'longevity_noodles':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Porcelain Bowl */}
            <path
              d="M14 32 Q 14 54 32 54 Q 50 54 50 32 Z"
              fill="#FFEDD5"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
            <ellipse cx="32" cy="32" rx="18" ry="6" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" />
            {/* Noodles curled */}
            <path
              d="M20 30 Q 24 22 28 30 T 36 28 T 44 30"
              stroke="#FBBF24"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Chopsticks lifting long noodles */}
            <line x1="24" y1="8" x2="38" y2="28" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="6" x2="40" y2="26" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
            <path
              d="M36 24 C 36 18, 38 18, 38 28 C 38 34, 30 36, 30 42"
              stroke="#F59E0B"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'lucky_money':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Red Envelope */}
            <rect x="18" y="14" width="28" height="40" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            {/* Flap */}
            <path d="M18 16 Q 32 30 46 16" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5" />
            {/* Gold Fu Badge */}
            <circle cx="32" cy="34" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Traditional Fu character representation */}
            <text x="32" y="38" textAnchor="middle" fill="#991B1B" fontSize="9" fontWeight="bold" fontFamily="serif">
              福
            </text>
            {/* Golden Coins popping out */}
            <circle cx="44" cy="14" r="6" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
            <rect x="42" y="12" width="4" height="4" fill="#D97706" />
          </svg>
        );

      case 'red_lanterns':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Top hanging string */}
            <line x1="32" y1="4" x2="32" y2="14" stroke="#D97706" strokeWidth="2" />
            {/* Gold caps */}
            <rect x="24" y="14" width="16" height="5" rx="1.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
            {/* Lantern body */}
            <ellipse cx="32" cy="32" rx="18" ry="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            {/* Rib lines */}
            <ellipse cx="32" cy="32" rx="10" ry="16" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="32" y1="16" x2="32" y2="48" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Center Gold Character or Diamond */}
            <circle cx="32" cy="32" r="5" fill="#FBBF24" opacity="0.9" />
            {/* Bottom cap */}
            <rect x="25" y="47" width="14" height="4" rx="1" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
            {/* Gold Tassel */}
            <line x1="32" y1="51" x2="32" y2="60" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="29" y1="51" x2="29" y2="58" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="35" y1="51" x2="35" y2="58" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'fireworks':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-sm" fill="none">
            {/* Center flash */}
            <circle cx="32" cy="32" r="4" fill="#FBBF24" />
            {/* Spark lines */}
            <line x1="32" y1="24" x2="32" y2="10" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="40" x2="32" y2="54" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="32" x2="10" y2="32" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="40" y1="32" x2="54" y2="32" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Diagonal sparks */}
            <line x1="26" y1="26" x2="14" y2="14" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
            <line x1="38" y1="26" x2="50" y2="14" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="38" x2="14" y2="50" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <line x1="38" y1="38" x2="50" y2="50" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            {/* Mini stars */}
            <circle cx="18" cy="22" r="1.5" fill="#F59E0B" />
            <circle cx="46" cy="20" r="1.5" fill="#EF4444" />
            <circle cx="48" cy="44" r="1.5" fill="#8B5CF6" />
            <circle cx="20" cy="42" r="1.5" fill="#10B981" />
          </svg>
        );

      default:
        return <span className="select-none">🏮</span>;
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-2xl p-1 bg-white/90 shadow-sm border border-amber-200/50 ${sizeMap[size]} ${className}`}
    >
      {renderVector()}
    </div>
  );
};
