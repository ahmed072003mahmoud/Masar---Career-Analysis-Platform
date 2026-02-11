
import React from 'react';
import { 
  ArrowUpRight, Target, Sparkles, Zap, 
  DollarSign, BarChart3, Star, Layers, CheckCircle2
} from 'lucide-react';

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
    <div className={`neo-glass p-10 relative overflow-hidden group ${
      isPrimary ? 'border-lime-400/30 bg-lime-400/[0.02]' : 'hover:border-white/20'
    }`}>
      {/* Decorative Elements */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[100px] opacity-20 pointer-events-none ${isPrimary ? 'bg-lime-400' : 'bg-indigo-500'}`}></div>

      <div className="relative z-10 flex flex-col md:flex-row-reverse gap-10">
        
        {/* Visual Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="60" stroke={isPrimary ? '#a3e635' : '#6366f1'} strokeWidth="8" fill="transparent" 
                  strokeDasharray={377} 
                  strokeDashoffset={377 * (1 - career.compatibility / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{career.compatibility}%</span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Match</span>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 text-right space-y-6">
           <div className="space-y-2">
             {isPrimary && (
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/10 border border-lime-400/20 rounded-full text-[8px] font-black text-lime-400 uppercase tracking-widest mb-2">
                 <Star size={10} fill="currentColor" />
                 Recommended Path
               </div>
             )}
             <h3 className="text-3xl font-black text-white group-hover:text-lime-400 transition-colors">{career.title}</h3>
             <p className="text-slate-400 font-medium leading-relaxed">{career.description}</p>
           </div>

           {/* Stats Dashboard */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                   Market Value
                   <DollarSign size={10} />
                 </div>
                 <div className="text-lg font-black text-white">{career.salary}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                   Growth
                   <BarChart3 size={10} />
                 </div>
                 <div className={`text-lg font-black ${isPrimary ? 'text-lime-400' : 'text-indigo-400'}`}>{career.growth}</div>
              </div>
           </div>

           {/* Skills Tags */}
           <div className="pt-4">
              <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4">Required Arsenal</h4>
              <div className="flex flex-wrap flex-row-reverse gap-2">
                {career.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-slate-300 border border-white/5 hover:bg-white/10 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="text-lime-400" size={24} />
      </div>
    </div>
  );
};

export default CareerCard;
