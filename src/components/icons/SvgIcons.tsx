import React from 'react';

// ============================================
// YOUTUBE ICONS
// ============================================

export const YouTubeLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 90 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="28" height="20" rx="4" fill="#FF0000"/>
    <path d="M11 6L19 10L11 14V6Z" fill="white"/>
    <path d="M34 15.5V4.5H36.5L40 12.5L43.5 4.5H46V15.5H44V7.5L40.5 15.5H39.5L36 7.5V15.5H34Z" fill="white"/>
    <path d="M48 15.5V9H50V10.5C50.5 9.5 51.5 9 52.5 9C54 9 55 10 55 12V15.5H53V12.5C53 11.5 52.5 11 51.5 11C50.5 11 50 11.5 50 12.5V15.5H48Z" fill="white"/>
  </svg>
);

export const YouTubePlayButton: React.FC<{ className?: string; size?: number }> = ({ className, size = 28 }) => (
  <svg className={className} width={size} height={size * 0.7} viewBox="0 0 28 20" fill="none">
    <rect width="28" height="20" rx="4" fill="#FF0000"/>
    <path d="M11 6L19 10L11 14V6Z" fill="white"/>
  </svg>
);

export const ThumbUpIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

export const ThumbDownIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);

// ============================================
// NETFLIX ICONS
// ============================================

export const NetflixLogo: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size * 1.2} viewBox="0 0 24 28" fill="none">
    <path d="M6 0H10L14 18V0H18V28H14L10 10V28H6V0Z" fill="#E50914"/>
  </svg>
);

export const NetflixN: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 111 30" fill="none">
    <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zM69.281 26.5c2.094.282 4.187.626 6.281.97V9.375h5.5V.062H63.781v9.313h5.5V26.5zM49.563 9.374h5.562v17c.938.032 1.844.094 2.782.157V9.374h5.562V.062H49.562v9.312zM35.625.062v17.313c0 5.968 3.281 9.5 8.531 9.5.688 0 1.375-.063 2.031-.156v-9.126c-.313.032-.625.063-.938.063-2.125 0-3.468-1.438-3.468-4.094V.063h-6.156zM23.438.062h-6.156V27c2.062.188 4.094.47 6.156.782V.062zM11 9.374h5.563V.062H.156v9.312h5.5v15.094c1.75-.22 3.531-.407 5.344-.563V9.375z" fill="#E50914"/>
  </svg>
);

export const PlayButtonFilled: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"/>
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const ChevronLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// ============================================
// MINECRAFT ICONS
// ============================================

export const MinecraftLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none">
    <text x="0" y="16" fontFamily="'Courier New', monospace" fontSize="16" fontWeight="bold" fill="#3C8527">
      MINECRAFT
    </text>
  </svg>
);

export const DiamondIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 9L12 22L22 9L12 2Z" fill="#4AEDD9"/>
    <path d="M12 2L7 9H17L12 2Z" fill="#6FFFFF"/>
    <path d="M2 9L12 22L7 9H2Z" fill="#2CB9A8"/>
    <path d="M22 9L12 22L17 9H22Z" fill="#2CB9A8"/>
  </svg>
);

export const RedstoneIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="#FF0000"/>
    <circle cx="12" cy="12" r="5" fill="#CC0000"/>
    <circle cx="12" cy="12" r="2" fill="#FF3333"/>
  </svg>
);

export const GoldIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" fill="#FFD700"/>
    <rect x="6" y="6" width="12" height="12" fill="#FFC700"/>
    <rect x="8" y="8" width="8" height="8" fill="#FFE135"/>
  </svg>
);

export const GrassBlockIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect y="0" width="24" height="8" fill="#4CAF50"/>
    <rect y="8" width="24" height="16" fill="#8B4513"/>
    <rect x="2" y="2" width="4" height="4" fill="#66BB6A"/>
    <rect x="10" y="1" width="3" height="5" fill="#81C784"/>
  </svg>
);

