
import React from 'react';

interface BadgeProps {
  type: string;
  size?: number;
}

export const GeometricBadge: React.FC<BadgeProps> = ({ type, size = 48 }) => {
  const colors = {
    primary: '#0F2A4E',
    secondary: '#3A7CA5',
    accent: '#10B981',
  };

  switch (type) {
    case 'skill-builder': // Square with rounded corners
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="40" height="40" rx="8" fill={colors.secondary} fillOpacity="0.1" stroke={colors.secondary} strokeWidth="2" />
          <rect x="14" y="14" width="20" height="20" rx="4" fill={colors.secondary} />
        </svg>
      );
    case 'analyzer': // Rectangle with 3 columns
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="40" height="28" rx="4" stroke={colors.primary} strokeWidth="2" />
          <line x1="16" y1="10" x2="16" y2="38" stroke={colors.primary} strokeWidth="2" />
          <line x1="32" y1="10" x2="32" y2="38" stroke={colors.primary} strokeWidth="2" />
          <rect x="20" y="18" width="8" height="2" fill={colors.primary} />
          <rect x="20" y="24" width="8" height="2" fill={colors.primary} />
        </svg>
      );
    case 'recommender': // Circle with star-like center
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" stroke={colors.accent} strokeWidth="2" />
          <path d="M24 14L27.5 21.5H35L29 26.5L31.5 34L24 29L16.5 34L19 26.5L13 21.5H20.5L24 14Z" fill={colors.accent} />
        </svg>
      );
    case 'project-maker': // Hexagon
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L41.3205 14V34L24 44L6.67949 34V14L24 4Z" stroke={colors.primary} strokeWidth="2" fill={colors.primary} fillOpacity="0.05" />
          <path d="M16 18L24 14L32 18V30L24 34L16 30V18Z" fill={colors.primary} />
        </svg>
      );
    case 'persistent': // Rising horizontal line
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="40" height="40" rx="4" fill="#F3F4F6" />
          <path d="M10 34L18 26L26 30L38 14" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="38" cy="14" r="3" fill={colors.secondary} />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="24" cy="24" r="10" fill="#CBD5E1" />
        </svg>
      );
  }
};
