
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, Target, Zap, ShieldCheck, 
  BarChart3, MoveLeft, Sparkles, Orbit, TrendingUp
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useUser();

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Command Section */}
      <header className="relative py-16 text-right">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-lime-400">
            <Sparkles size={14} />
            AI-Engine Activated
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            اكتشف <br />
            <span className="text-gradient">عبقريتك المهنية</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mr-auto ml-0 font-medium leading-relaxed">
            منصة "مسار" تدمج نماذج Gemini 3 Pro مع تحليلات السوق الحية لرسم مستقبلك المهني بدقة هندسية.
          </p>
          <div className="flex flex-row-reverse gap-6 pt-8">
            <button 
              onClick={() => navigate('/assessment')}
              className="btn-premium bg-lime-400 text-black hover:shadow-[0_0_40px_rgba(163,230,53,0.3)]"
            >
              ابدأ الرحلة الاستراتيجية
              <MoveLeft size={18} />
            </button>
            <button 
              onClick={() => navigate('/market')}
              className="btn-premium bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              استعراض رادار السوق
            </button>
          </div>
        </div>
      </header>

      {/* Bento Grid Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Main Strategic Insight */}
        <div className="md:col-span-8 neo-glass p-10 overflow-hidden group">
          <div className="flex items-center justify-between mb-12 flex-row-reverse">
             <div className="text-right">
                <h3 className="text-2xl font-black text-white">خارطة الطريق الذكية</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Personalized AI Roadmap</p>
             </div>
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-lime-400 group-hover:rotate-45 transition-transform duration-700">
                <Orbit size={24} />
             </div>
          </div>

          <div className="space-y-6">
            {state.personalizedLearningPath.length > 0 ? (
              state.personalizedLearningPath.map((step, i) => (
                <div key={i} className="flex gap-8 flex-row-reverse items-center p-6 bg-white/5 rounded-3xl border border-transparent hover:border-white/10 transition-all group/item">
                  <div className="text-4xl font-black text-white/5 group-hover/item:text-lime-400/20 transition-colors">0{i+1}</div>
                  <div className="text-right flex-1">
                    <h4 className="text-lg font-black text-white">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                  <ArrowUpRight className="text-slate-700 group-hover/item:text-lime-400 transition-colors" size={24} />
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-600 font-bold italic">أكمل التقييم ليقوم Gemini برسم خارطتك...</div>
            )}
          </div>
        </div>

        {/* Level & XP Widget */}
        <div className="md:col-span-4 space-y-8">
           <div className="neo-glass p-10 bg-gradient-to-br from-indigo-500/10 to-transparent">
              <div className="text-center space-y-4">
                 <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Reputation Score</div>
                 <div className="text-7xl font-black text-white">{state.points}</div>
                 <div className="text-xs font-bold text-slate-500">XP Earned this Quarter</div>
                 <div className="w-full h-1 bg-white/5 rounded-full mt-6">
                    <div className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" style={{ width: '65%' }}></div>
                 </div>
              </div>
           </div>

           <div className="neo-glass p-8 flex items-center justify-between flex-row-reverse hover:border-lime-400/30 cursor-pointer transition-all group" onClick={() => navigate('/profile')}>
              <div className="text-right">
                <h4 className="text-white font-black">أوسمة الشرف</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">View Achievements</p>
              </div>
              <div className="w-10 h-10 bg-lime-400 text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
           </div>
        </div>

        {/* Market Stats Quick Look */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'Market Demand', val: '+24%', color: 'text-emerald-400', icon: <TrendingUp size={20} /> },
             { label: 'Avg. Salary Growth', val: '12,500 SR', color: 'text-blue-400', icon: <BarChart3 size={20} /> },
             { label: 'AI Disruption Risk', val: 'Low', color: 'text-lime-400', icon: <Zap size={20} /> },
           ].map((stat, i) => (
             <div key={i} className="neo-glass p-8 flex items-center justify-between flex-row-reverse group hover:bg-white/5">
                <div className="text-right">
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