export const CraftingTableIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" fill="#8B4513"/>
    <rect x="1" y="1" width="10" height="10" fill="#DEB887"/>
    <rect x="11" y="1" width="10" height="10" fill="#D2691E"/>
    <rect x="21" y="1" width="10" height="10" fill="#DEB887"/>
    <rect x="1" y="11" width="10" height="10" fill="#D2691E"/>
    <rect x="11" y="11" width="10" height="10" fill="#DEB887"/>
    <rect x="21" y="11" width="10" height="10" fill="#D2691E"/>
    <rect x="1" y="21" width="10" height="10" fill="#DEB887"/>
    <rect x="11" y="21" width="10" height="10" fill="#D2691E"/>
    <rect x="21" y="21" width="10" height="10" fill="#DEB887"/>
  </svg>
);

// ============================================
// APPLE / MAC ICONS
// ============================================

export const AppleLogo: React.FC<{ className?: string; color?: string }> = ({ className, color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export const FinderIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="url(#finderGradient)"/>
    <path d="M8 10C8 10 10 8 16 8C22 8 24 10 24 10V24C24 24 22 22 16 22C10 22 8 24 8 24V10Z" fill="#4FC3F7"/>
    <circle cx="11" cy="14" r="2" fill="white"/>
    <circle cx="21" cy="14" r="2" fill="white"/>
    <path d="M11 19C11 19 13 21 16 21C19 21 21 19 21 19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="finderGradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#42A5F5"/>
        <stop offset="1" stopColor="#1E88E5"/>
      </linearGradient>
    </defs>
  </svg>
);

export const SafariIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="15" fill="url(#safariGradient)"/>
    <circle cx="16" cy="16" r="12" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5"/>
    <path d="M16 4L17 7H15L16 4Z" fill="white"/>
    <path d="M16 28L15 25H17L16 28Z" fill="white"/>
    <path d="M4 16L7 15V17L4 16Z" fill="white"/>
    <path d="M28 16L25 17V15L28 16Z" fill="white"/>
    <path d="M22 10L12 14L10 22L20 18L22 10Z" fill="white"/>
    <path d="M12 14L20 18L22 10L12 14Z" fill="#FF3B30"/>
    <defs>
      <linearGradient id="safariGradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#5AC8FA"/>
        <stop offset="1" stopColor="#007AFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MailIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="url(#mailGradient)"/>
    <path d="M6 10L16 18L26 10" stroke="white" strokeWidth="2" fill="none"/>
    <rect x="6" y="10" width="20" height="14" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
    <defs>
      <linearGradient id="mailGradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#5AC8FA"/>
        <stop offset="1" stopColor="#007AFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MessagesIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#34C759"/>
    <path d="M8 10C8 8.89543 8.89543 8 10 8H22C23.1046 8 24 8.89543 24 10V18C24 19.1046 23.1046 20 22 20H18L14 24V20H10C8.89543 20 8 19.1046 8 18V10Z" fill="white"/>
  </svg>
);

export const PhotosIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="white"/>
    <circle cx="11" cy="11" r="6" fill="#FF9500"/>
    <circle cx="21" cy="11" r="6" fill="#FF3B30"/>
    <circle cx="11" cy="21" r="6" fill="#5856D6"/>
    <circle cx="21" cy="21" r="6" fill="#34C759"/>
    <circle cx="16" cy="16" r="6" fill="#FF2D55"/>
  </svg>
);

export const MusicIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="url(#musicGradient)"/>
    <path d="M22 8V20M22 8L12 10V22M22 20C22 21.6569 20.6569 23 19 23C17.3431 23 16 21.6569 16 20C16 18.3431 17.3431 17 19 17C20.6569 17 22 18.3431 22 20ZM12 22C12 23.6569 10.6569 25 9 25C7.34315 25 6 23.6569 6 22C6 20.3431 7.34315 19 9 19C10.6569 19 12 20.3431 12 22Z" stroke="white" strokeWidth="2" fill="none"/>
    <defs>
      <linearGradient id="musicGradient" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#FF2D55"/>
        <stop offset="1" stopColor="#FF3B30"/>
      </linearGradient>
    </defs>
  </svg>
);

