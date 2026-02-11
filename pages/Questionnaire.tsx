import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { ChevronRight, ChevronLeft, CheckCircle, Info, HelpCircle, AlertTriangle, Circle, Sparkles, Target, Star, BrainCircuit } from 'lucide-react';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const [history, setHistory] = useState<string[]>(["basics_1"]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  const totalQuestions = questions.length;
  const currentId = history[history.length - 1];
  const currentQuestion = useMemo(() => questions.find(q => q.id === currentId), [currentId]);
  
  const progress = useMemo(() => {
    return (history.length / totalQuestions) * 100;
  }, [history.length, totalQuestions]);

  const handleSelect = (value: string, nextId?: string) => {
    dispatch({ type: 'SET_ANSWER', questionId: currentId, value });
    setShowTooltip(false);
    
    if (nextId === "END" || !nextId) {
      handleComplete();
    } else {
      setHistory(prev => [...prev, nextId]);
    }
  };

  const confirmBack = () => {
    if (history.length > 1) {
      setShowBackModal(true);
    }
  };

  const handleBack = () => {
    setHistory(prev => prev.slice(0, -1));
    setShowTooltip(false);
    setShowBackModal(false);
  };

  const handleComplete = () => {
    setIsFinishing(true);
    dispatch({ type: 'ADD_POINTS', amount: 50 });
    dispatch({ type: 'ADD_BADGE', badge: 'analyzer' });
    dispatch({ 
      type: 'LOG_EVENT', 
      event: { 
        type: 'assessment', 
        title: 'إتمام التقييم الشامل', 
        description: 'أكملت بنجاح الرحلة التحليلية المهنية، والنتائج جاهزة الآن.' 
      } 
    });
    
    const profileUpdate: any = {};
    Object.entries(state.answers).forEach(([qId, val]) => {
      if (qId.startsWith('tech_')) profileUpdate.skills = Array.from(new Set([...(state.profile.skills || []), val]));
      if (qId.startsWith('goal_')) profileUpdate.interests = Array.from(new Set([...(state.profile.interests || []), val]));
      if (qId.startsWith('basics_')) profileUpdate.education = val;
    });

    dispatch({ type: 'UPDATE_PROFILE', profile: profileUpdate });

    setTimeout(() => {
      navigate('/recommendations');
    }, 2000);
  };

  if (isFinishing) {
    return (
      <div className="container-custom py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-[var(--accent)] bg-opacity-10 p-14 rounded-full mb-10 relative">
          <div className="absolute inset-0 bg-[var(--accent)] opacity-20 blur-3xl rounded-full animate-pulse"></div>
          <Sparkles size={100} className="text-[var(--accent)] animate-bounce relative z-10" />
        </div>
        <h2 className="text-5xl font-black mb-8 text-heading tracking-tight">جاري بناء مستقبلك...</h2>
        <p className="text-main text-2xl font-medium max-w-xl leading-relaxed">نحن الآن نستخدم ذكاء Gemini AI لربط مهاراتك بفرص العمل الحقيقية المتاحة حالياً.</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="container-custom py-12 max-w-5xl">
      {/* Stepper Navigation */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-12 overflow-x-auto no-scrollbar pb-8 px-6">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const isCompleted = i + 1 < history.length;
            const isActive = i + 1 === history.length;
            
            let StepIcon = <Circle size={12} />;
            if (isCompleted) StepIcon = <CheckCircle size={20} />;
            else if (isActive) StepIcon = <Target size={24} />;
            else if (i > 10) StepIcon = <Sparkles size={14} />;

            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 border-2 ${
                      isCompleted 
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-text)] shadow-xl' 
                        : isActive
                        ? 'bg-black bg-opacity-20 border-[var(--accent)] text-[var(--accent)] scale-125 z-10 shadow-[0_0_20px_rgba(100,255,218,0.3)]'
                        : 'bg-black bg-opacity-20 border-[var(--border)] text-main'
                    }`}
                  >
                    {StepIcon}
                  </div>
                </div>
                {i < totalQuestions - 1 && (
                  <div className={`flex-1 h-1 mx-3 min-w-[15px] rounded-full transition-all duration-700 ${i + 1 < history.length ? 'bg-[var(--accent)]' : 'bg-white/5'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <ProgressBar progress={progress} label="المسار الحالي" showPercentage={false} />
      </div>

      {/* Question Card */}
      <div className="glass-card p-12 md:p-20 animate-in slide-in-from-bottom-12 duration-700">
        <div className="mb-14 text-right">
          <div className="flex justify-between items-start mb-10 gap-6">
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setShowTooltip(!showTooltip)}
                className={`p-4 rounded-2xl transition-all duration-300 ${showTooltip ? 'bg-[var(--accent)] text-[var(--accent-text)] rotate-12' : 'bg-black bg-opacity-20 text-main hover:text-[var(--accent)] border border-[var(--border)]'}`}
              >
                <HelpCircle size={24} />
              </button>
              <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                currentQuestion.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                currentQuestion.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {currentQuestion.priority} Importance
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-heading tracking-tighter text-right flex-1">{currentQuestion.text}</h1>
          </div>
          
          {showTooltip && (
            <div className="mb-10 p-8 bg-[var(--accent)] bg-opacity-10 backdrop-blur-md text-[var(--accent)] rounded-[2.5rem] animate-in slide-in-from-top-4 duration-300 border border-[var(--accent)] border-opacity-20 shadow-2xl">
              <div className="flex items-start gap-6 flex-row-reverse">
                <BrainCircuit size={28} className="shrink-0 mt-1 opacity-70" />
                <p className="font-bold text-xl leading-relaxed">{currentQuestion.tooltip}</p>
              </div>
            </div>
          )}

          <div className="relative p-12 rounded-[3rem] bg-black bg-opacity-20 border border-[var(--border)] group transition-all hover:border-[var(--accent)]/40 shadow-inner">
             <div className="flex items-start gap-6 flex-row-reverse">
                <div className="bg-[var(--accent)] bg-opacity-10 p-4 rounded-2xl text-[var(--accent)]">
                  <Info size={28} />
                </div>
                <p className="text-main text-2xl font-medium leading-relaxed text-right flex-1">
                  {currentQuestion.description}
                </p>
             </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid gap-6 mb-16">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value, option.nextId)}
              className={`flex items-center justify-between p-10 rounded-[3rem] border-2 transition-all duration-300 group text-right ${
                state.answers[currentId] === option.value
                  ? 'border-[var(--accent)] bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] shadow-2xl scale-[1.03]'
                  : 'border-[var(--border)] bg-black bg-opacity-20 text-heading hover:border-[var(--accent)]/40 hover:bg-opacity-30'
              }`}
            >
              <div className={`p-5 rounded-full transition-all duration-500 ${state.answers[currentId] === option.value ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'bg-white/5 text-main group-hover:text-[var(--accent)]'}`}>
                <ChevronLeft size={28} />
              </div>
              <span className="font-black text-3xl tracking-tighter">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-12 border-t border-[var(--border)]">
          <Button
            variant="ghost"
            onClick={confirmBack}
            disabled={history.length === 1}
            className={`text-main font-black px-12 py-6 rounded-[2rem] ${history.length === 1 ? 'opacity-20' : 'hover:text-[var(--accent)] hover:bg-white/5'}`}
            leftIcon={<ChevronRight size={28} />}
          >
            السابق
          </Button>
          <div className="text-right">
            <span className="text-[10px] text-main font-black uppercase tracking-[0.4em] block mb-3">Assessment Analytics</span>
            <div className="flex items-center gap-6">
               <div className="text-4xl font-black text-heading">{Math.round(progress)}%</div>
               <div className="w-48 h-3 bg-black bg-opacity-20 rounded-full overflow-hidden border border-[var(--border)]">
                  <div className="h-full bg-[var(--accent)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;