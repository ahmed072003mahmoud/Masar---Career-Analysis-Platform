import React from 'react';
import { Briefcase, TrendingUp, DollarSign, CheckCircle, Star, Info, Sparkles, Zap } from 'lucide-react';
import { getCompatibilityColor, getBadgeLabel } from '../utils/recommendations';

interface CareerCardProps {
  career: {
    id: string;
    title: string;
    description: string;
    skills: string[];
    certs: string[];
    salary: string;
    growth: string;
    compatibility: number;
  };
  isPrimary?: boolean;
}

const CareerCard: React.FC<CareerCardProps> = ({ career, isPrimary = false }) => {
  return (
    <div className={`relative glass-card p-10 md:p-12 group overflow-hidden transition-all duration-500 ${
      isPrimary ? 'ring-2 ring-[var(--accent)] ring-opacity-50 scale-[1.02]' : 'hover:scale-[1.01]'
    }`}>
      {/* Dynamic Glass Glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--accent)] opacity-[0.05] rounded-full blur-[100px] pointer-events-none group-hover:opacity-10 transition-all duration-1000"></div>
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500 opacity-[0.03] rounded-full blur-[80px] pointer-events-none"></div>

      {isPrimary && (
        <div className="absolute top-6 left-10 bg-[var(--accent)] text-[var(--accent-text)] px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-xl uppercase tracking-[0.2em] z-20">
          <Star size={14} fill="currentColor" />
          Optimal Path
        </div>
      )}

      <div className="relative z-10 text-right">
        <div className="flex flex-col md:flex-row-reverse justify-between items-start gap-10 mb-12">
          <div className="flex-1 space-y-4">
            <h3 className="text-4xl font-black text-heading leading-tight group-hover:text-[var(--accent)] transition-colors duration-300">
              {career.title}
            </h3>
            <p className="text-main leading-relaxed text-xl font-medium max-w-3xl">
              {career.description}
            </p>
          </div>
          
          <div className="relative shrink-0 p-2 bg-black bg-opacity-20 rounded-full border border-[var(--border)]">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-main opacity-5" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={351.8} 
                strokeDashoffset={351.8 * (1 - career.compatibility / 100)} 
                style={{ color: 'var(--accent)' }}
                className="transition-all duration-1500 ease-out drop-shadow-[0_0_8px_var(--accent)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-heading leading-none">{career.compatibility}%</span>
              <span className="text-[8px] font-black text-main uppercase tracking-[0.3em] mt-1">Match</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Avg Salary', val: career.salary, icon: <DollarSign size={22} />, bg: 'bg-[var(--accent)]' },
            { label: 'Market Growth', val: career.growth, icon: <TrendingUp size={22} />, bg: 'bg-emerald-500' },
            { label: 'Status', val: getBadgeLabel(career.compatibility), icon: <Sparkles size={22} />, bg: 'bg-blue-500' }
          ].map((item, i) => (
            <div key={i} className="bg-black bg-opacity-20 p-8 rounded-[2.5rem] border border-[var(--border)] flex flex-col items-center group/item hover:border-[var(--accent)] transition-all">
              <div className={`${item.bg} bg-opacity-10 p-4 rounded-2xl text-[var(--accent)] mb-4 transition-colors group-hover/item:bg-opacity-20`}>
                {item.icon}
              </div>
              <span className="text-[10px] text-main font-black uppercase tracking-widest mb-2">{item.label}</span>
              <span className="text-lg font-black text-heading">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-xs font-black opacity-50 uppercase tracking-[0.3em] mb-6 flex items-center justify-end gap-3 text-main">
              Core Skills Portfolio
              <Zap size={16} className="text-[var(--accent)]" />
            </h4>
            <div className="flex flex-wrap flex-row-reverse gap-3">
              {career.skills.map((skill, idx) => (
                <span key={skill} className={`flex flex-row-reverse items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                  idx === 0 ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-2xl' : 'bg-black bg-opacity-20 text-main border border-[var(--border)] hover:bg-opacity-40 hover:text-heading'
                }`}>
                  <CheckCircle size={14} className={idx === 0 ? 'text-[var(--accent-text)]' : 'text-[var(--accent)] opacity-60'} />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)]">
            <h4 className="text-xs font-black opacity-50 uppercase tracking-[0.3em] mb-6 flex items-center justify-end gap-3 text-main">
              Premium Certifications
              <Sparkles size={16} />
            </h4>
            <div className="flex flex-wrap flex-row-reverse gap-4">
              {career.certs.map(cert => (
                <div key={cert} className="flex items-center gap-3 bg-black bg-opacity-10 text-main px-6 py-3 rounded-2xl text-[11px] font-bold border border-[var(--border)] hover:border-[var(--accent)] hover:bg-opacity-20 transition-all cursor-help">
                  {cert}
                  <Info size={14} className="opacity-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCard;