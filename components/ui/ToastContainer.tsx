
import React from 'react';
import { useUser } from '../../context/UserContext';
import { X, Sparkles, Trophy, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useUser();

  if (state.toasts.length === 0) return null;

  const handleRemove = (id: string) => {
    dispatch({ type: 'START_REMOVE_TOAST', id });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id });
    }, 500);
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
      {state.toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`bg-brand-dark/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-3xl flex items-center justify-between pointer-events-auto ring-1 ring-white/5 transition-all ${
            toast.isRemoving ? 'animate-toast-out' : 'animate-in slide-in-from-top-4 duration-300'
          }`}
        >
          <div className="flex items-center gap-4 flex-row-reverse text-right">
            <div className={`p-3 rounded-2xl ${toast.type === 'success' ? 'bg-violet-500/20 text-violet-400' : 'bg-teal-500/20 text-teal-400'}`}>
              {toast.type === 'success' ? <Trophy size={20} /> : <Info size={20} />}
            </div>
            <div>
              <p className="text-white font-black text-sm">{toast.message}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {toast.type === 'success' ? 'إنجاز مهني' : 'تحديث النظام'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleRemove(toast.id)}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
