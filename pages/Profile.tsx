
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import { GeometricBadge } from '../components/Badges';
import Timeline from '../components/Timeline';
import { 
  FileText, Award, User as UserIcon, Briefcase, 
  Settings, FolderKanban, BookOpen, Download, Layout as LayoutIcon, Lightbulb, Sparkles
} from 'lucide-react';
import { calculateLevel } from '../utils/pointsCalculator';

const Profile: React.FC = () => {
  const { state, dispatch } = useUser();
  const [activeView, setActiveView] = useState<'info' | 'projects' | 'timeline'>('info');

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      {/* Panel 1: Profile Identity Bar */}
      <div className="glass-panel p-10 flex flex-col md:flex-row-reverse items-center justify-between gap-10">
        <div className="flex flex-row-reverse items-center gap-8">
           <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-lime-400 rounded-[2.5rem] flex items-center justify-center text-black text-5xl font-black shadow-xl ring-4 ring-white/5">
             {state.profile.fullName.charAt(0)}
           </div>
           <div className="text-right">
             <h1 className="text-4xl font-black text-white tracking-tighter">{state.profile.fullName}</h1>
             <p className="text-lime-400 font-bold flex items-center gap-3 justify-end text-xl mt-2">
               {state.profile.currentRole || 'مستكشف المسارات المهنية'}
               <Briefcase size={20} />
             </p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/5 px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Rank</span>
             <span className="text-2xl font-black text-white">Lv {calculateLevel(state.points)}</span>
           </div>
           <Button variant="outline" size="sm" className="border-white/10 text-white rounded-3xl">
             <Settings size={20} />
           </Button>
        </div>
      </div>

      {/* Panel 2: Three Column Content Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Quick Access Nav */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-4 space-y-2">
            {[
              { id: 'info', label: 'المعلومات الأساسية', icon: <UserIcon size={18} /> },
              { id: 'projects', label: 'معرض المشاريع', icon: <FolderKanban size={18} /> },
              { id: 'timeline', label: 'خط الزمن المهني', icon: <LayoutIcon size={18} /> },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setActiveView(btn.id as any)}
                className={`w-full flex flex-row-reverse items-center justify-between p-6 rounded-[2rem] border transition-all duration-500 ${
                  activeView === btn.id ? 'bg-lime-400 text-black border-lime-400 shadow-xl scale-105' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="font-black text-sm uppercase tracking-widest">{btn.label}</span>
                {btn.icon}
              </button>
            ))}
          </div>
          
          <div className="glass-panel p-10">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 text-right opacity-40">أحدث الأوسمة</h4>
             <div className="grid grid-cols-2 gap-6">
               {state.badges.slice(0, 4).map(b => (
                 <div key={b} className="bg-white/5 p-6 rounded-[2rem] flex items-center justify-center border border-white/5 hover:border-lime-400/40 transition-all cursor-pointer">
                    <GeometricBadge type={b} size={40} />
                 </div>
               ))}
               {state.badges.length === 0 && <p className="col-span-2 text-[10px] text-center text-slate-600 font-bold italic py-4">أكمل المهام لفتح الأوسمة</p>}
             </div>
          </div>
        </div>

        {/* Middle: Active Main View */}
        <div className="lg:col-span-9 glass-panel p-12 min-h-[600px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-[100px] pointer-events-none"></div>

           {activeView === 'info' && (
             <div className="space-y-16 animate-in slide-in-from-left duration-700">
               <div className="text-right">
                 <h2 className="text-3xl font-black text-white mb-8 flex items-center justify-end gap-4">
                   الملخص المهني الذكي
                   <Sparkles className="text-lime-400" size={24} />
                 </h2>
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
                   <p className="text-2xl text-slate-300 leading-relaxed italic font-medium">"{state.aiSummary || 'جاري توليد الملخص بناءً على تفاعلاتك...'}"</p>
                 </div>
               </div>
               
               {state.personalizedLearningPath.length > 0 && (
                  <div className="text-right">
                    <h2 className="text-3xl font-black text-white mb-10 flex items-center justify-end gap-4">
                      خطة التعلم المقترحة
                      <Lightbulb className="text-lime-400" size={24} />
                    </h2>
                    <div className="space-y-8">
                      {state.personalizedLearningPath.map((step, i) => (
                        <div key={i} className="flex gap-8 flex-row-reverse items-start group">
                          <div className="w-12 h-12 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-lime-400 font-black text-lg shrink-0 group-hover:bg-lime-400 group-hover:text-black transition-all">
                            {i + 1}
                          </div>
                          <div className="text-right flex-1">
                            <h4 className="text-xl font-black text-white mb-2">{step.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed mb-2">{step.description}</p>
                            <span className="text-[10px] font-black text-lime-400/50 uppercase tracking-[0.2em]">{step.resourceHint}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-right">
                  <div className="space-y-6">
                    <h3 className="font-black text-white uppercase text-xs tracking-widest text-slate-500 opacity-40">التعليم</h3>
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <p className="text-xl font-black text-slate-200">{state.profile.education || 'لم يتم تحديد المؤهل'}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-black text-white uppercase text-xs tracking-widest text-slate-500 opacity-40">المهارات الحالية</h3>
                    <div className="flex flex-wrap flex-row-reverse gap-3">
                       {state.profile.skills.map(s => (
                         <span key={s} className="px-6 py-3 bg-white/5 rounded-2xl text-xs font-black border border-white/5 hover:border-lime-400/30 transition-all text-slate-300">{s}</span>
                       ))}
                       {state.profile.skills.length === 0 && <p className="text-slate-600 italic text-sm">لم يتم إضافة مهارات بعد</p>}
                    </div>
                  </div>
               </div>
             </div>
           )}

           {activeView === 'projects' && (
             <div className="space-y-12 animate-in slide-in-from-left duration-700 text-right">
               <h2 className="text-3xl font-black text-white">معرض المشاريع</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {state.profile.projects.map(p => (
                    <div key={p.id} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 group hover:border-lime-400/40 transition-all relative overflow-hidden">
                       <div className="absolute -top-10 -left-10 w-20 h-20 bg-lime-400/10 blur-2xl"></div>
                       <h4 className="text-2xl font-black text-white mb-4 group-hover:text-lime-400 transition-colors">{p.title}</h4>
                       <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{p.description}</p>
                       <Button variant="ghost" size="sm" className="text-lime-400 px-0 hover:translate-x-[-5px] transition-transform flex items-center gap-2">
                         <span>عرض التفاصيل</span>
                       </Button>
                    </div>
                  ))}
                  <button className="border-4 border-dashed border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-slate-600 hover:border-lime-400 hover:text-lime-400 transition-all group bg-transparent">
                     <Plus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                     <span className="font-black text-lg uppercase tracking-widest">إضافة مشروع استراتيجي</span>
                  </button>
               </div>
             </div>
           )}

           {activeView === 'timeline' && (
             <div className="animate-in slide-in-from-left duration-700 p-4">
               <Timeline events={state.events} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default Profile;
