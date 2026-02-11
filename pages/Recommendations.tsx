
import React, { useEffect, useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import CareerCard from '../components/CareerCard';
import Button from '../components/ui/Button';
import { 
  Download, RefreshCw, AlertCircle, Share2, 
  BookOpen, Star, Filter, MessageSquare, CheckCircle, 
  ExternalLink, ChevronRight, ChevronLeft, Info, ClipboardList, MapPin, Search, BrainCircuit, Sparkles
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { isAssessmentComplete } from '../utils/validators';
import { getCareerRecommendations, findTrainingCenters } from '../services/geminiService';

const Recommendations: React.FC = () => {
  const { state, dispatch } = useUser();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'compatibility' | 'growth' | 'salary'>('compatibility');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [trainingCenters, setTrainingCenters] = useState<{text: string, places: any[] | null}>({text: '', places: null});
  const [isFindingCenters, setIsFindingCenters] = useState(false);
  const [isDeepLogic, setIsDeepLogic] = useState(false);

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
      if (data.learningPath) {
        dispatch({ type: 'SET_LEARNING_PATH', path: data.learningPath });
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في محرك الذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [state.profile.fullName]); // Re-fetch only if profile changes or on initial mount

  const sortedAlternatives = useMemo(() => {
    if (!report?.alternatives) return [];
    const alternatives = [...report.alternatives];
    return alternatives.sort((a, b) => {
      if (sortBy === 'compatibility') return b.compatibility - a.compatibility;
      if (sortBy === 'salary') return parseInt(b.salary) - parseInt(a.salary);
      return 0;
    });
  }, [report?.alternatives, sortBy]);

  if (loading) {
    return (
      <div className="container-custom py-32 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 border-4 border-[#64FFDA]/20 border-t-[#64FFDA] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold text-white mb-2">ذكاء "مسار" يحلل مستقبلك...</h2>
        <p className="text-slate-400">نحن نربط مهاراتك بأفضل فرص سوق العمل المتاحة</p>
      </div>
    );
  }

  if (error === 'MISSING_ASSESSMENT') {
    return (
      <div className="container-custom py-24 text-center">
        <div className="max-w-xl mx-auto bg-[#112240] p-12 rounded-[3rem] border border-[#233554] shadow-2xl">
          <div className="bg-[#64FFDA]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <ClipboardList size={40} className="text-[#64FFDA]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">التقييم المهني غير مكتمل</h2>
          <p className="text-slate-400 mb-10 leading-relaxed">لتقديم توصيات دقيقة، نحتاج منك إكمال الاستبيان المهني أولاً. سيساعدنا ذلك في فهم مهاراتك وطموحاتك.</p>
          <Button onClick={() => window.location.hash = '/assessment'} className="bg-[#64FFDA] text-[#0A192F] px-12">ابدأ التقييم الآن</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-12">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-white mb-2">توصياتك المهنية</h1>
          <p className="text-slate-400">تحليل ذكي بناءً على ملفك الشخصي لعام 2025</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={fetchRecommendations} leftIcon={<RefreshCw size={16} />}>تحديث</Button>
          <Button className="bg-[#64FFDA] text-[#0A192F]" size="sm" onClick={() => exportToPDF('report-container')}>تصدير PDF</Button>
        </div>
      </div>

      <div id="report-container" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {report?.primary && (
            <section>
              <div className="flex items-center gap-3 mb-6 flex-row-reverse">
                <div className="w-1.5 h-8 bg-[#64FFDA] rounded-full"></div>
                <h2 className="text-xl font-bold text-white">المسار المهني المقترح</h2>
              </div>
              <CareerCard career={report.primary} isPrimary />
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-6 flex-row-reverse">
              <h2 className="text-xl font-bold text-white">مسارات بديلة</h2>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-[#112240] border border-[#233554] text-slate-300 p-2 rounded-xl text-xs">
                <option value="compatibility">حسب التوافق</option>
                <option value="salary">حسب الراتب</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {sortedAlternatives.map(alt => <CareerCard key={alt.id} career={alt} />)}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <section className="bg-[#112240] p-8 rounded-[2.5rem] border border-[#233554] text-right">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-end gap-3">
               خطوات التنفيذ
               <BookOpen className="text-[#64FFDA]" size={20} />
             </h3>
             <div className="space-y-6">
               {report?.learningPath?.map((step: string, i: number) => (
                 <div key={i} className="flex gap-4 flex-row-reverse items-start">
                   <div className="w-6 h-6 rounded-full bg-[#64FFDA]/10 text-[#64FFDA] text-[10px] font-bold flex items-center justify-center shrink-0 border border-[#64FFDA]/20">{i+1}</div>
                   <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                 </div>
               ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
