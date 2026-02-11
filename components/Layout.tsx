import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, Layout as LayoutIcon, ClipboardList, Briefcase, User, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { calculateLevel } from '../utils/pointsCalculator';
import AIChatbot from './AIChatbot';

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useUser();
  const currentLevel = calculateLevel(state.points);

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: <LayoutIcon size={18} /> },
    { path: '/assessment', label: 'التقييم', icon: <ClipboardList size={18} /> },
    { path: '/market', label: 'السوق', icon: <TrendingUp size={18} /> },
    { path: '/recommendations', label: 'التوصيات', icon: <Briefcase size={18} /> },
    { path: '/profile', label: 'حسابي', icon: <User size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-6 z-[150] mx-auto max-w-7xl w-[calc(100%-3rem)] rounded-full glass-panel px-8 h-20 flex justify-between items-center shadow-2xl border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2.5 rounded-2xl group-hover:rotate-[20deg] transition-all duration-500">
            <Sparkles className="text-teal-400 w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">Masar</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-white text-black shadow-xl'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-white/5">
            <div className="text-right">
              <span className="text-[8px] text-teal-400 font-black block leading-none mb-1 uppercase tracking-widest">Global Rank</span>
              <span className="text-sm font-black text-white leading-none">Lv {currentLevel}</span>
            </div>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <AIChatbot />

      <footer className="mt-32 border-t border-white/5 bg-black/40 backdrop-blur-3xl py-24 relative overflow-hidden">
        <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="md:col-span-2 text-right">
            <span className="text-3xl font-black text-white tracking-tighter uppercase block mb-6">Masar AI</span>
            <p className="text-slate-400 leading-relaxed text-lg max-w-md ml-auto">
              تجاوز حدود المألوف. نحن نجمع بين قوة البيانات وضمانات المستقبل لنرسم مساراً مهنياً يليق بطموحاتك في عصر الذكاء الاصطناعي.
            </p>
          </div>
          <div className="flex flex-col gap-6 text-right">
             <h4 className="font-black text-white uppercase tracking-widest text-[10px]">Navigation</h4>
             {navItems.map(i => (
                <Link key={i.path} to={i.path} className="text-slate-500 hover:text-teal-400 transition-colors font-bold text-sm">{i.label}</Link>
             ))}
          </div>
          <div className="text-right">
             <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Connect</h4>
             <div className="flex justify-end gap-4">
               {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400 transition-colors cursor-pointer"></div>)}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;