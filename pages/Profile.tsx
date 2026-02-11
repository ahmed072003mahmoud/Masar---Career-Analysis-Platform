
import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import { GeometricBadge } from '../components/Badges';
import CVTemplate from '../components/CVTemplate';
import Timeline from '../components/Timeline';
import ProfessionalTools from '../components/ProfessionalTools';
import { exportToPDF } from '../utils/pdfExport';
import { 
  User, Mail, Briefcase, Plus, Trash2, FileText, 
  Award, FolderKanban, BookOpen, Settings, BarChart3,
  Clock, Info, Sparkles, ChevronRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { fastHelper } from '../services/geminiService';

const Profile: React.FC = () => {
  const { state, dispatch } = useUser();
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'courses' | 'timeline' | 'tools'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [aiMotto, setAiMotto] = useState<string>('');

  useEffect(() => {
    const fetchMotto = async () => {
      try {
        const motto = await fastHelper(state.profile.summary);
        setAiMotto(motto);
      } catch (e) {
        setAiMotto("مهني طموح يسعى للتميز.");
      }
    };
    fetchMotto();
  }, [state.profile.summary]);

  const skillData = useMemo(() => {
    const coreSkills = state.profile.skills.length > 0 ? state.profile.skills : ['التحليل', 'البرمجة', 'الإدارة', 'التواصل', 'الابداع'];
    return coreSkills.slice(0, 5).map(skill => ({
      subject: skill,
      A: Math.floor(Math.random() * 40) + 60,
      fullMark: 100
    }));
  }, [state.profile.skills]);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      summary: formData.get('summary') as string,
      currentRole: formData.get('currentRole') as string,
    };
    dispatch({ type: 'UPDATE_PROFILE', profile: updates });
    dispatch({ type: 'LOG_EVENT', event: { type: 'skill', title: 'تحديث البيانات', description: 'قمت بتعديل معلوماتك الشخصية والمهنية.' } });
    setIsEditing(false);
    dispatch({ type: 'ADD_TOAST', message: 'تم تحديث الملف الشخصي بنجاح' });
  };

  const addProject = () => {
    const title = prompt('عنوان المشروع:');
    if (!title) return;
    const skills = prompt('المهارات المستخدمة (مفصولة بفاصلة):')?.split(',').map(s => s.trim()) || [];
    
    dispatch({ 
      type: 'ADD_PROJECT', 
      project: { id: Date.now().toString(), title, description: 'وصف المشروع العملي المنجز...', skills } 
    });
    dispatch({ type: 'ADD_POINTS', amount: 20 });
    dispatch({ 
      type: 'LOG_EVENT', 
      event: { type: 'project', title: 'مشروع جديد', description: `أضفت المشروع: ${title}` } 
    });
    dispatch({ type: 'ADD_TOAST', message: 'تم إضافة المشروع بنجاح' });
  };

  const addCourse = () => {
    const name = prompt('اسم الدورة:');
    if (!name) return;
    const provider = prompt('الجهة المانحة:') || 'منصة تعليمية';
    const duration = prompt('المدة (مثلاً: 4 أسابيع):') || 'غير محدد';

    dispatch({ 
      type: 'ADD_COURSE', 
      course: { id: Date.now().toString(), name, provider, date: new Date().getFullYear().toString(), duration } 
    });
    dispatch({ type: 'ADD_POINTS', amount: 15 });
    dispatch({ 
      type: 'LOG_EVENT', 
      event: { type: 'course', title: 'دورة تدريبية', description: `أتممت الدورة: ${name}` } 
    });
    dispatch({ type: 'ADD_TOAST', message: 'تم إضافة الدورة بنجاح' });
  };

  const tabs = [
    { id: 'info', label: 'المعلومات الأساسية', icon: <User size={18} /> },
    { id: 'projects', label: 'المشاريع', icon: <FolderKanban size={18} /> },
    { id: 'courses', label: 'الدورات', icon: <BookOpen size={18} /> },
    { id: 'timeline', label: 'الخط الزمني', icon: <Clock size={18} /> },
    { id: 'tools', label: 'أدوات الذكاء الاصطناعي', icon: <Sparkles size={18} className="text-[#64FFDA]" /> },
  ];

  return (
    <div className="container-custom py-12">
      {/* Header Profile Info */}
      <div className="bg-[#112240] text-white rounded-[3rem] p-8 md:p-12 shadow-xl mb-10 relative overflow-hidden border border-[#233554]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-right">
          <div className="w-24 h-24 bg-[#64FFDA] rounded-3xl flex items-center justify-center text-[#0A192F] text-3xl font-black shadow-lg shrink-0">
            {state.profile.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-white">{state.profile.fullName}</h1>
            <p className="text-slate-400 font-medium mb-2 flex items-center gap-2 justify-end">
              {state.profile.currentRole || 'لم يتم تحديد المسمى الوظيفي بعد'}
              <Briefcase size={16} />
            </p>
            {aiMotto && (
              <p className="text-[#64FFDA] text-xs font-bold italic mb-4 bg-[#64FFDA]/10 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <Sparkles size={12} />
                {aiMotto}
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-end">
               <span className="bg-[#0A192F] px-4 py-1.5 rounded-full text-xs font-bold border border-[#233554] text-slate-300">
                 {state.points} نقطة خبرة
               </span>
               <span className="bg-[#64FFDA] text-[#0A192F] px-4 py-1.5 rounded-full text-xs font-bold">
                 {state.badges.length} وسام رقمي
               </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-[#233554] text-slate-400 hover:text-white hover:bg-[#233554]" onClick={() => setIsEditing(!isEditing)} leftIcon={<Settings size={18} />}>
              الإعدادات
            </Button>
            <Button variant="secondary" className="bg-[#64FFDA] text-[#0A192F]" onClick={() => setShowCVPreview(true)} leftIcon={<FileText size={18} />}>
              السيرة الذاتية
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 bg-[#112240] p-2 rounded-2xl border border-[#233554] overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-row-reverse items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#64FFDA] text-[#0A192F] shadow-md scale-[1.02]' 
                : 'text-slate-400 hover:text-[#64FFDA] hover:bg-[#0A192F]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
               <section className="bg-[#112240] p-8 rounded-[2.5rem] shadow-sm border border-[#233554] text-right">
                  <h3 className="text-xl font-bold mb-6 flex items-center justify-end gap-3 text-white">
                    رادار المهارات
                    <BarChart3 className="text-[#64FFDA]" size={22} />
                  </h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                        <PolarGrid stroke="#233554" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#A8B2D1', fontWeight: 'bold' }} />
                        <Radar name="Level" dataKey="A" stroke="#64FFDA" fill="#64FFDA" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
               </section>
               <section className="bg-[#112240] p-8 rounded-[2.5rem] shadow-sm border border-[#233554] text-right">
                  <h3 className="text-xl font-bold mb-6 flex items-center justify-end gap-3 text-white">
                    آخر الأوسمة
                    <Award className="text-[#64FFDA]" size={22} />
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {state.badges.slice(-6).map(badge => (
                      <div key={badge} className="p-3 bg-[#0A192F] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-help border border-[#233554]" title={badge}>
                        <GeometricBadge type={badge} size={32} />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-6 text-slate-500" onClick={() => window.location.hash = '/gamification'} rightIcon={<ChevronRight size={14} />}>عرض الكل</Button>
               </section>
            </div>
            <div className="lg:col-span-2">
               <section className="bg-[#112240] p-10 rounded-[3rem] shadow-sm border border-[#233554] h-full text-right">
                  <h3 className="text-2xl font-bold mb-8 text-white">معلوماتك المهنية</h3>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">الاسم الكامل</label>
                          <input name="fullName" defaultValue={state.profile.fullName} className="w-full bg-[#0A192F] p-4 rounded-2xl border border-[#233554] outline-none focus:border-[#64FFDA] text-white text-right" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">البريد الإلكتروني</label>
                          <input name="email" defaultValue={state.profile.email} className="w-full bg-[#0A192F] p-4 rounded-2xl border border-[#233554] outline-none focus:border-[#64FFDA] text-white text-right" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">المسمى الوظيفي المستهدف</label>
                        <input name="currentRole" defaultValue={state.profile.currentRole} className="w-full bg-[#0A192F] p-4 rounded-2xl border border-[#233554] outline-none focus:border-[#64FFDA] text-white text-right" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">نبذة مهنية</label>
                        <textarea name="summary" defaultValue={state.profile.summary} className="w-full bg-[#0A192F] p-4 rounded-2xl border border-[#233554] h-40 resize-none outline-none focus:border-[#64FFDA] text-white text-right" />
                      </div>
                      <div className="flex flex-row-reverse gap-4">
                        <Button type="submit" variant="secondary" className="px-10 bg-[#64FFDA] text-[#0A192F]">حفظ التغييرات</Button>
                        <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="text-slate-500">إلغاء</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-1">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">البريد</span>
                           <p className="font-medium text-slate-200">{state.profile.email || 'غير محدد'}</p>
                         </div>
                         <div className="space-y-1">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">المستوى</span>
                           <p className="font-medium text-slate-200">{state.profile.experienceLevel === 'junior' ? 'مبتدئ' : 'متقدم'}</p>
                         </div>
                      </div>
                      <div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">نبذة عنك</span>
                         <p className="text-slate-400 leading-relaxed text-lg">{state.profile.summary}</p>
                      </div>
                      <div className="pt-8 border-t border-[#233554]">
                         <h4 className="font-bold mb-4 text-[#64FFDA]">المهارات الحالية</h4>
                         <div className="flex flex-wrap flex-row-reverse gap-2">
                           {state.profile.skills.map(s => (
                             <span key={s} className="bg-[#0A192F] text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-[#233554]">{s}</span>
                           ))}
                           {state.profile.skills.length === 0 && <p className="text-xs text-slate-600">لم يتم تحديد مهارات بعد.</p>}
                         </div>
                      </div>
                    </div>
                  )}
               </section>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <section className="bg-[#112240] p-10 rounded-[3rem] shadow-sm border border-[#233554] text-right">
            <div className="flex flex-row-reverse justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-white">المشاريع العملية</h3>
              <Button size="md" variant="secondary" className="bg-[#64FFDA] text-[#0A192F]" onClick={addProject} leftIcon={<Plus size={20} />}>
                إضافة مشروع
              </Button>
            </div>
            <div className="grid gap-6">
              {state.profile.projects.map(p => (
                <div key={p.id} className="group p-8 rounded-3xl border border-[#233554] bg-[#0A192F]/50 hover:bg-[#0A192F] hover:border-[#64FFDA]/30 transition-all flex flex-row-reverse justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-bold text-xl text-white mb-1">{p.title}</h4>
                      <p className="text-slate-400 leading-relaxed max-w-2xl">{p.description}</p>
                    </div>
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE_PROJECT', id: p.id })} className="text-slate-600 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {state.profile.projects.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-[#233554] rounded-[2.5rem]">
                  <FolderKanban size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 font-bold">لم تقم بإضافة أي مشاريع حتى الآن</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'courses' && (
          <section className="bg-[#112240] p-10 rounded-[3rem] shadow-sm border border-[#233554] text-right">
            <div className="flex flex-row-reverse justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-white">الدورات والشهادات</h3>
              <Button size="md" variant="secondary" className="bg-[#64FFDA] text-[#0A192F]" onClick={addCourse} leftIcon={<Plus size={20} />}>
                إضافة دورة
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.profile.courses.map(c => (
                <div key={c.id} className="p-6 bg-[#0A192F] rounded-[2rem] border border-[#233554] flex flex-row-reverse justify-between items-center">
                  <div className="flex flex-row-reverse items-center gap-5 text-right">
                    <div className="w-14 h-14 bg-[#112240] rounded-2xl flex items-center justify-center text-[#64FFDA] shadow-sm border border-[#233554]">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white">{c.name}</p>
                      <div className="flex flex-row-reverse gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex flex-row-reverse items-center gap-1">{c.provider} <Info size={12} /></span>
                        <span className="flex flex-row-reverse items-center gap-1">{c.date} <Clock size={12} /></span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE_COURSE', id: c.id })} className="text-slate-600 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {state.profile.courses.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-[#233554] rounded-[2.5rem]">
                  <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 font-bold">لم تضف أي دورات تعليمية بعد</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="bg-[#112240] p-10 rounded-[3rem] shadow-sm border border-[#233554]">
            <h3 className="text-2xl font-bold mb-10 text-white text-right">سجل الإنجازات المهنية</h3>
            <Timeline events={state.events} />
          </section>
        )}

        {activeTab === 'tools' && (
          <div className="max-w-4xl mx-auto">
             <ProfessionalTools />
          </div>
        )}
      </div>

      {showCVPreview && (
        <div className="fixed inset-0 z-[100] bg-[#020C1B]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 overflow-auto">
          <div className="relative max-w-5xl w-full animate-in zoom-in-95 duration-300">
            <div className="bg-[#112240] p-6 rounded-t-[2.5rem] flex flex-row-reverse justify-between items-center border-b border-[#233554]">
              <h3 className="font-bold text-xl text-white">معاينة السيرة الذاتية الذكية</h3>
              <div className="flex flex-row-reverse gap-4">
                <Button variant="secondary" size="sm" className="bg-[#64FFDA] text-[#0A192F]" onClick={() => exportToPDF('cv-template', `${state.profile.fullName}-cv.pdf`)}>
                  تحميل PDF (A4)
                </Button>
                <button onClick={() => setShowCVPreview(false)} className="text-slate-500 hover:text-white font-bold text-sm">إغلاق</button>
              </div>
            </div>
            <div className="bg-[#0A192F] p-8 rounded-b-[2.5rem] flex justify-center overflow-auto max-h-[80vh]">
               <CVTemplate profile={state.profile} badges={state.badges} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
