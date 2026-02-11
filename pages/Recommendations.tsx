
import React, { useEffect, useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import CareerCard from '../components/CareerCard';
import Button from '../components/ui/Button';
import { 
  Download, RefreshCw, Bookmark, Sparkles, BookOpen, 
  MapPin, Search, BrainCircuit, ExternalLink, ChevronRight, Info, Zap
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { isAssessmentComplete } from '../utils/validators';
import { getCareerRecommendations, findTrainingCenters, refineLearningPath, getCareerInsights } from '../services/geminiService';

const Recommendations: React.FC = () => {
  const { state, dispatch } = useUser();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [insights, setInsights] = useState<string>('');
  
  const [trainingCenters, setTrainingCenters] = useState<{text: string, places: any[]}>({text: '', places: []});
  const [isFindingCenters, setIsFindingCenters] = useState(false);

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
      const aiInsights = await getCareerInsights(state.profile, data);
      setInsights(aiInsights);
      
      // Persist in memory for this session
      dispatch({ type: 'SET_AI_INSIGHTS', insights: aiInsights });

      if (data.learningPath) {
        dispatch({ type: 'SET_LEARNING_PATH', path: data.learningPath });
      }
    } catch (err: any) {
      setError('حدث خطأ في محرك الذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = () => {
    if (!report) return;
    dispatch({ type: 'SAVE_REPORT', report });
    if (insights) dispatch({ type: 'SET_AI_INSIGHTS', insights });
    
    dispatch({ type: 'ADD_TOAST', message: 'تم حفظ التقرير والرؤى الاستراتيجية في ملفك الشخصي' });
    dispatch({ type: 'ADD_POINTS', amount: 15 });
    dispatch({ type: 'LOG_EVENT', event: { 
      type: 'assessment', 
      title: 'حفظ تحليل مهني', 
      description: 'تم أرشفة نتائج التحليل المهني وتوصيات Gemini في الملف الشخصي.' 
    }});
  };

  const handleRefinePath = async () => {
    if (!report || !report.learningPath) return;
    setIsRefining(true);
    dispatch({ type: 'INCREMENT_AI_INTERACTION' });
    try {
      const refined = await refineLearningPath(report.learningPath, report.primary.title);
      setReport({ ...report, learningPath: refined });
      dispatch({ type: 'SET_LEARNING_PATH', path: refined });
      dispatch({ type: 'ADD_TOAST', message: 'تم تخصيص مسار التعلم بمصادر متقدمة' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleFindCenters = async () => {
    if (!report?.primary?.skills?.[0]) return;
    setIsFindingCenters(true);
    try {
      const location = { lat: 24.7136, lng: 46.6753 }; 
      const centers = await findTrainingCenters(location, report.primary.skills[0]);
      setTrainingCenters(centers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFindingCenters(false);
    }
  };

  useEffect(() => {
    if (state.savedReport && !report) {
       setReport(state.savedReport);
       if (state.aiInsights) setInsights(state.aiInsights);
       setLoading(false);
    } else {
       fetchRecommendations();
    }
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-32 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Building Career Blueprint</h2>
        <p className="text-slate-400 font-medium italic">Gemini is synthesizing your unique career DNA...</p>
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

  return (
    <div className="container-custom py-12 relative">
      <div className="aurora aurora-violet"></div>
      
      <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-8 mb-12">
        <div className="text-right">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">خارطة الطريق المخصصة</h1>
          <p className="text-slate-400 font-medium">تحليل ذكاء اصطناعي متوافق مع رؤية 2030</p>
        </div>
        <div className="flex flex-wrap flex-row-reverse gap-4">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSaveToProfile} 
            leftIcon={<Bookmark size={16} />}
            className="shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            حفظ في الملف
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToPDF('report-container')} leftIcon={<Download size={16} />}>
            تصدير PDF
          </Button>
        </div>
      </div>

      <div id="report-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Insights & Learning Path */}
        <div className="lg:col-span-4 space-y-6">
          {insights && (
            <div className="bento-card p-10 text-right border-[var(--accent)]/20 bg-[var(--accent)]/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={64} />
              </div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-end gap-3">
                رؤى استراتيجية
                <Zap className="text-[var(--accent)] animate-pulse" size={24} />
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed italic space-y-4">
                {insights.split('\n').map((line, i) => line && (
                  <p key={i} className="border-r-2 border-[var(--accent)]/30 pr-4">{line.replace(/^\d+\.\s*/, '')}</p>
                ))}
              </div>
            </div>
          )}

          <div className="bento-card p-10 text-right">
             <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  خطة التعلم
                  <BookOpen className="text-[var(--accent)]" size={24} />
                </h3>
                <button 
                  onClick={handleRefinePath}
                  disabled={isRefining}
                  className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {isRefining ? 'جاري التخصيص...' : 'تخصيص الخطة'}
                  <Sparkles size={12} />
                </button>
             </div>
             <div className="space-y-6">
               {report?.learningPath?.map((step: string, i: number) => (
                 <div key={i} className="flex gap-4 flex-row-reverse items-start group">
                   <div className="w-8 h-8 rounded-xl bg-white/5 text-[var(--accent)] text-xs font-black flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                     {i+1}
                   </div>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-white transition-colors">{step}</p>
                 </div>
               ))}
             </div>
          </div>

          <div className="bento-card p-10 text-right">
             <h3 className="text-xl font-bold text-white mb-8 flex items-center justify-end gap-3">
               مراكز تدريب قريبة
               <MapPin className="text-[var(--accent)]" size={24} />
             </h3>
             {trainingCenters.places.length > 0 ? (
               <div className="space-y-4 mb-8">
                  {trainingCenters.places.map((place: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[var(--accent)]/30 transition-all">
                       <p className="text-sm font-bold text-white mb-2">{place.maps?.title || 'مركز تدريب'}</p>
                       <a href={place.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--accent)] flex items-center gap-1 justify-end font-bold hover:underline">
                         عرض على الخريطة
                         <ExternalLink size={10} />
                       </a>
                    </div>
                  ))}
               </div>
             ) : (
               <Button variant="outline" className="w-full text-xs" onClick={handleFindCenters} isLoading={isFindingCenters}>
                 ابحث عن مراكز تدريب
               </Button>
             )}
          </div>
        </div>

        {/* Career Paths Display */}
        <div className="lg:col-span-8 space-y-6">
          {report?.primary && (
            <div className="bento-card p-1 border-[var(--accent)]/30">
               <CareerCard career={report.primary} isPrimary />
            </div>
          )}

          <div className="bento-card p-10">
            <h2 className="text-xl font-bold text-white mb-8 text-right uppercase tracking-widest opacity-50">Alternative Horizons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {report?.alternatives?.map((alt: any) => (
                <div key={alt.title} className="glass-card p-6 border-white/5 bg-white/5 hover:border-[var(--accent)]/20 transition-all">
                   <CareerCard career={alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
