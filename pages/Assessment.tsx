
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { 
  User, Mail, GraduationCap, FileText, ChevronLeft, 
  ChevronRight, Sparkles, ClipboardList, Target, ShieldCheck 
} from 'lucide-react';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const [step, setStep] = useState(0); // 0: Landing, 1: Identity, 2: Education, 3: Bio
  const [formData, setFormData] = useState({
    fullName: state.profile.fullName === 'زائر مسار' ? '' : state.profile.fullName,
    email: state.profile.email,
    education: state.profile.education,
    summary: state.profile.summary,
    experienceLevel: state.profile.experienceLevel
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartAnalysis = () => {
    dispatch({ type: 'UPDATE_PROFILE', profile: formData });
    navigate('/questionnaire');
  };

  // Steps UI
  if (step === 0) {
    return (
      <div className="container-custom py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#112240] rounded-[4rem] shadow-2xl overflow-hidden border border-[#233554] grid lg:grid-cols-5 ring-1 ring-white/5 animate-in fade-in zoom-in duration-700">
            {/* Side Panel */}
            <div className="lg:col-span-2 bg-[#0A192F] p-12 text-white flex flex-col justify-between relative overflow-hidden border-l border-[#233554]">
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#64FFDA] opacity-5 rounded-full -ml-32 -mb-32 filter blur-3xl"></div>
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-[#64FFDA]/10 px-5 py-2.5 rounded-full text-xs font-black mb-8 border border-[#64FFDA]/20 backdrop-blur-sm">
                    <Sparkles size={14} className="text-[#64FFDA]" />
                    مدعوم بالذكاء الاصطناعي
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-8 text-white leading-tight text-right">التقييم المهني الشامل</h1>
                  <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium text-right">
                    اكتشف مسارك المهني الحقيقي عبر تحليل ذكي يغوص في مهاراتك وشخصيتك وطموحك.
                  </p>
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-5 group justify-end">
                     <span className="text-lg font-bold text-slate-100">تحديد نقاط القوة بدقة 95%</span>
                     <div className="w-12 h-12 rounded-2xl bg-[#64FFDA]/10 flex items-center justify-center group-hover:bg-[#64FFDA] group-hover:text-[#0A192F] transition-all duration-300 shadow-inner text-[#64FFDA]">
                       <Target size={24} />
                     </div>
                  </div>
                  <div className="flex items-center gap-5 group justify-end">
                     <span className="text-lg font-bold text-slate-100">خارطة طريق مهنية مخصصة</span>
                     <div className="w-12 h-12 rounded-2xl bg-[#64FFDA]/10 flex items-center justify-center group-hover:bg-[#64FFDA] group-hover:text-[#0A192F] transition-all duration-300 shadow-inner text-[#64FFDA]">
                       <ClipboardList size={24} />
                     </div>
                  </div>
                  <div className="flex items-center gap-5 group justify-end">
                     <span className="text-lg font-bold text-slate-100">تحليل متوافق مع سوق العمل</span>
                     <div className="w-12 h-12 rounded-2xl bg-[#64FFDA]/10 flex items-center justify-center group-hover:bg-[#64FFDA] group-hover:text-[#0A192F] transition-all duration-300 shadow-inner text-[#64FFDA]">
                       <ShieldCheck size={24} />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-3 p-12 md:p-24 flex flex-col justify-center items-center text-center bg-[#112240]">
              <div className="bg-[#64FFDA]/10 p-8 rounded-[3rem] mb-12 shadow-inner border border-[#64FFDA]/20 animate-bounce-subtle">
                <ClipboardList size={80} className="text-[#64FFDA]" />
              </div>
              <h2 className="text-4xl font-black mb-6 text-white text-right">جاهز لخطوتك القادمة؟</h2>
              <p className="text-slate-400 mb-12 text-xl leading-relaxed max-w-md font-medium text-right">
                سنبدأ بجمع معلوماتك الأساسية أولاً، ثم ننتقل لتحليل أعمق لمهاراتك وتطلعاتك.
              </p>
              <div className="w-full max-w-sm space-y-6">
                <Button 
                  size="lg" 
                  className="w-full rounded-[2rem] py-6 bg-[#64FFDA] text-[#0A192F] shadow-2xl shadow-[#64FFDA]/10 text-xl font-black transform hover:scale-105 active:scale-95 transition-all" 
                  onClick={nextStep}
                  rightIcon={<ChevronLeft size={24} />}
                >
                  بدء الإعداد السريع
                </Button>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-[#233554] flex-1"></div>
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                    يستغرق أقل من 2 دقيقة
                  </p>
                  <div className="h-px bg-[#233554] flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 max-w-2xl min-h-[80vh] flex flex-col justify-center">
      <div className="mb-12">
        <ProgressBar progress={(step / 3) * 100} label="إعداد ملفك الشخصي" />
      </div>

      <div className="bg-[#112240] rounded-[3rem] shadow-2xl border border-[#233554] overflow-hidden animate-in slide-in-from-left duration-500 ring-1 ring-white/5">
        <div className="p-10 md:p-16">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-[#64FFDA]/10 text-[#64FFDA] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#64FFDA]/20">
                  <User size={40} />
                </div>
                <h2 className="text-3xl font-black text-white">من أنت؟</h2>
                <p className="text-slate-400 text-lg font-medium">لنتعرف عليك بشكل أفضل قبل البدء بالتحليل</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mr-2 text-right">الاسم الكامل</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="أحمد خالد"
                      className="w-full px-6 py-5 bg-[#0A192F] border-2 border-[#233554] rounded-2xl focus:border-[#64FFDA] focus:bg-[#0A192F] outline-none transition-all pr-14 text-lg font-bold text-white text-right"
                    />
                    <User className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-600 group-focus-within:text-[#64FFDA] transition-colors" size={24} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mr-2 text-right">البريد الإلكتروني</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-6 py-5 bg-[#0A192F] border-2 border-[#233554] rounded-2xl focus:border-[#64FFDA] focus:bg-[#0A192F] outline-none transition-all pr-14 text-lg font-bold text-white text-right"
                    />
                    <Mail className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-600 group-focus-within:text-[#64FFDA] transition-colors" size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-500/20">
                  <GraduationCap size={40} />
                </div>
                <h2 className="text-3xl font-black text-white">الخلفية المهنية</h2>
                <p className="text-slate-400 text-lg font-medium">مستواك الحالي يساعدنا في تصفية التوصيات</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mr-2 text-right">أعلى مؤهل تعليمي</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="بكالوريوس علوم الحاسب"
                      className="w-full px-6 py-5 bg-[#0A192F] border-2 border-[#233554] rounded-2xl focus:border-[#64FFDA] focus:bg-[#0A192F] outline-none transition-all pr-14 text-lg font-bold text-white text-right"
                    />
                    <GraduationCap className="absolute top-1/2 -translate-y-1/2 right-5 text-slate-600 group-focus-within:text-[#64FFDA] transition-colors" size={24} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mr-2 text-right">مستوى الخبرة</label>
                  <div className="relative">
                    <select 
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-[#0A192F] border-2 border-[#233554] rounded-2xl focus:border-[#64FFDA] focus:bg-[#0A192F] outline-none transition-all appearance-none cursor-pointer text-lg font-bold text-white text-right"
                    >
                      <option value="junior">مبتدئ (0-2 سنوات)</option>
                      <option value="mid">متوسط (3-6 سنوات)</option>
                      <option value="senior">خبير (7+ سنوات)</option>
                    </select>
                    <ChevronRight className="absolute top-1/2 -translate-y-1/2 left-5 text-slate-500 rotate-90 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-500/20">
                  <FileText size={40} />
                </div>
                <h2 className="text-3xl font-black text-white">نبذة سريعة</h2>
                <p className="text-slate-400 text-lg font-medium">صف مهاراتك أو طموحاتك في جملة بسيطة</p>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mr-2 text-right">الملخص المهني</label>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="مطور ويب شغوف ببناء تطبيقات سحابية..."
                  className="w-full px-6 py-5 bg-[#0A192F] border-2 border-[#233554] rounded-2xl focus:border-[#64FFDA] focus:bg-[#0A192F] outline-none transition-all resize-none text-lg font-bold leading-relaxed shadow-inner text-white text-right"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-16 pt-10 border-t border-[#233554]">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="text-slate-500 font-black hover:text-[#64FFDA]"
              leftIcon={<ChevronRight className="w-6 h-6" />}
            >
              السابق
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={nextStep}
                disabled={step === 1 && (!formData.fullName || !formData.email)}
                className="px-10 rounded-2xl py-5 bg-[#64FFDA] text-[#0A192F]"
                rightIcon={<ChevronLeft className="w-6 h-6" />}
              >
                التالي
              </Button>
            ) : (
              <Button 
                onClick={handleStartAnalysis}
                variant="secondary"
                className="px-10 rounded-2xl py-5 shadow-vivid bg-[#64FFDA] text-[#0A192F]"
                rightIcon={<Sparkles className="w-6 h-6" />}
              >
                بدء التحليل العميق
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
