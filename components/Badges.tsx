import React from 'react';

interface BadgeProps {
  type: string;
  size?: number;
  primary?: string;
  secondary?: string;
  accent?: string;
}

export const GeometricBadge: React.FC<BadgeProps> = ({ 
  type, 
  size = 48,
  primary = '#64FFDA',
  secondary = '#050b14',
  accent = '#7c3aed'
}) => {
  const gradientId = `grad-${type}-${Math.random().toString(36).substr(2, 4)}`;

  const renderBadgeContent = () => {
    switch (type) {
      case 'analyzer':
        return (
          <g>
            <circle cx="24" cy="24" r="20" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" opacity="0.3" />
            <path d="M24 10 L30 20 L40 20 L32 28 L35 38 L24 32 L13 38 L16 28 L8 20 L18 20 Z" fill={`url(#${gradientId})`} />
            <circle cx="24" cy="24" r="4" fill="white" fillOpacity="0.5" />
          </g>
        );
      case 'skill-builder':
        return (
          <g>
            <rect x="8" y="8" width="32" height="32" rx="8" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
            <path d="M16 24 H32 M24 16 V32" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill={primary} />
            <circle cx="36" cy="36" r="2" fill={primary} />
          </g>
        );
      case 'project-maker':
        return (
          <g>
            <path d="M24 4 L42 14 V34 L24 44 L6 34 V14 Z" fill={`url(#${gradientId})`} fillOpacity="0.2" stroke={`url(#${gradientId})`} strokeWidth="2" />
            <rect x="18" y="18" width="12" height="12" rx="2" fill="white" fillOpacity="0.8" />
          </g>
        );
      case 'market-explorer':
        return (
          <g>
            <circle cx="24" cy="24" r="20" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="24" cy="24" r="8" fill={`url(#${gradientId})`} />
            <path d="M24 16 V24 L30 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'persistent':
        return (
          <g>
            <rect x="10" y="10" width="28" height="28" rx="14" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none" />
            <path d="M18 24 L22 28 L30 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      case 'ai-enthusiast':
        return (
          <g>
            <path d="M24 8 L28 16 H36 L30 22 L32 30 L24 25 L16 30 L18 22 L12 16 H20 Z" fill={`url(#${gradientId})`} />
            <circle cx="24" cy="18" r="3" fill="white" />
          </g>
        );
      default:
        return (
          <circle cx="24" cy="24" r="18" fill={`url(#${gradientId})`} />
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <filter id="glass-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>
      {renderBadgeContent()}
    </svg>
  );
};