
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { ChevronRight, ChevronLeft, CheckCircle, Info, HelpCircle } from 'lucide-react';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const [history, setHistory] = useState<string[]>(["basics_1"]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const currentId = history[history.length - 1];
  const currentQuestion = useMemo(() => questions.find(q => q.id === currentId), [currentId]);
  
  const progress = useMemo(() => {
    return (history.length / 15) * 100;
  }, [history.length]);

  const handleSelect = (value: string, nextId?: string) => {
    dispatch({ type: 'SET_ANSWER', questionId: currentId, value });
    setShowTooltip(false);
    
    if (nextId === "END" || !nextId) {
      handleComplete();
    } else {
      setHistory(prev => [...prev, nextId]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      setShowTooltip(false);
    }
  };

  const handleComplete = () => {
    setIsFinishing(true);
    dispatch({ type: 'ADD_POINTS', amount: 50 });
    dispatch({ type: 'ADD_BADGE', badge: 'analyzer' });
    dispatch({ 
      type: 'LOG_EVENT', 
      event: { 
        type: 'assessment', 
        title: 'إتمام التقييم', 
        description: 'أكملت بنجاح الاستبيان المهني العميق وحصلت على توصيات مخصصة.' 
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
    }, 1500);
  };

  if (isFinishing) {
    return (
      <div className="container-custom py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-[#64FFDA]/10 p-6 rounded-full mb-6">
          <CheckCircle size={64} className="text-[#64FFDA] animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">تم إكمال الاستبيان بنجاح</h2>
        <p className="text-slate-400 text-lg">نحن الآن نجمع إجاباتك لبناء ملفك المهني الشامل...</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="container-custom py-12 max-w-2xl">
      <div className="mb-10">
        <ProgressBar progress={progress} label="تقدم التحليل" />
      </div>

      <div className="bg-[#112240] rounded-3xl shadow-xl border border-[#233554] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 md:p-12">
          {/* Question Header */}
          <div className="mb-8 text-right">
            <div className="flex justify-between items-start mb-2">
              <button 
                onClick={() => setShowTooltip(!showTooltip)}
                className={`p-2 rounded-full transition-colors ${showTooltip ? 'bg-[#64FFDA] text-[#0A192F]' : 'bg-[#0A192F] text-slate-500 hover:bg-[#233554]'}`}
                title="مساعدة"
              >
                <HelpCircle size={20} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">{currentQuestion.text}</h1>
            </div>
            
            {showTooltip && (
              <div className="mb-6 p-4 bg-[#0A192F] text-[#64FFDA] rounded-2xl text-sm animate-in fade-in zoom-in-95 duration-200 border border-[#64FFDA]/20">
                <p>{currentQuestion.tooltip}</p>
              </div>
            )}

            <div className="flex items-start gap-2 bg-[#0A192F]/50 p-4 rounded-xl text-slate-400 border-r-4 border-[#64FFDA]">
              <p className="text-sm leading-relaxed flex-1">{currentQuestion.description}</p>
              <span className="mt-1 flex-shrink-0 text-[#64FFDA]">
                <Info size={18} />
              </span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid gap-4 mb-10">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value, option.nextId)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group text-right ${
                  state.answers[currentId] === option.value
                    ? 'border-[#64FFDA] bg-[#64FFDA]/5 text-[#64FFDA]'
                    : 'border-[#233554] bg-[#0A192F] text-slate-100 hover:border-[#64FFDA]/40 hover:bg-[#112240]'
                }`}
              >
                <ChevronLeft size={20} className={`transition-transform ${state.answers[currentId] === option.value ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                <span className="font-bold text-lg">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-[#233554]">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={history.length === 1}
              className="text-slate-500 hover:text-[#64FFDA]"
              leftIcon={<ChevronRight className="w-5 h-5" />}
            >
              السابق
            </Button>
            <span className="text-xs text-slate-500 font-medium">سؤال {history.length} من 15 تقريباً</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
