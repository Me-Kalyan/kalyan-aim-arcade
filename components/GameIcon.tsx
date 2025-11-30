import * as React from "react";

type GameIconProps = {
  gameId: string;
  className?: string;
};

export function GameIcon({ gameId, className = "" }: GameIconProps) {
  const iconProps = {
    className: `w-full h-full ${className}`,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (gameId) {
    case "reaction-rush":
      return (
        <svg {...iconProps}>
          {/* Crosshair/Target icon for Reaction Rush */}
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
          <line x1="32" y1="8" x2="32" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="48" x2="32" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="32" x2="16" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "memory-grid":
      return (
        <svg {...iconProps}>
          {/* Grid/Pattern icon for Memory Grid */}
          <rect x="8" y="8" width="16" height="16" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="28" y="8" width="16" height="16" rx="2" fill="currentColor" opacity="0.4" />
          <rect x="48" y="8" width="8" height="16" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="8" y="28" width="16" height="16" rx="2" fill="currentColor" opacity="0.3" />
          <rect x="28" y="28" width="16" height="16" rx="2" fill="currentColor" opacity="0.9" />
          <rect x="48" y="28" width="8" height="16" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="8" y="48" width="16" height="8" rx="2" fill="currentColor" opacity="0.7" />
          <rect x="28" y="48" width="16" height="8" rx="2" fill="currentColor" opacity="0.4" />
          <rect x="48" y="48" width="8" height="8" rx="2" fill="currentColor" opacity="0.6" />
        </svg>
      );

    case "spray-control":
      return (
        <svg {...iconProps}>
          {/* Crosshair with spray pattern for Spray Control */}
          <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
          <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="3" fill="currentColor" />
          {/* Spray pattern dots */}
          <circle cx="28" cy="20" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="36" cy="18" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="40" cy="22" r="1.5" fill="currentColor" opacity="0.6" />
          <circle cx="20" cy="28" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="44" cy="26" r="1.5" fill="currentColor" opacity="0.5" />
        </svg>
      );

    case "drop-royale":
      return (
        <svg {...iconProps}>
          {/* Parachute/Drop icon for Drop Royale */}
          <path
            d="M32 12 L20 28 L24 28 L28 32 L36 32 L40 28 L44 28 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <path
            d="M32 12 L20 28 M32 12 L44 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line x1="32" y1="32" x2="32" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="52" r="6" fill="currentColor" opacity="0.7" />
          {/* Zone circles */}
          <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="2 2" />
          <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="1 1" />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" fill="currentColor" />
        </svg>
      );
  }
}

