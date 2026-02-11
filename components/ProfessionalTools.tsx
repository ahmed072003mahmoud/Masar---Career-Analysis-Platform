
import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, FileSearch, Sparkles, Upload, Download, Loader2, CheckCircle, Search } from 'lucide-react';
import { generateProfessionalAsset, analyzeProfessionalImage } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import Button from './ui/Button';

const SUGGESTIONS = [
  "تطوير الويب", "تحليل البيانات", "إدارة المشاريع", "الأمن السيبراني", 
  "الذكاء الاصطناعي", "تصميم الواجهات", "الحوسبة السحابية", "التسويق الرقمي",
  "React", "Node.js", "Python", "SQL", "Figma", "AWS", "Git"
];

const ProfessionalTools: React.FC = () => {
  const { dispatch } = useUser();
  const [activeTab, setActiveTab] = useState<'gen' | 'analyze'>('gen');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState('');

  const filteredSuggestions = useMemo(() => {
    if (!keyword) return [];
    return SUGGESTIONS.filter(s => s.toLowerCase().includes(keyword.toLowerCase()));
  }, [keyword]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    dispatch({ type: 'INCREMENT_AI_INTERACTION' });
    try {
      const img = await generateProfessionalAsset(prompt, size);
      setGeneratedImg(img);
    } catch (err) {
      alert("فشل توليد الصورة");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    dispatch({ type: 'INCREMENT_AI_INTERACTION' });
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeProfessionalImage(base64, file.type);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#112240] rounded-[2.5rem] shadow-sm border border-[#233554] overflow-hidden">
      <div className="flex border-b border-[#233554]">
        <button 
          onClick={() => setActiveTab('gen')}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'gen' 
              ? 'bg-[#64FFDA] text-[#0A192F]' 
              : 'text-[#A8B2D1] hover:bg-[#233554]'
          }`}
        >
          <ImageIcon size={18} />
          توليد صور احترافية
        </button>
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'analyze' 
              ? 'bg-[#64FFDA] text-[#0A192F]' 
              : 'text-[#A8B2D1] hover:bg-[#233554]'
          }`}
        >
          <FileSearch size={18} />
          تحليل السيرة الذاتية
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'gen' ? (
          <div className="space-y-6">
            <div className="text-right">
              <h4 className="font-bold text-white mb-2">أنشئ خلفيات أو صور رمزية مهنية</h4>
              <p className="text-xs text-slate-400">استخدم Gemini 3 Pro Image لتصميم أصول رقمية لمسارك المهني</p>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اسأل عن مسارك المهني..."
              className="w-full bg-[#0A192F] border border-[#233554] rounded-2xl p-4 text-sm outline-none focus:border-[#64FFDA] text-white h-24 text-right"
            />

            <div className="flex flex-row-reverse items-center justify-between">
              <div className="flex gap-2">
                {(["1K", "2K", "4K"] as const).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(s)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${size === s ? 'bg-[#64FFDA] border-[#64FFDA] text-[#0A192F]' : 'bg-[#0A192F] border-[#233554] text-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                variant="secondary" 
                size="sm"
                className="bg-[#64FFDA] text-[#0A192F]"
                leftIcon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              >
                {isGenerating ? 'جاري التوليد...' : 'توليد الصورة'}
              </Button>
            </div>

            {generatedImg && (
              <div className="mt-6 animate-in zoom-in-95 duration-500">
                <img src={generatedImg} alt="Generated Asset" className="w-full h-64 object-cover rounded-3xl border border-[#233554] shadow-md" />
                <a href={generatedImg} download="masar-asset.png" className="mt-4 flex items-center justify-center gap-2 text-[#64FFDA] font-bold text-xs hover:underline">
                  <Download size={14} />
                  تحميل الصورة بدقة {size}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-right">
             <div className="mb-6">
              <h4 className="font-bold text-white mb-2">تحليل المهارات التلقائي</h4>
              <p className="text-xs text-slate-400">ابحث عن المهارات الشائعة أو ارفع وثيقة للتحليل</p>
            </div>

            <div className="relative mb-6">
              <div className="relative group">
                <input 
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="ابحث عن مهارة (مثلاً: React)..."
                  className="w-full bg-[#0A192F] border border-[#233554] rounded-2xl p-4 pr-12 text-sm text-white focus:border-[#64FFDA] outline-none text-right transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              </div>
              {filteredSuggestions.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-[#112240] border border-[#233554] rounded-2xl shadow-xl max-h-40 overflow-y-auto no-scrollbar">
                  {filteredSuggestions.map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setKeyword(s); setKeyword(''); }}
                      className="w-full text-right p-3 text-sm text-slate-300 hover:bg-[#233554] hover:text-[#64FFDA] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative border-2 border-dashed border-[#233554] rounded-[2rem] p-10 flex flex-col items-center justify-center transition-colors hover:border-[#64FFDA] group bg-[#0A192F]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="bg-[#233554] p-4 rounded-2xl mb-4 group-hover:bg-[#64FFDA]/10 transition-colors">
                <Upload size={32} className="text-slate-400 group-hover:text-[#64FFDA]" />
              </div>
              <p className="text-sm font-bold text-slate-300">انقر أو اسحب السيرة الذاتية هنا</p>
              <p className="text-[10px] text-slate-500 mt-1">يدعم ملفات الصور (PNG, JPG)</p>
            </div>

            {isAnalyzing && (
              <div className="flex items-center justify-center gap-3 py-10">
                <Loader2 className="animate-spin text-[#64FFDA]" />
                <span className="text-sm font-bold text-slate-200">Gemini يحلل بياناتك الآن...</span>
              </div>
            )}

            {analysisResult && (
              <div className="bg-[#0A192F] p-6 rounded-3xl border border-[#233554] animate-in slide-in-from-top-4">
                <div className="flex items-center gap-2 mb-4 text-[#64FFDA]">
                  <CheckCircle size={18} />
                  <span className="font-bold text-sm">تم التحليل بنجاح</span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTools;
