// wrstudios-frontend/user-app/src/components/PremiumIcon.jsx
import React from "react";

const PremiumIcon = ({ className = "w-8 h-8", variant = "premium" }) => {
  // Định nghĩa màu cho từng variant
const colorSchemes = {
  basic: {
    gradient: {
      id: "bg-gradient-basic",
      stops: [
        { offset: "0%", color: "#3B82F6" },
        { offset: "50%", color: "#2563EB" },
        { offset: "100%", color: "#1D4ED8" }
      ]
    },
    sparkle: "white"
  },
  premium: {
    gradient: {
      id: "bg-gradient-premium",
      stops: [
        { offset: "0%", color: "#F59E0B" },
        { offset: "50%", color: "#F97316" },
        { offset: "100%", color: "#EF4444" }
      ]
    },
    sparkle: "white"
  },
  vip: {
    gradient: {
      id: "bg-gradient-vip",
      stops: [
        { offset: "0%", color: "#8B5CF6" },
        { offset: "50%", color: "#7C3AED" },
        { offset: "100%", color: "#6D28D9" }
      ]
    },
    sparkle: "white"
  },
  // ⬇️ THÊM GOLD MỚI Ở ĐÂY
  gold: {
    gradient: {
      id: "bg-gradient-gold",
      stops: [
        { offset: "0%", color: "#FBBF24" },  // yellow-400
        { offset: "50%", color: "#F59E0B" }, // amber-500
        { offset: "100%", color: "#D97706" } // amber-600
      ]
    },
    sparkle: "white"
  }
};

  const scheme = colorSchemes[variant] || colorSchemes.premium;

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={scheme.gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
          {scheme.gradient.stops.map((stop, idx) => (
            <stop key={idx} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill={`url(#${scheme.gradient.id})`} opacity="0.95"/>
      {/* Diamond shape with crown integrated */}
      <g transform="translate(40, 40)">
        {/* Crown points at top - minimal */}
        <circle cx="-10" cy="-22" r="2.5" fill={scheme.sparkle} opacity="0.9"/>
        <circle cx="0" cy="-25" r="3" fill={scheme.sparkle}/>
        <circle cx="10" cy="-22" r="2.5" fill={scheme.sparkle} opacity="0.9"/>
        
        {/* Crown connecting line */}
        <path d="M-12 -20 L-10 -18 L0 -20 L10 -18 L12 -20" stroke={scheme.sparkle} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Diamond top part */}
        <path d="M-15 -15 L-20 0 L0 20 L20 0 L15 -15 Z" fill={scheme.sparkle} opacity="0.95"/>
        
        {/* Diamond facets for depth */}
        <path d="M-15 -15 L0 -10 L15 -15" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.5" fill="none"/>
        <line x1="0" y1="-10" x2="0" y2="20" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.5"/>
        <line x1="-20" y1="0" x2="0" y2="20" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.5"/>
        <line x1="20" y1="0" x2="0" y2="20" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.5"/>
        {/* Sparkle effects */}
        <g opacity="0.8">
          <path d="M-25 -8 L-23 -8 M-24 -9 L-24 -7" stroke={scheme.sparkle} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M25 5 L27 5 M26 4 L26 6" stroke={scheme.sparkle} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M-8 15 L-6 15 M-7 14 L-7 16" stroke={scheme.sparkle} strokeWidth="1" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  );
};

export default PremiumIcon;