import React from 'react';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="primaryGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="#0F172A" />
    <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M12 34V18L24 26L36 18V34" stroke="url(#primaryGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 14L36 22L24 30L12 22L24 14Z" fill="url(#accentGrad)" fillOpacity="0.25" stroke="#818CF8" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="24" cy="22" r="3" fill="#6366F1" />
  </svg>
);

export default BrandLogo;
