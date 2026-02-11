
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  User, Mail, GraduationCap, FileText, ChevronLeft, 
  ChevronRight, Sparkles, ClipboardList, Target, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { validateEmail, validateFullName, isNotEmpty } from '../utils/validators';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const [step, setStep] = useState(0); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: state.profile.fullName === 'زائر مسار' ? '' : state.profile.fullName,
    email: state.profile.email,
    education: state.profile.education,
    summary: state.profile.summary,
    experienceLevel: state.profile.experienceLevel
  });

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!validateFullName(formData.fullName)) newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل وبدون أرقام';
      if (!validateEmail(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (step === 2) {
      if (!isNotEmpty(formData.education)) newErrors.education = 'المؤهل التعليمي مطلوب';
    }
    if (step === 3) {
      if (!isNotEmpty(formData.summary)) newErrors.summary = 'يرجى كتابة نبذة بسيطة عنك';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step > 0 && !validateStep()) return;
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleStartAnalysis = () => {
    if (!validateStep()) return;
    dispatch({ type: 'UPDATE_PROFILE', profile: formData });
    navigate('/questionnaire');
  };

  if (step === 0) {
    return (
      <div className="container-custom py-12 md:py-24 animate-in fade-in duration-1000">
        <div className="max-w-6xl mx-auto">
          <div className="glass-panel overflow-hidden grid lg:grid-cols-5 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-[100px]"></div>
            
            <div className="lg:col-span-2 bg-slate-900/40 p-12 text-white flex flex-col justify-between relative overflow-hidden border-l border-white/5">
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 bg-lime-400/10 px-6 py-3 rounded-full text-[10px] font-black mb-10 border border-lime-400/20 backdrop-blur-sm uppercase tracking-widest text-lime-400">
                    <Sparkles size={14} />
                    AI-Driven Assessment 4.0
                  </div>
                  <h1 className="text-5xl font-black mb-8 text-white leading-tight text-right tracking-tighter uppercase">Professional <br /><span className="text-lime-400">Blueprint</span></h1>
                  <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium text-right">
                    اكتشف مسارك المهني الحقيقي عبر تحليل ذكي يغوص في مهاراتك وشخصيتك وطموحك.
                  </p>
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-6 group justify-end">
                     <span className="text-lg font-bold text-slate-100 group-hover:text-lime-400 transition-colors">دقة تحليلية استثنائية</span>
                     <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black transition-all duration-500 shadow-inner text-lime-400">
                       <Target size={28} />
                     </div>
                  </div>
                  <div className="flex items-center gap-6 group justify-end">
                     <span className="text-lg font-bold text-slate-100 group-hover:text-lime-400 transition-colors">خارطة طريق مخصصة</span>
                     <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black transition-all duration-500 shadow-inner text-lime-400">
                       <ClipboardList size={28} />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-3 p-12 md:p-24 flex flex-col justify-center items-center text-center">
              <div className="bg-lime-400/10 p-10 rounded-[3rem] mb-12 shadow-inner border border-lime-400/20 animate-pulse">
                <ClipboardList size={80} className="text-lime-400" />
              </div>
              <h2 className="text-4xl font-black mb-6 text-white text-right tracking-tight">جاهز لخطوتك القادمة؟</h2>
              <p className="text-slate-400 mb-12 text-xl leading-relaxed max-w-md font-medium text-right">
                سنبدأ بجمع معلوماتك الأساسية أولاً، ثم ننتقل لتحليل أعمق لمهاراتك وتطلعاتك.
              </p>
              <div className="w-full max-w-sm space-y-6">
                <Button 
                  size="lg" 
                  className="w-full rounded-[2.5rem] py-8 bg-lime-400 text-black shadow-vivid text-2xl font-black" 
                  onClick={nextStep}
                  rightIcon={<ChevronLeft size={24} />}
                >
                  بدء الإعداد
                </Button>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] pt-4">
                  Estimated time: 2 Minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 max-w-3xl min-h-[80vh] flex flex-col justify-center animate-in slide-in-from-bottom-12 duration-1000">
      <div className="mb-16">
        <ProgressBar progress={(step / 3) * 100} label="تحليل الهوية المهنية" />
      </div>

      <div className="glass-panel p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-lime-400/5 blur-3xl"></div>
        
        <div className="relative z-10">
          {step === 1 && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-lime-400/10 text-lime-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-lime-400/20">
                  <User size={48} />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Identity Core</h2>
                <p className="text-slate-500 text-lg font-bold mt-2">لنتعرف عليك بشكل أفضل قبل البدء بالتحليل</p>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mr-4 text-right">الاسم الكامل</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="أحمد خالد"
                      className={`w-full px-8 py-6 bg-slate-900/50 border-2 rounded-3xl outline-none transition-all pr-16 text-xl font-bold text-white text-right ${errors.fullName ? 'border-red-500' : 'border-white/5 focus:border-lime-400'}`}
                    />
                    <User className={`absolute top-1/2 -translate-y-1/2 right-6 transition-colors ${errors.fullName ? 'text-red-500' : 'text-slate-600 group-focus-within:text-lime-400'}`} size={28} />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 font-bold text-right flex items-center justify-end gap-2 mt-2"><AlertCircle size={14} /> {errors.fullName}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mr-4 text-right">البريد الإلكتروني</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`w-full px-8 py-6 bg-slate-900/50 border-2 rounded-3xl outline-none transition-all pr-16 text-xl font-bold text-white text-right ${errors.email ? 'border-red-500' : 'border-white/5 focus:border-lime-400'}`}
                    />
                    <Mail className={`absolute top-1/2 -translate-y-1/2 right-6 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-600 group-focus-within:text-lime-400'}`} size={28} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-bold text-right flex items-center justify-end gap-2 mt-2"><AlertCircle size={14} /> {errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-indigo-500/20">
                  <GraduationCap size={48} />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Professional Context</h2>
                <p className="text-slate-500 text-lg font-bold mt-2">مستواك الحالي يساعدنا في تصفية التوصيات</p>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mr-4 text-right">أعلى مؤهل تعليمي</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="بكالوريوس علوم الحاسب"
                      className={`w-full px-8 py-6 bg-slate-900/50 border-2 rounded-3xl outline-none transition-all pr-16 text-xl font-bold text-white text-right ${errors.education ? 'border-red-500' : 'border-white/5 focus:border-lime-400'}`}
                    />
                    <GraduationCap className={`absolute top-1/2 -translate-y-1/2 right-6 transition-colors ${errors.education ? 'text-red-500' : 'text-slate-600 group-focus-within:text-lime-400'}`} size={28} />
                  </div>
                  {errors.education && <p className="text-xs text-red-500 font-bold text-right flex items-center justify-end gap-2 mt-2"><AlertCircle size={14} /> {errors.education}</p>}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mr-4 text-right">مستوى الخبرة</label>
                  <div className="relative">
                    <select 
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-slate-900 border-2 border-white/5 rounded-3xl focus:border-lime-400 outline-none transition-all appearance-none cursor-pointer text-xl font-bold text-white text-right"
                    >
                      <option value="junior">مبتدئ (0-2 سنوات)</option>
                      <option value="mid">متوسط (3-6 سنوات)</option>
                      <option value="senior">خبير (7+ سنوات)</option>
                    </select>
                    <ChevronRight className="absolute top-1/2 -translate-y-1/2 left-8 text-slate-500 rotate-90 pointer-events-none" size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-violet-500/10 text-violet-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-violet-500/20">
                  <FileText size={48} />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Strategic Pitch</h2>
                <p className="text-slate-500 text-lg font-bold mt-2">صف مهاراتك أو طموحاتك في جملة بسيطة</p>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mr-4 text-right">الملخص المهني</label>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="مطور ويب شغوف ببناء تطبيقات سحابية..."
                  className={`w-full px-8 py-6 bg-slate-900/50 border-2 rounded-3xl outline-none transition-all resize-none text-xl font-bold leading-relaxed shadow-inner text-white text-right ${errors.summary ? 'border-red-500' : 'border-white/5 focus:border-lime-400'}`}
                />
                {errors.summary && <p className="text-xs text-red-500 font-bold text-right flex items-center justify-end gap-2 mt-2"><AlertCircle size={14} /> {errors.summary}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-20 pt-12 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="text-slate-500 font-black hover:text-white uppercase tracking-widest text-[10px]"
              leftIcon={<ChevronRight size={20} />}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={nextStep}
                className="px-12 rounded-3xl py-6 bg-lime-400 text-black font-black"
                rightIcon={<ChevronLeft size={24} />}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleStartAnalysis}
                className="px-12 rounded-3xl py-6 bg-lime-400 text-black font-black shadow-vivid"
                rightIcon={<Sparkles className="w-6 h-6" />}
              >
                Execute Analysis
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
