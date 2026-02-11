
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import CareerCard from '../components/CareerCard';
import Button from '../components/ui/Button';
import { 
  Download, Bookmark, Sparkles, BookOpen, 
  BrainCircuit, Zap, ChevronLeft
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { isAssessmentComplete } from '../utils/validators';
import { getCareerRecommendations, refineLearningPath, getCareerInsights } from '../services/geminiService';

const Recommendations: React.FC = () => {
  const { state, dispatch } = useUser();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  const fetchRecommendations = async () => {
    if (!isAssessmentComplete(state.answers)) {
      setError('MISSING_ASSESSMENT');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCareerRecommendations(state.profile);
      setReport(data);
      
      const insights = await getCareerInsights(state.profile, state.answers);
      dispatch({ type: 'SET_AI_INSIGHTS', insights });

      dispatch({ type: 'SAVE_REPORT', report: data });
    } catch (err: any) {
      setError('حدث خطأ في محرك الذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = () => {
    if (!report) return;
    dispatch({ type: 'SAVE_REPORT', report });
    dispatch({ type: 'ADD_TOAST', message: 'تم حفظ التوصيات في ملفك الشخصي بنجاح' });
    dispatch({ type: 'ADD_POINTS', amount: 20 });
  };

  const handleRefinePath = async () => {
    if (!report || !report.learningPath) return;
    setIsRefining(true);
    try {
      const refined = await refineLearningPath(report.learningPath, report.primary.title);
      // التحويل إلى كائنات LearningStep لضمان توافق الواجهة
      const stepObjects = refined.map((step: string) => ({
        title: step,
        description: "مصدر تعليمي مخصص تم إنشاؤه بواسطة Gemini",
        resourceHint: "انقر للمزيد من التفاصيل"
      }));
      dispatch({ type: 'SET_LEARNING_PATH', path: stepObjects });
      dispatch({ type: 'ADD_TOAST', message: 'تم تخصيص مسار التعلم بمصادر محددة' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  useEffect(() => {
    if (state.savedReport && !report) {
       setReport(state.savedReport);
       setLoading(false);
    } else {
       fetchRecommendations();
    }
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-32 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-lime-500/20 border-t-lime-500 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">AI Career Mapping</h2>
        <p className="text-slate-400 font-medium italic">Gemini is synthesizing your career blueprint...</p>
      </div>
    );
  }

  if (error === 'MISSING_ASSESSMENT') {
    return (
      <div className="container-custom py-24 text-center">
        <div className="max-w-xl mx-auto bento-card p-16">
          <h2 className="text-3xl font-black text-white mb-6">التقييم غير مكتمل</h2>
          <Button onClick={() => window.location.hash = '/assessment'} size="lg">ابدأ التقييم الآن</Button>
        </div>
      </div>
    );
  }

  const learningPathToDisplay = state.personalizedLearningPath || [];

  return (
    <div className="container-custom py-12 relative">
      <div className="aurora aurora-lime opacity-10"></div>
      
      <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-8 mb-12">
        <div className="text-right">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Career Strategy</h1>
          <p className="text-slate-400 font-medium">تحليل Gemini AI المتوافق مع رؤية 2030</p>
        </div>
        <div className="flex flex-wrap flex-row-reverse gap-4">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSaveToProfile} 
            leftIcon={<Bookmark size={18} />}
            className="bg-lime-400 text-black shadow-vivid"
          >
            حفظ في الملف
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToPDF('report-container')} className="border-white/10 text-white" leftIcon={<Download size={16} />}>
            تصدير PDF
          </Button>
        </div>
      </div>

      <div id="report-container" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-10 text-right">
             <div className="flex items-center justify-between mb-10 flex-row-reverse">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  خطة التعلم
                  <BookOpen className="text-lime-400" size={24} />
                </h3>
                <button 
                  onClick={handleRefinePath}
                  disabled={isRefining}
                  className="text-[10px] font-black text-lime-400 uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {isRefining ? 'جاري التخصيص...' : 'تخصيص الخطة'}
                  <Sparkles size={12} />
                </button>
             </div>
             <div className="space-y-8">
               {learningPathToDisplay.map((step, i) => (
                 <div key={i} className="flex gap-6 flex-row-reverse items-start group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 text-lime-400 text-xs font-black flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-lime-400 group-hover:text-black transition-all">
                     {i+1}
                   </div>
                   <div className="text-right flex-1">
                      <p className="text-sm text-white font-bold mb-1 group-hover:text-lime-400 transition-colors">{step.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{step.description}</p>
                      <span className="text-[9px] text-lime-400/40 font-black uppercase tracking-widest mt-2 block">{step.resourceHint}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {state.aiInsights && (
            <div className="glass-panel p-10 text-right border-lime-400/10 bg-lime-400/5">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-end gap-3">
                رؤى استراتيجية
                <BrainCircuit className="text-lime-400" size={24} />
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed italic space-y-4">
                {state.aiInsights.split('\n').map((line, i) => line && (
                  <p key={i} className="border-r-2 border-lime-500/30 pr-4">{line.replace(/^\d+\.\s*/, '')}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Career Display */}
        <div className="lg:col-span-8 space-y-10">
          {report?.primary && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <CareerCard career={report.primary} isPrimary />
            </div>
          )}

          <div className="glass-panel p-10">
            <h2 className="text-xl font-black text-white mb-10 text-right uppercase tracking-widest opacity-30">Alternative Paths</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {report?.alternatives?.map((alt: any) => (
                <CareerCard key={alt.title} career={alt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
