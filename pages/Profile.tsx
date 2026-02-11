
import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import { GeometricBadge } from '../components/Badges';
import CVTemplate from '../components/CVTemplate';
import Timeline from '../components/Timeline';
import ProfessionalTools from '../components/ProfessionalTools';
import { exportToPDF } from '../utils/pdfExport';
import { 
  User, Briefcase, Plus, Trash2, FileText, Award, 
  FolderKanban, BookOpen, Settings, BarChart3, Clock, 
  Sparkles, Palette, Check, Download, Image as ImageIcon, Loader2, BrainCircuit
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { fastHelper, generateProfileSummary, generateProfessionalAsset } from '../services/geminiService';

const Profile: React.FC = () => {
  const { state, dispatch } = useUser();
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'courses' | 'timeline' | 'tools'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIContent = async () => {
      // If we don't have an AI summary yet, generate it based on current profile and assessment
      if (!state.aiSummary && (state.profile.skills.length > 0 || Object.keys(state.answers).length > 0)) {
        try {
          const summary = await generateProfileSummary(state.profile, state.answers);
          dispatch({ type: 'SET_AI_SUMMARY', summary });
        } catch (e) {
          console.error("AI Summary generation failed", e);
        }
      }
    };
    fetchAIContent();
  }, [state.profile.skills, state.answers]);

  const handleGenerateAsset = async () => {
    setIsGeneratingAsset(true);
    dispatch({ type: 'INCREMENT_AI_INTERACTION' });
    try {
      const prompt = `Professional 3D avatar or banner representing a ${state.profile.currentRole || 'Career Professional'} with expertise in ${state.profile.skills[0] || 'Leadership'}. Sleek, high-tech aesthetic.`;
      const img = await generateProfessionalAsset(prompt, "4K");
      setGeneratedAsset(img);
      dispatch({ type: 'ADD_TOAST', message: 'تم توليد أصل رقمي عالي الدقة بنجاح' });
    } catch (e) {
      dispatch({ type: 'ADD_TOAST', message: 'فشل توليد الأصول الرقمية' });
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const skillData = useMemo(() => {
    const coreSkills = state.profile.skills.length > 0 ? state.profile.skills : ['التحليل', 'البرمجة', 'الإدارة', 'التواصل', 'الابداع'];
    return coreSkills.slice(0, 5).map(skill => ({
      subject: skill,
      A: Math.floor(Math.random() * 40) + 60,
      fullMark: 100
    }));
  }, [state.profile.skills]);

  return (
    <div className="container-custom py-12 relative">
      <div className="aurora aurora-teal"></div>

      {/* Hero Profile Card */}
      <div className="bento-card p-12 mb-10 border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none group-hover:opacity-[0.06] transition-all duration-1000"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 text-right relative z-10">
          <div className="w-32 h-32 bg-[var(--accent)] rounded-[3rem] flex items-center justify-center text-black text-5xl font-black shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {state.profile.fullName.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-black text-white">{state.profile.fullName}</h1>
            <p className="text-xl text-slate-400 font-bold flex items-center gap-3 justify-end">
              {state.profile.currentRole || 'مستكشف مسارات'}
              <Briefcase size={22} className="text-[var(--accent)]" />
            </p>
            
            {state.aiSummary && (
              <div className="relative p-6 bg-white/5 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-right-4">
                <div className="absolute top-4 left-4 opacity-20">
                  <Sparkles size={16} className="text-[var(--accent)]" />
                </div>
                <p className="text-sm text-slate-300 font-medium max-w-2xl ml-auto leading-relaxed text-right">
                  {state.aiSummary}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end pt-2">
               <span className="bg-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
                 {state.points} XP 
               </span>
               <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--accent)]/20">
                 {state.badges.length} Badges
               </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
             <Button variant="outline" onClick={() => setIsEditing(!isEditing)} leftIcon={<Settings size={18} />}>
               الإعدادات
             </Button>
             <Button variant="primary" onClick={() => setShowCVPreview(true)} leftIcon={<FileText size={18} />}>
               عرض السيرة الذاتية
             </Button>
          </div>
        </div>
      </div>

      {/* Dash Tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar bg-white/5 p-1.5 rounded-3xl border border-white/5">
        {['info', 'projects', 'courses', 'timeline', 'tools'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === t ? 'bg-[var(--accent)] text-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {activeTab === 'info' && (
          <>
            <div className="lg:col-span-4 space-y-8">
               {/* Radar Chart Skills */}
               <section className="bento-card p-10 text-right">
                  <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3 justify-end">
                    خارطة المهارات
                    <BarChart3 className="text-[var(--accent)]" size={24} />
                  </h3>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                        <Radar dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
               </section>

               {/* Badge Showcase */}
               <section className="bento-card p-10 text-right">
                  <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3 justify-end">
                    مختبر الأوسمة
                    <Award className="text-[var(--accent)]" size={24} />
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {state.badges.map(b => (
                      <div key={b} className="bg-white/5 p-4 rounded-2xl flex items-center justify-center border border-white/5 hover:scale-110 transition-transform cursor-pointer group">
                        <GeometricBadge type={b} size={32} />
                      </div>
                    ))}
                    {state.badges.length === 0 && <p className="col-span-3 text-[10px] text-slate-500 font-bold text-center py-4">أكمل المهام لفتح الأوسمة</p>}
                  </div>
               </section>
            </div>

            <div className="lg:col-span-8 space-y-8">
               {/* AI Asset Lab */}
               <section className="bento-card p-12 text-right relative overflow-hidden">
                  <div className="flex items-center justify-between mb-10 flex-row-reverse relative z-10">
                    <div className="text-right">
                      <h2 className="text-2xl font-black text-white">مختبر الأصول المهنية</h2>
                      <p className="text-xs text-slate-400 font-bold">توليد أصول بصرية مخصصة لمسارك باستخدام Gemini</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateAsset} 
                      isLoading={isGeneratingAsset}
                      leftIcon={<ImageIcon size={16} />}
                      className="border-[var(--accent)]/30 text-[var(--accent)]"
                    >
                      توليد صورة 4K
                    </Button>
                  </div>
                  
                  {generatedAsset ? (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500 relative z-10">
                      <img src={generatedAsset} className="w-full h-80 object-cover rounded-[2.5rem] border border-white/10 shadow-2xl" />
                      <div className="flex justify-center gap-4">
                        <a href={generatedAsset} download="masar-portfolio-asset.png" className="flex items-center gap-2 text-[var(--accent)] font-black text-xs hover:underline">
                          تحميل الأصل الرقمي <Download size={14} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-600 bg-black/20 group relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-[var(--accent)] to-transparent transition-opacity"></div>
                      <Sparkles size={48} className="mb-4 opacity-20 animate-pulse text-[var(--accent)]" />
                      <p className="font-bold text-slate-400">أنشئ خلفية مهنية مخصصة بالذكاء الاصطناعي</p>
                    </div>
                  )}
               </section>

               {/* AI Insights persistent section */}
               {state.aiInsights && (
                 <section className="bento-card p-12 text-right border-[var(--accent)]/20 bg-[var(--accent)]/5">
                    <h2 className="text-2xl font-black text-white mb-8 flex items-center justify-end gap-3">
                      الرؤى الاستراتيجية المحفوظة
                      <BrainCircuit className="text-[var(--accent)]" size={28} />
                    </h2>
                    <div className="text-lg text-slate-300 leading-relaxed font-medium space-y-4">
                      {state.aiInsights.split('\n').map((line, i) => line && (
                        <p key={i} className="border-r-2 border-[var(--accent)] pr-6">{line.replace(/^\d+\.\s*/, '')}</p>
                      ))}
                    </div>
                 </section>
               )}

               <section className="bento-card p-12 text-right">
                  <h2 className="text-2xl font-black text-white mb-8">ملخصك المهني</h2>
                  <p className="text-lg text-slate-400 leading-relaxed font-medium border-r-4 border-white/5 pr-8">
                    {state.profile.summary}
                  </p>
               </section>
            </div>
          </>
        )}

        {activeTab === 'timeline' && <div className="lg:col-span-12"><Timeline events={state.events} /></div>}
        {activeTab === 'tools' && <div className="lg:col-span-12"><ProfessionalTools /></div>}
      </div>

      {/* CV Modal */}
      {showCVPreview && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="max-w-4xl w-full max-h-[90vh] overflow-auto bento-card border-white/10 shadow-3xl">
              <div className="p-8 border-b border-white/10 flex flex-row-reverse justify-between items-center sticky top-0 bg-black/50 backdrop-blur-md z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Professional Bio Report</h3>
                <div className="flex gap-4">
                  <Button variant="primary" onClick={() => exportToPDF('cv-template')} leftIcon={<Download size={18} />}>Export PDF</Button>
                  <button onClick={() => setShowCVPreview(false)} className="text-slate-500 hover:text-white font-black uppercase text-xs tracking-widest px-4">Close</button>
                </div>
              </div>
              <div className="bg-white p-12 overflow-auto">
                <CVTemplate profile={state.profile} badges={state.badges} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
