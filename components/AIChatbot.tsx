
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { useUser } from '../context/UserContext';

const AIChatbot: React.FC = () => {
  const { dispatch } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'مرحباً بك في مسار! أنا مستشارك المهني الذكي، كيف يمكنني مساعدتك اليوم؟' }
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
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ فني.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {isOpen ? (
        <div className="bg-[#112240] w-[350px] md:w-[400px] h-[550px] rounded-[2.5rem] shadow-vivid border border-[#233554] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300 ring-1 ring-[#64FFDA]/10">
          <div className="bg-[#0A192F] p-6 flex flex-row-reverse justify-between items-center text-white border-b border-[#233554]">
            <div className="flex flex-row-reverse items-center gap-3">
              <div className="bg-[#64FFDA]/10 p-2 rounded-xl text-[#64FFDA] border border-[#64FFDA]/20">
                <Bot size={20} />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-sm">مستشار مسار الذكي</h3>
                <p className="text-[10px] text-slate-500 flex flex-row-reverse items-center gap-1">
                  مدعوم بـ Gemini 3 Pro
                  <Sparkles size={10} className="text-[#64FFDA]" />
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/5 p-1.5 rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0A192F]/80 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-[#233554] border-[#112240]' : 'bg-[#64FFDA]/10 border-[#64FFDA]/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="text-slate-300" /> : <Bot size={14} className="text-[#64FFDA]" />}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed text-right ${
                  msg.role === 'user' 
                    ? 'bg-[#64FFDA] text-[#0A192F] rounded-tr-none font-bold' 
                    : 'bg-[#112240] border border-[#233554] text-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-[#64FFDA]" />
                </div>
                <div className="bg-[#112240] border border-[#233554] p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#64FFDA]" />
                  <span className="text-xs text-[#64FFDA] font-medium italic">جاري التفكير...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#112240] border-t border-[#233554] flex flex-row-reverse gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل عن مسارك المهني..."
              className="flex-1 bg-[#0A192F] border border-[#233554] rounded-2xl px-5 py-3 text-sm outline-none focus:border-[#64FFDA] text-white text-right transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#64FFDA] text-[#0A192F] p-3 rounded-2xl hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-[#64FFDA]/10"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#64FFDA] text-[#0A192F] px-6 py-4 rounded-full shadow-vivid hover:scale-105 transition-all flex flex-row-reverse items-center gap-4 font-black border border-[#64FFDA]/20 ring-4 ring-[#64FFDA]/5"
        >
          <span>استشر الذكاء الاصطناعي</span>
          <div className="bg-[#0A192F] text-[#64FFDA] p-2 rounded-full shadow-inner">
            <MessageSquare size={22} />
          </div>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
