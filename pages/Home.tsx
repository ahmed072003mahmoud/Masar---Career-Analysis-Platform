
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Sparkles, Zap, Brain, Target, LineChart, Briefcase, Compass
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';
// Fix: Added POINTS_PER_LEVEL to imports
import { calculateLevel, POINTS_PER_LEVEL } from '../utils/pointsCalculator';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useUser();
  const hasAssessment = Object.keys(state.answers).length > 0;
  const currentLevel = calculateLevel(state.points);

  return (
    <div className="container-custom py-12 relative">
      {/* Background Aurora Elements */}
      <div className="aurora aurora-violet"></div>
      <div className="aurora aurora-teal"></div>
      <div className="aurora aurora-amber"></div>

      {/* Hero Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Primary Hero Card */}
        <div className="md:col-span-8 bento-card p-12 md:p-16 flex flex-col justify-center relative overflow-hidden group min-h-[600px]">
          {/* Abstract 3D Compass Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-1000">
             <svg width="600" height="600" viewBox="0 0 200 200" className="compass-glow animate-pulse-slow">
                <circle cx="100" cy="100" r="80" stroke="url(#gradient-hero)" strokeWidth="0.5" fill="none" className="animate-spin-slow" />
                <circle cx="100" cy="100" r="60" stroke="url(#gradient-hero)" strokeWidth="0.5" fill="none" style={{ animationDirection: 'reverse' }} className="animate-spin-slow" />
                <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="0.2" opacity="0.3" />
                <defs>
                   <linearGradient id="gradient-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#7c3aed" />
                   </linearGradient>
                </defs>
             </svg>
          </div>

          <div className="relative z-10 text-right space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 text-[var(--accent)] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 backdrop-blur-xl">
              <Sparkles size={14} className="animate-pulse" />
              Intelligence Core 3.0
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[1] tracking-tighter">
              <span className="gradient-text">المستقبل</span> <br />
              <span className="text-white">يبدأ من هنا</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-xl font-medium leading-relaxed ml-auto">
              حلل مهاراتك بعمق واكتشف المسارات الأكثر نمواً في الاقتصاد السعودي الجديد عبر محرك Gemini المتقدم.
            </p>
            
            <div className="flex flex-wrap flex-row-reverse gap-4 pt-4">
              <Button 
                size="lg"
                className="rounded-full px-12 py-6 text-xl bg-white text-black hover:bg-teal-400 transition-colors shadow-2xl"
                onClick={() => navigate(hasAssessment ? '/recommendations' : '/assessment')}
                rightIcon={<ArrowLeft className="w-6 h-6" />}
              >
                {hasAssessment ? 'اكتشف التوصيات' : 'ابدأ التقييم'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-12 py-6 text-xl border-white/20 text-white backdrop-blur-md"
                onClick={() => navigate('/market')}
              >
                رادار السوق
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Mini-Widget */}
        <div className="md:col-span-4 grid grid-cols-1 gap-6">
          <div className="bento-card p-10 flex flex-col items-center justify-between text-center bg-violet-600/10 border-violet-500/20 group hover:border-violet-400/50">
            <div className="w-full flex justify-between items-center mb-4">
               <div className="bg-white/5 p-2 rounded-xl text-violet-400"><Trophy size={20} /></div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expertise Level</div>
            </div>
            
            <div className="relative py-4">
               <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform"></div>
               <div className="text-7xl font-black text-white relative z-10">{currentLevel}</div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>{POINTS_PER_LEVEL} XP</span>
                <span>{state.points % 100} XP</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-0.5">
                <div className="bg-gradient-to-l from-violet-500 to-teal-400 h-full rounded-full" style={{ width: `${state.points % 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-center bg-teal-500/5 border-teal-500/20 hover:border-teal-400/50">
             <div className="flex items-center justify-end gap-3 mb-4">
                <span className="text-sm font-bold text-white">تحليل المهارات</span>
                <Brain className="text-teal-400" size={20} />
             </div>
             <p className="text-right text-xs text-slate-400 leading-relaxed">
                تم تحليل {state.profile.skills.length} مهارات تقنية حتى الآن. أكمل ملفك للحصول على دقة أعلى.
             </p>
             <button onClick={() => navigate('/profile')} className="mt-4 text-right text-[10px] font-black text-teal-400 uppercase tracking-widest hover:underline">
               تحديث المهارات
             </button>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="md:col-span-4 bento-card p-10 bento-card-hover group">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white text-right">دقة استثنائية</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-right">
            نستخدم نماذج لغوية عملاقة لتحليل الفجوة بين قدراتك ومتطلبات السوق الفعلية.
          </p>
        </div>

        <div className="md:col-span-4 bento-card p-10 bento-card-hover group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
            <LineChart size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white text-right">رؤية حية للسوق</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-right">
            تحديثات فورية للرواتب والوظائف الأكثر طلباً في رؤية السعودية 2030.
          </p>
        </div>

        <div className="md:col-span-4 bento-card p-10 bento-card-hover group">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white text-right">مسار مخصص</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-right">
            لا نكتفي بالتوصيات، بل نرسم لك خارطة طريق تعليمية خطوة بخطوة.
          </p>
        </div>

      </div>

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.05); } }
      `}</style>
    </div>
  );
};

export default Home;
