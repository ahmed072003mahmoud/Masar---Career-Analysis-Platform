
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
  return (
    <div className={`flex flex-col items-center text-center p-6 rounded-3xl border-2 transition-all duration-300 ${
      isUnlocked 
        ? 'bg-white border-gray-100 shadow-sm opacity-100' 
        : 'bg-gray-50 border-transparent opacity-40 grayscale'
    }`}>
      <div className={`mb-4 ${isUnlocked ? 'scale-110' : 'scale-100'}`}>
        <GeometricBadge type={id} size={size} />
      </div>
      <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-brand-dark' : 'text-gray-400'}`}>
        {name}
      </h4>
      <p className="text-[10px] text-gray-400 leading-tight">
        {description}
      </p>
      {!isUnlocked && (
        <div className="mt-3 px-3 py-0.5 bg-gray-200 rounded-full text-[8px] font-bold text-gray-500 uppercase tracking-tighter">
          مغلق
        </div>
      )}
    </div>
  );
};

export default BadgeShape;
