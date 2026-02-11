
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, Layout as LayoutIcon, ClipboardList, Briefcase, User, Trophy, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { calculateLevel } from '../utils/pointsCalculator';
import AIChatbot from './AIChatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state, dispatch } = useUser();
  const currentLevel = calculateLevel(state.points);

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: <LayoutIcon className="w-5 h-5" /> },
    { path: '/assessment', label: 'التقييم المهني', icon: <ClipboardList className="w-5 h-5" /> },
    { path: '/market', label: 'اتجاهات السوق', icon: <TrendingUp className="w-5 h-5" /> },
    { path: '/recommendations', label: 'التوصيات', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/gamification', label: 'الإنجازات', icon: <Trophy className="w-5 h-5" /> },
    { path: '/profile', label: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A192F] text-slate-100 overflow-x-hidden">
      {/* Toast Notifications */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 w-full max-w-sm pointer-events-none">
        {state.toasts.map(toast => (
          <div 
            key={toast.id} 
            className="pointer-events-auto bg-[#112240] border border-[#64FFDA]/30 shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-10 duration-500"
            onAnimationEnd={() => setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id: toast.id }), 3000)}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toast.type === 'success' ? 'bg-[#64FFDA]/10 text-[#64FFDA]' : 'bg-blue-500/10 text-blue-400'}`}>
              <CheckCircle size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{toast.message}</p>
              <p className="text-[10px] text-[#64FFDA] font-black uppercase tracking-widest">تحديث مسار</p>
            </div>
            <button onClick={() => dispatch({ type: 'REMOVE_TOAST', id: toast.id })} className="text-slate-500 hover:text-white mr-2 p-1">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <header className="bg-[#0A192F]/80 backdrop-blur-md border-b border-[#233554] sticky top-0 z-[150] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-[#64FFDA] p-2 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#64FFDA]/20">
                <TrendingUp className="text-[#0A192F] w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">مسار</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#64FFDA]/10 text-[#64FFDA]'
                      : 'text-slate-400 hover:text-[#64FFDA]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4 border-r border-[#233554] pr-6 mr-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#64FFDA] font-black uppercase tracking-widest leading-none mb-1">Level {currentLevel}</span>
                <span className="text-sm font-black text-white leading-none tracking-tight">{state.points} XP</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#64FFDA]/10 flex items-center justify-center border border-[#64FFDA]/20 shadow-md">
                <Trophy size={20} className="text-[#64FFDA]" />
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-xl text-[#64FFDA]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#112240] border-t border-[#233554] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-3 pt-3 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-lg ${
                    isActive(item.path) ? 'bg-[#64FFDA] text-[#0A192F]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <AIChatbot />

      <footer className="bg-[#020C1B] border-t border-[#233554] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6 text-right">
              <div className="flex items-center gap-3">
                <div className="bg-[#64FFDA] p-2 rounded-xl">
                  <TrendingUp className="text-[#0A192F] w-8 h-8" />
                </div>
                <span className="text-3xl font-black text-white">مسار</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                منصة متطورة لتحليل المسارات المهنية باستخدام الذكاء الاصطناعي، تهدف لتمكين الأفراد من اتخاذ قرارات مهنية مبنية على البيانات والتحليل العميق لسوق العمل.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 text-right">
              <h4 className="font-bold text-xl text-[#64FFDA] mb-2">روابط سريعة</h4>
              {navItems.map(item => (
                <Link key={item.path} to={item.path} className="text-slate-400 hover:text-[#64FFDA] font-bold transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4 text-right">
              <h4 className="font-bold text-xl text-[#64FFDA] mb-2">تواصل معنا</h4>
              <p className="text-slate-400 font-bold hover:text-white cursor-pointer transition-colors">support@masar.ai</p>
              <p className="text-slate-500 text-sm">المملكة العربية السعودية، الرياض</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#233554] text-center flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm font-medium">جميع الحقوق محفوظة منصة مسار 2025</p>
            <div className="flex gap-8 text-xs font-bold text-[#64FFDA]">
               <span className="cursor-pointer hover:underline">سياسة الخصوصية</span>
               <span className="cursor-pointer hover:underline">شروط الاستخدام</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
