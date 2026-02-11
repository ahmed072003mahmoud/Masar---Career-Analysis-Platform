
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, showPercentage = true }) => {
  const clampProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label && <span className="text-sm font-bold text-gray-700">{label}</span>}
        {showPercentage && (
          <span className="text-xs font-bold text-brand-dark bg-gray-200 px-2 py-0.5 rounded-full">
            {Math.round(clampProgress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-brand-light h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
