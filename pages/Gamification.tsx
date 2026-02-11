
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { calculateLevel, calculateProgressToNextLevel, POINTS_PER_LEVEL } from '../utils/pointsCalculator';
import badgesData from '../data/badges';
import BadgeShape from '../components/BadgeShape';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { Trophy, Star, Zap, Target, CheckCircle2, Circle, Layout } from 'lucide-react';

const Gamification: React.FC = () => {
  const { state, dispatch } = useUser();
  const currentLevel = calculateLevel(state.points);
  const progress = calculateProgressToNextLevel(state.points);

  // Simulated daily challenges
  const [challenges, setChallenges] = useState([
    { id: 'market', title: 'زيارة صفحة السوق', points: 10, completed: false, path: '/market' },
    { id: 'project', title: 'إضافة مشروع جديد', points: 20, completed: state.profile.projects.length > 0, path: '/profile' },
    { id: 'skills', title: 'تحديث مهاراتك الشخصية', points: 15, completed: state.profile.skills.length >= 3, path: '/profile' }
  ]);

  const handleCompleteChallenge = (challengeId: string, points: number) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, completed: true } : c));
    dispatch({ type: 'ADD_POINTS', amount: points });
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Progress Sidebar */}
        <div className="lg:w-1/3 space-y-8">
          <section className="bg-brand-dark text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-brand-light p-3 rounded-2xl">
                  <Trophy size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">المستوى {currentLevel}</h2>
                  <p className="text-brand-light font-medium text-sm">محلل ناشئ</p>
                </div>
              </div>

              <div className="mb-6">
                <ProgressBar 
                  progress={progress} 
                  showPercentage={false}
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                  <span>{state.points} نقطة</span>
                  <span>{currentLevel * POINTS_PER_LEVEL} نقطة للترقية</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl text-center">
                  <Star size={20} className="mx-auto mb-2 text-yellow-400" />
                  <div className="text-lg font-bold">{state.badges.length}</div>
                  <div className="text-[10px] uppercase text-gray-400">أوسمة</div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl text-center">
                  <Zap size={20} className="mx-auto mb-2 text-brand-light" />
                  <div className="text-lg font-bold">{state.points}</div>
                  <div className="text-[10px] uppercase text-gray-400">إجمالي النقاط</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Target size={22} className="text-brand-light" />
              تحديات اليوم
            </h3>
            <div className="space-y-4">
              {challenges.map(challenge => (
                <div key={challenge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {challenge.completed ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                    <div>
                      <p className={`text-sm font-bold ${challenge.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {challenge.title}
                      </p>
                      <span className="text-[10px] font-bold text-brand-light">+{challenge.points} نقطة</span>
                    </div>
                  </div>
                  {!challenge.completed && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={() => window.location.hash = challenge.path}
                    >
                      انطلق
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Badges Grid */}
        <div className="lg:w-2/3 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">خزانة الأوسمة</h2>
              <span className="text-sm font-bold text-gray-400">
                {state.badges.length} من {badgesData.length} أوسمة
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {badgesData.map(badge => (
                <BadgeShape
                  key={badge.id}
                  id={badge.id}
                  name={badge.name}
                  description={badge.description}
                  isUnlocked={state.badges.includes(badge.id)}
                />
              ))}
            </div>
          </section>

          <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Layout size={22} className="text-brand-dark" />
              سجل الإنجازات
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">التسجيل في منصة مسار</h4>
                  <p className="text-xs text-gray-500">منحت 100 نقطة خبرة ترحيبية</p>
                </div>
              </div>
              {state.badges.map(badgeId => {
                const badge = badgesData.find(b => b.id === badgeId);
                if (!badge) return null;
                return (
                  <div key={badgeId} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
                    <div className="p-2 bg-brand-light/10 text-brand-light rounded-lg">
                      <Star size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">الحصول على وسام {badge.name}</h4>
                      <p className="text-xs text-gray-500">إنجاز مهني جديد مضاف لملفك</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Gamification;
