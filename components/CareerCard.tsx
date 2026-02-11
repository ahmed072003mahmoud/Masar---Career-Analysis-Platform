import React from 'react';
import { Briefcase, TrendingUp, DollarSign, CheckCircle, Star, Info } from 'lucide-react';
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
    <div className={`relative bg-[#112240] rounded-[2.5rem] border-2 transition-all duration-300 group overflow-hidden cursor-default hover:scale-[1.02] hover:shadow-2xl ${
      isPrimary ? 'border-[#64FFDA] shadow-vivid' : 'border-[#233554] shadow-sm hover:border-[#64FFDA]/50'
    }`}>
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-[#64FFDA]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700`}></div>

      {isPrimary && (
        <div className="absolute top-6 left-8 bg-[#64FFDA] text-[#0A192F] px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce-subtle">
          <Star size={14} fill="currentColor" />
          المسار الأمثل
        </div>
      )}

      <div className="p-8 md:p-10 relative z-10 text-right">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{career.title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{career.description}</p>
          </div>
          
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#0A192F]" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={251.2} 
                strokeDashoffset={251.2 * (1 - career.compatibility / 100)} 
                className={`${getCompatibilityColor(career.compatibility)} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-black ${getCompatibilityColor(career.compatibility)}`}>{career.compatibility}%</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">مطابقة</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 bg-[#0A192F]/50 p-6 rounded-3xl border border-[#233554]">
          <div className="flex items-center gap-4">
            <div className="bg-[#112240] p-3 rounded-2xl text-[#64FFDA] shadow-sm">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase mb-1">متوسط الدخل</span>
              <span className="text-sm font-bold text-white">{career.salary}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#112240] p-3 rounded-2xl text-emerald-400 shadow-sm">
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase mb-1">فرص النمو</span>
              <span className="text-sm font-bold text-white">{career.growth}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#112240] p-3 rounded-2xl text-slate-400 shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase mb-1">التقييم</span>
              <span className="text-sm font-bold text-white">{getBadgeLabel(career.compatibility)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-3">
              <CheckCircle size={18} className="text-[#64FFDA]" />
              سحابة المهارات الرئيسية
            </h4>
            <div className="flex flex-wrap gap-3">
              {career.skills.map((skill, idx) => (
                <span key={skill} 
                  style={{ fontSize: idx === 0 ? '16px' : '13px' }}
                  className={`${idx === 0 ? 'bg-[#64FFDA] text-[#0A192F]' : 'bg-[#233554] text-slate-100 border border-[#112240] shadow-sm'} px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 cursor-default`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-3">
              <Star size={18} className="text-[#64FFDA]" />
              الشهادات المقترحة للمسار
            </h4>
            <div className="flex flex-wrap gap-4">
              {career.certs.map(cert => (
                <div key={cert} className="flex items-center gap-2 bg-[#64FFDA]/5 text-[#64FFDA] px-4 py-2 rounded-xl text-xs font-bold border border-[#64FFDA]/10 hover:bg-[#64FFDA]/10 transition-all cursor-help">
                  {cert}
                  <Info size={12} className="opacity-40" />
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