import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { calculateLevel, calculateProgressToNextLevel, POINTS_PER_LEVEL } from '../utils/pointsCalculator';
import badgesData from '../data/badges';
import BadgeShape from '../components/BadgeShape';
import Button from '../components/ui/Button';
import { Trophy, Star, Zap, Target, CheckCircle2, Layout, ArrowLeft, Eye, Sparkles, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const Gamification: React.FC = () => {
  const { state, dispatch } = useUser();
  const [showAllBadges, setShowAllBadges] = useState(false);
  
  const currentLevel = calculateLevel(state.points);
  const progress = calculateProgressToNextLevel(state.points);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / POINTS_PER_LEVEL) * circumference;

  // Automated challenge tracking logic based on live user state
  const challenges = useMemo(() => [
    { 
      id: 'market', 
      title: 'زيارة رادار السوق', 
      points: 10, 
      completed: state.marketVisits > 0, 
      path: '/market',
      icon: <TrendingUp size={18} />
    },
    { 
      id: 'project', 
      title: 'إضافة مشروع عملي', 
      points: 20, 
      completed: state.profile.projects.length > 0, 
      path: '/profile',
      icon: <Zap size={18} />
    },
    { 
      id: 'skills', 
      title: 'تحديث مهاراتك الشخصية', 
      points: 15, 
      completed: state.profile.skills.length >= 3, 
      path: '/profile',
      icon: <Star size={18} />
    }
  ], [state.marketVisits, state.profile.projects.length, state.profile.skills.length]);

  // Gallery view logic: show 3 by default or all when expanded
  const displayedBadges = showAllBadges ? badgesData : badgesData.slice(0, 3);

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Level Display - High Visual Impact Radial Progress */}
        <div className="lg:w-1/3 space-y-6">
          <section className="bento-card p-12 flex flex-col items-center justify-center relative group min-h-[450px]">
            <div className="absolute inset-0 bg-brand-accent/5 opacity-40 blur-[100px] rounded-full"></div>
            
            <div className="relative mb-10 group-hover:scale-105 transition-transform duration-700">
              <svg width="200" height="200" className="transform -rotate-90">
                <circle 
                  cx="100" cy="100" r={radius} 
                  stroke="currentColor" strokeWidth="16" fill="transparent" 
                  className="text-neutral-800" 
                />
                <circle 
                  cx="100" cy="100" r={radius} 
                  stroke="currentColor" strokeWidth="16" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="text-brand-accent transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
                <div className="bg-neutral-950 p-6 rounded-full shadow-2xl border border-neutral-800 flex flex-col items-center min-w-[120px]">
                  <span className="text-6xl font-black text-white leading-none">{currentLevel}</span>
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mt-2">Level</span>
                </div>
              </div>
            </div>

            <div className="text-center relative z-10 w-full">
              <h2 className="text-2xl font-black mb-2 text-white tracking-tighter">
                {currentLevel > 10 ? 'مهندس مسار خبير' : currentLevel > 5 ? 'محلل محترف' : 'مستكشف ناشئ'}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-8">
                 <div className="h-1 w-10 bg-neutral-800 rounded-full"></div>
                 <p className="text-neutral-400 font-black text-xs uppercase tracking-widest">{state.points} Total XP</p>
                 <div className="h-1 w-10 bg-neutral-800 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-neutral-800/40 p-5 rounded-2xl border border-neutral-700/50 hover:bg-brand-accent/10 transition-all">
                  <Star size={20} className="mx-auto mb-2 text-brand-accent" />
                  <div className="text-2xl font-black">{state.badges.length}</div>
                  <div className="text-[8px] uppercase font-black text-neutral-500 tracking-widest">الأوسمة</div>
                </div>
                <div className="bg-neutral-800/40 p-5 rounded-2xl border border-neutral-700/50 hover:bg-neutral-100/5 transition-all">
                  <Zap size={20} className="mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-black">{progress}</div>
                  <div className="text-[8px] uppercase font-black text-neutral-500 tracking-widest">حتى القادم</div>
                </div>
              </div>
            </div>
          </section>

          {/* Automated Active Challenges */}
          <section className="bento-card p-10 text-right">
            <h3 className="text-xl font-black mb-8 flex items-center justify-end gap-3 text-white">
              تحدياتك المهنية النشطة
              <Target size={22} className="text-brand-accent" />
            </h3>
            <div className="space-y-4">
              {challenges.map(challenge => (
                <div key={challenge.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  challenge.completed 
                    ? 'bg-neutral-800/20 border-emerald-500/20 opacity-50 grayscale-0 select-none' 
                    : 'bg-neutral-800 border-neutral-700 hover:border-brand-accent/40 active:scale-98'
                }`}>
                  <div className="flex items-center gap-4">
                    {challenge.completed ? (
                      <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[10px] bg-neutral-900 px-4 hover:bg-brand-accent hover:text-black transition-colors"
                        onClick={() => window.location.hash = challenge.path}
                      >
                        إنجاز
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold transition-all ${challenge.completed ? 'text-emerald-400/80 line-through' : 'text-white'}`}>
                      {challenge.title}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] font-black text-brand-accent">+{challenge.points} XP</span>
                      <div className="text-neutral-500">{challenge.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Achievement Gallery with View All functionality */}
        <div className="lg:w-2/3 space-y-8">
          <section className="bento-card p-12">
            <div className="flex flex-col sm:flex-row-reverse items-center justify-between mb-12 gap-6">
              <div className="text-right">
                <h2 className="text-3xl font-black text-white tracking-tighter flex items-center justify-end gap-3">
                  خزانة الإنجازات
                  <Layout className="text-brand-accent" size={28} />
                </h2>
                <p className="text-neutral-500 font-bold text-sm mt-1">
                   لقد حققت {state.badges.length} وساماً من أصل {badgesData.length}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-[10px] font-black px-6 ${showAllBadges ? 'bg-brand-accent text-black border-brand-accent' : ''}`}
                  onClick={() => setShowAllBadges(!showAllBadges)}
                  leftIcon={showAllBadges ? <ChevronUp size={14} /> : <Eye size={14} />}
                >
                  {showAllBadges ? 'عرض الأحدث فقط' : 'عرض كافة الأوسمة'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedBadges.map(badge => (
                <div key={badge.id} className="animate-in fade-in zoom-in duration-500">
                  <BadgeShape
                    id={badge.id}
                    name={badge.name}
                    description={badge.description}
                    isUnlocked={state.badges.includes(badge.id)}
                  />
                </div>
              ))}
            </div>

            {!showAllBadges && badgesData.length > 3 && (
              <div className="mt-12 text-center border-t border-neutral-800 pt-8">
                <button 
                  onClick={() => setShowAllBadges(true)}
                  className="text-neutral-500 hover:text-brand-accent font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-2 mx-auto group"
                >
                  <span>See More Badges</span>
                  <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            )}
          </section>

          {/* Activity Log */}
          <section className="bento-card p-10 text-right">
            <h3 className="text-xl font-black mb-10 text-white flex items-center justify-end gap-3">
              سجل النشاطات الأخير
              <Zap size={22} className="text-yellow-400" />
            </h3>
            <div className="space-y-4">
              {state.events.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-start gap-5 p-5 bg-neutral-950/50 rounded-[2rem] border border-neutral-800 hover:border-brand-accent/20 transition-all group flex-row-reverse">
                  <div className="p-3 bg-neutral-900 rounded-xl group-hover:scale-110 transition-transform text-neutral-500 group-hover:text-brand-accent">
                    {event.type === 'badge' ? <Star size={20} /> : <Zap size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-row-reverse items-center justify-between mb-1">
                      <h4 className="text-sm font-black text-white">{event.title}</h4>
                      <span className="text-[8px] font-bold text-neutral-600 uppercase">{new Date(event.timestamp).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-bold leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Gamification;