export const NotesIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#FFCC00"/>
    <rect x="6" y="6" width="20" height="20" rx="2" fill="white"/>
    <line x1="9" y1="11" x2="23" y2="11" stroke="#FFCC00" strokeWidth="1.5"/>
    <line x1="9" y1="15" x2="23" y2="15" stroke="#FFCC00" strokeWidth="1.5"/>
    <line x1="9" y1="19" x2="18" y2="19" stroke="#FFCC00" strokeWidth="1.5"/>
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="white"/>
    <rect y="0" width="32" height="8" rx="6" fill="#FF3B30"/>
    <text x="16" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
      {new Date().getDate()}
    </text>
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#8E8E93"/>
    <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2"/>
    <path d="M16 6V10M16 22V26M26 16H22M10 16H6M22.5 9.5L19.5 12.5M12.5 19.5L9.5 22.5M22.5 22.5L19.5 19.5M12.5 12.5L9.5 9.5" stroke="white" strokeWidth="2"/>
  </svg>
);

export const TrashIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M8 10H24L22 28H10L8 10Z" fill="#8E8E93"/>
    <rect x="6" y="6" width="20" height="4" rx="1" fill="#8E8E93"/>
    <rect x="12" y="4" width="8" height="4" fill="#8E8E93"/>
  </svg>
);

export const LaunchpadIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#1C1C1E"/>
    <circle cx="10" cy="10" r="3" fill="#FF9500"/>
    <circle cx="22" cy="10" r="3" fill="#34C759"/>
    <circle cx="10" cy="22" r="3" fill="#5856D6"/>
    <circle cx="22" cy="22" r="3" fill="#FF2D55"/>
    <circle cx="16" cy="16" r="3" fill="#5AC8FA"/>
  </svg>
);

// ============================================
// iPHONE / iMESSAGE ICONS
// ============================================

export const SignalBars: React.FC<{ className?: string; bars?: number }> = ({ className, bars = 4 }) => (
  <svg className={className} viewBox="0 0 20 12" fill="none">
    <rect x="0" y="9" width="3" height="3" rx="0.5" fill={bars >= 1 ? "currentColor" : "#555"}/>
    <rect x="5" y="6" width="3" height="6" rx="0.5" fill={bars >= 2 ? "currentColor" : "#555"}/>
    <rect x="10" y="3" width="3" height="9" rx="0.5" fill={bars >= 3 ? "currentColor" : "#555"}/>
    <rect x="15" y="0" width="3" height="12" rx="0.5" fill={bars >= 4 ? "currentColor" : "#555"}/>
  </svg>
);

export const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 18" fill="currentColor">
    <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    <path d="M12 10c-3.03 0-5.78 1.23-7.78 3.22l2.12 2.12C7.77 13.91 9.77 13 12 13s4.23.91 5.66 2.34l2.12-2.12C17.78 11.23 15.03 10 12 10z" opacity="0.8"/>
    <path d="M12 5C7.31 5 3.07 6.9 0 10l2.12 2.12C4.47 9.78 8.03 8 12 8s7.53 1.78 9.88 4.12L24 10c-3.07-3.1-7.31-5-12-5z" opacity="0.5"/>
  </svg>
);

export const BatteryIcon: React.FC<{ className?: string; level?: number }> = ({ className, level = 80 }) => (
  <svg className={className} viewBox="0 0 28 12" fill="none">
    <rect x="0" y="0" width="24" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="2" y="2" width={Math.min(20, level / 5)} height="8" rx="1.5" fill="currentColor"/>
    <path d="M25 4V8C26.1046 8 27 7.10457 27 6C27 4.89543 26.1046 4 25 4Z" fill="currentColor"/>
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

export const EmojiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

export const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ============================================
// GENERIC ICONS
// ============================================

export const HeartIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "#FF3B30" : "none"} stroke="#FF3B30" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-8 8h5v8h6v-8h5z"/>
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 12l8-8v5h8v6h-8v5z"/>
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
