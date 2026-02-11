
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Rocket, Target, ShieldCheck, 
  Trophy, Briefcase, ChevronLeft, Layout as LayoutIcon,
  LineChart, Award, HelpCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { calculateLevel } from '../utils/pointsCalculator';
import { GeometricBadge } from '../components/Badges';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useUser();
  const hasAssessment = Object.keys(state.answers).length > 0;
  const currentLevel = calculateLevel(state.points);

  return (
    <div className="bg-[#0A192F]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 px-4">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#64FFDA] rounded-full mix-blend-screen filter blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] translate-x-1/2 translate-y-1/2 opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 items-center gap-16">
          <div className="text-right animate-in fade-in slide-in-from-right duration-700">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white">
              ارسم خريطتك المهنية <br className="hidden md:block" /> بدقة <span className="text-[#64FFDA]">الذكاء الاصطناعي</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
              نساعدك في مسار على تحليل مهاراتك، استكشاف فرص السوق، والحصول على خارطة طريق مخصصة لتحقيق أهدافك المهنية باستخدام أحدث تقنيات Gemini.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg"
                className="bg-[#64FFDA] text-[#0A192F] px-10 shadow-lg shadow-[#64FFDA]/20 hover:scale-105"
                onClick={() => navigate(hasAssessment ? '/recommendations' : '/assessment')}
                rightIcon={<ArrowLeft className="w-5 h-5" />}
              >
                {hasAssessment ? 'استعرض توصياتك' : 'ابدأ التقييم الآن'}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-[#64FFDA] text-[#64FFDA] hover:bg-[#64FFDA]/10 px-10 backdrop-blur-sm"
                onClick={() => navigate('/market')}
              >
                استعرض اتجاهات السوق
              </Button>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in zoom-in duration-1000">
            <div className="bg-[#112240] backdrop-blur-xl p-8 rounded-[3rem] border border-[#233554] shadow-2xl rotate-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#64FFDA]/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <LineChart className="text-[#64FFDA]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">نمو المسار</h3>
                  <p className="text-xs text-[#64FFDA] font-medium uppercase tracking-widest">تحليل حي لسوق العمل</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-2 w-full bg-[#0A192F] rounded-full overflow-hidden">
                  <div className="h-full bg-[#64FFDA] w-3/4 rounded-full shadow-[0_0_10px_#64FFDA]"></div>
                </div>
                <div className="h-2 w-1/2 bg-[#0A192F] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-1/2 rounded-full shadow-[0_0_10px_#34d399]"></div>
                </div>
                <div className="h-2 w-3/4 bg-[#0A192F] rounded-full overflow-hidden">
                  <div className="h-full bg-[#64FFDA] w-2/3 rounded-full shadow-[0_0_10px_#64FFDA]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 bg-emerald-500 p-6 rounded-[2rem] shadow-xl -rotate-3 border-4 border-[#0A192F]">
              <div className="flex items-center gap-3">
                <Award className="text-[#0A192F]" />
                <span className="font-bold text-[#0A192F] uppercase tracking-tight">تحليل معتمد</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="flex flex-col items-center justify-center py-12 px-8 rounded-[2.5rem] bg-[#112240] border border-[#233554] shadow-vivid text-center space-y-4 animate-in slide-in-from-bottom duration-500"
          >
            <div className="bg-[#64FFDA]/10 p-4 rounded-full shadow-sm">
              <HelpCircle className="w-10 h-10 text-[#64FFDA]" />
            </div>
            <p className="font-bold text-2xl text-[#64FFDA] tracking-tight">
              Updated Information Text
            </p>
            <p className="text-slate-400 max-w-xl mx-auto">نستخدم أحدث النماذج اللغوية لتحليل بياناتك المهنية وتقديم توصيات مخصصة بنسبة دقة تصل إلى 95%.</p>
          </div>
        </div>
      </section>

      {/* User Status */}
      {hasAssessment && (
        <section className="py-8 bg-[#112240]/50 border-y border-[#233554]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#112240] p-8 rounded-[2.5rem] shadow-sm border border-[#233554] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#64FFDA] rounded-2xl flex items-center justify-center text-[#0A192F] text-2xl font-black shadow-lg">
                  {state.profile.fullName.charAt(0)}
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-1">مرحباً بك مجدداً، {state.profile.fullName}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Trophy size={14} className="text-[#64FFDA]" />
                    المستوى {currentLevel} • {state.points} XP
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/recommendations" className="flex items-center gap-3 px-6 py-3 bg-[#0A192F] hover:bg-[#233554] rounded-2xl transition-all border border-[#233554] group">
                  <Briefcase size={18} className="text-[#64FFDA] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-white">توصياتي</span>
                  <ChevronLeft size={16} className="text-slate-500" />
                </Link>
                <Link to="/profile" className="flex items-center gap-3 px-6 py-3 bg-[#0A192F] hover:bg-[#233554] rounded-2xl transition-all border border-[#233554] group">
                  <LayoutIcon size={18} className="text-[#64FFDA] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm text-white">الملف الشخصي</span>
                  <ChevronLeft size={16} className="text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">لماذا تختار منصة مسار؟</h2>
          <div className="w-24 h-1.5 bg-[#64FFDA] mx-auto rounded-full shadow-[0_0_10px_#64FFDA]"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              icon: Rocket, 
              title: "تحليل ذكي للمهارات", 
              desc: "نستخدم محركات الذكاء الاصطناعي لتحليل مهاراتك الحالية وربطها بالمتطلبات الوظيفية الأكثر طلباً.",
              color: "#64FFDA"
            },
            { 
              icon: Target, 
              title: "توصيات مخصصة", 
              desc: "احصل على مسارات مهنية مقترحة بناءً على شخصيتك وطموحك مع خطوات عملية للتنفيذ.",
              color: "#64FFDA"
            },
            { 
              icon: ShieldCheck, 
              title: "بيانات السوق الحية", 
              desc: "محاكاة واقعية لبيانات سوق العمل، معدلات النمو، والرواتب المتوقعة في كل تخصص.",
              color: "#64FFDA"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-[#112240] p-10 rounded-[2.5rem] border border-[#233554] shadow-vivid hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-right">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#0A192F] bg-[#64FFDA] mb-8 shadow-lg shadow-[#64FFDA]/20">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#112240] to-[#0A192F] rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl border border-[#233554]">
           <div className="absolute top-0 right-0 w-80 h-80 bg-[#64FFDA] opacity-5 rounded-full -mr-40 -mt-40 filter blur-3xl"></div>
           <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">جاهز لخطوتك القادمة؟</h2>
           <p className="text-slate-400 mb-12 text-xl max-w-xl mx-auto">انضم إلى آلاف المستخدمين الذين حددوا مسارهم المهني بنجاح عبر منصتنا المتطورة والمدعومة بـ Gemini.</p>
           <Button 
            size="lg" 
            className="bg-[#64FFDA] text-[#0A192F] rounded-full px-16 py-6 text-xl font-bold shadow-xl shadow-[#64FFDA]/10 hover:scale-105 transition-transform"
            onClick={() => navigate('/assessment')}
           >
             ابدأ الآن مجاناً
           </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
