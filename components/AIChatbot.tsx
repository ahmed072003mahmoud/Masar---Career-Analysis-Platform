import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { useUser } from '../context/UserContext';

const AIChatbot: React.FC = () => {
  const { dispatch } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'أهلاً بك! أنا "مُرشد"، دليلك المهني الذكي في منصة مسار. كيف أستطيع توجيهك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    dispatch({ type: 'INCREMENT_AI_INTERACTION' });

    try {
      const response = await chatWithAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، واجهت مشكلة في التفكير. هل يمكنك المحاولة مرة أخرى؟' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[200] font-sans">
      {isOpen ? (
        <div className="bg-[var(--bg-card)] w-[350px] md:w-[420px] h-[600px] rounded-[3rem] shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500 backdrop-blur-xl ring-1 ring-white/10">
          {/* Header */}
          <div className="bg-black bg-opacity-20 p-8 flex flex-row-reverse justify-between items-center border-b border-[var(--border)]">
            <div className="flex flex-row-reverse items-center gap-4">
              <div className="bg-[var(--accent)] p-3 rounded-2xl text-[var(--accent-text)] shadow-lg animate-pulse">
                <Bot size={24} />
              </div>
              <div className="text-right">
                <h3 className="font-black text-lg text-heading">مُرشد مسار</h3>
                <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-widest flex flex-row-reverse items-center gap-2">
                  <Sparkles size={12} />
                  AI Intelligence
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-2xl text-main transition-all">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4 animate-in fade-in duration-300`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-white/10 border-white/10' : 'bg-[var(--accent)] bg-opacity-10 border-[var(--border)]'
                }`}>
                  {msg.role === 'user' ? <User size={18} className="text-heading" /> : <Bot size={18} className="text-[var(--accent)]" />}
                </div>
                <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm leading-relaxed text-right shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--accent)] text-[var(--accent-text)] rounded-tr-none font-bold' 
                    : 'bg-black bg-opacity-20 border border-[var(--border)] text-heading rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] bg-opacity-10 border border-[var(--border)] flex items-center justify-center">
                  <Bot size={18} className="text-[var(--accent)]" />
                </div>
                <div className="bg-black bg-opacity-20 border border-[var(--border)] p-5 rounded-3xl rounded-tl-none flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                  <span className="text-xs text-[var(--accent)] font-black italic">جاري التفكير...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-black bg-opacity-10 border-t border-[var(--border)] flex flex-row-reverse gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-black bg-opacity-20 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[var(--accent)] text-heading text-right transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[var(--accent)] text-[var(--accent-text)] p-4 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-xl shadow-[var(--accent)]/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[var(--accent)] text-[var(--accent-text)] px-8 py-5 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all flex flex-row-reverse items-center gap-4 font-black border border-[var(--accent)] border-opacity-30 group relative"
        >
          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
          
          <span className="relative z-10">استشر مُرشد</span>
          <div className="relative z-10 bg-black bg-opacity-10 p-2.5 rounded-full">
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
          </div>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;