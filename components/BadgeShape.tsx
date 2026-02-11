import React from 'react';
import { GeometricBadge } from './Badges';

interface BadgeShapeProps {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  size?: number;
}

const BadgeShape: React.FC<BadgeShapeProps> = ({ id, name, description, isUnlocked, size = 64 }) => {
  // Dynamic color customization based on badge type and unlock status
  const getColorScheme = (type: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        primary: '#404040',
        secondary: '#171717',
        accent: '#262626'
      };
    }

    switch (type) {
      case 'analyzer':
        return { primary: '#64FFDA', secondary: '#0A192F', accent: '#A855F7' };
      case 'skill-builder':
        return { primary: '#3B82F6', secondary: '#1E3A8A', accent: '#60A5FA' };
      case 'project-maker':
        return { primary: '#F59E0B', secondary: '#78350F', accent: '#FBBF24' };
      case 'market-explorer':
        return { primary: '#10B981', secondary: '#064E3B', accent: '#34D399' };
      case 'persistent':
        return { primary: '#A855F7', secondary: '#581C87', accent: '#D8B4FE' };
      case 'ai-enthusiast':
        return { primary: '#EC4899', secondary: '#831843', accent: '#F472B6' };
      default:
        return { primary: '#A855F7', secondary: '#1E1B4B', accent: '#64FFDA' };
    }
  };

  const colors = getColorScheme(id, isUnlocked);

  return (
    <div className={`flex flex-col items-center text-center p-8 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${
      isUnlocked 
        ? 'bg-neutral-900 border-brand-accent/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-100 hover:scale-[1.05] hover:border-brand-accent active:scale-95' 
        : 'bg-neutral-950 border-neutral-800 opacity-40 grayscale saturate-0'
    }`}>
      {isUnlocked && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none"></div>
        </>
      )}
      
      <div className={`mb-6 transition-all duration-700 ${isUnlocked ? 'scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:rotate-[360deg]' : 'scale-100'}`}>
        <GeometricBadge 
          type={id} 
          size={size} 
          primary={colors.primary} 
          secondary={colors.secondary} 
          accent={colors.accent} 
        />
      </div>

      <h4 className={`font-black text-sm mb-2 transition-colors duration-300 ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
        {name}
      </h4>
      
      <p className="text-[10px] text-neutral-400 leading-relaxed font-bold px-2">
        {description}
      </p>
      
      {isUnlocked ? (
        <div className="mt-5 px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-[9px] font-black text-brand-accent uppercase tracking-widest animate-in fade-in zoom-in duration-700">
          تم الإنجاز
        </div>
      ) : (
        <div className="mt-5 px-4 py-1.5 bg-neutral-800 rounded-full text-[9px] font-black text-neutral-500 uppercase tracking-widest">
          مغلق حالياً
        </div>
      )}
    </div>
  );
};

export default BadgeShape;