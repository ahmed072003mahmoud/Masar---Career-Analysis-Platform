
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, ClipboardCheck, TrendingUp, UserCircle, 
  Sparkles, LogOut, MessageSquare, Compass
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import AIChatbot from './AIChatbot';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { state } = useUser();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <LayoutGrid size={22} />, label: 'Dashboard' },
    { path: '/assessment', icon: <Compass size={22} />, label: 'Assessment' },
    { path: '/market', icon: <TrendingUp size={22} />, label: 'Market' },
    { path: '/recommendations', icon: <ClipboardCheck size={22} />, label: 'Strategy' },
    { path: '/profile', icon: <UserCircle size={22} />, label: 'Profile' },
  ];

  return (
    <div className="flex bg-[#02040a] min-h-screen">
      {/* Ultra-Sleek Sidebar */}
      <aside className="fixed inset-y-6 right-6 w-20 neo-glass z-50 flex flex-col items-center py-8 group hover:w-64 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <div className="mb-12 shrink-0">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-xl">
             <div className="w-6 h-6 bg-black rounded-lg transform rotate-45"></div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-4 w-full px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 relative group/link overflow-hidden ${
                isActive(item.path) ? 'text-black bg-lime-400' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="shrink-0 relative z-10">{item.icon}</div>
              <span className={`opacity-0 group-hover:opacity-100 transition-all duration-500 font-black text-[10px] uppercase tracking-widest relative z-10 whitespace-nowrap ${isActive(item.path) ? 'translate-x-0' : 'translate-x-4 group-hover:translate-x-0'}`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-6 w-full px-3">
          <div className="flex flex-col items-center gap-2">
             <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Level {Math.floor(state.points / 100) + 1}</div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-lime-400" style={{ width: `${state.points % 100}%` }}></div>
             </div>
          </div>
          <button className="nav-pill text-slate-600 hover:text-red-400">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Viewport Workspace */}
      <main className="flex-1 main-viewport">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-1000">
          {children}
        </div>
      </main>

      <AIChatbot />
    </div>
  );
};

export default Layout;
