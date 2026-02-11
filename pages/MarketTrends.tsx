
import React, { useEffect, useState } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { SkillsChart, SalariesChart, GrowthChart, GeoChart } from '../components/MarketCharts';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { RefreshCw, TrendingUp, HelpCircle, MapPin, DollarSign, Target, Database, Newspaper, ExternalLink, Sparkles, Info } from 'lucide-react';
import { getLiveMarketNews } from '../services/geminiService';

const ChartSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-[#233554] rounded-lg"></div>
      <div className="w-40 h-6 bg-[#233554] rounded"></div>
    </div>
    <div className="h-[250px] w-full bg-[#0A192F] rounded-2xl border border-[#233554] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#233554]/20 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
      <div className="flex items-end justify-around h-full p-4 gap-2">
        {[40, 70, 50, 90, 60].map((h, i) => (
          <div key={i} className="bg-[#233554] rounded-t-lg w-full" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  </div>
);

const MarketTrends: React.FC = () => {
  const { data, loading, error, isCached, refresh } = useMarketData();
  const { dispatch } = useUser();
  const [liveNews, setLiveNews] = useState<{text: string, sources: any[] | null}>( {text: '', sources: null});
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: 'INCREMENT_MARKET_VISITS' });
    dispatch({ type: 'ADD_POINTS', amount: 5 });
    fetchNews('الذكاء الاصطناعي والتقنية');
  }, [dispatch]);

  const fetchNews = async (sector: string) => {
    setIsNewsLoading(true);
    try {
      const news = await getLiveMarketNews(sector);
      setLiveNews(news);
    } catch (err) {
      console.error(err);
    } finally {
      setIsNewsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-[#112240] p-10 rounded-[3rem] border border-red-900/30 max-w-md mx-auto">
          <div className="bg-red-500 text-[#0A192F] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p className="text-white font-bold mb-6 text-xl">{error}</p>
          <Button variant="primary" className="bg-[#64FFDA] text-[#0A192F]" onClick={refresh}>إعادة المحاولة الآن</Button>
        </div>
      </div>
    );
  }

  const lastUpdated = data ? new Date(data.timestamp).toLocaleTimeString('ar-SA') : '';

  return (
    <div className="container-custom py-12">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(-20deg); }
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">تحليل السوق اللحظي</h1>
          <div className="flex items-center gap-3">
            <p className="text-slate-400 flex items-center gap-2">
              بيانات دقيقة حول مهارات المستقبل وتوزيع الفرص الوظيفية
            </p>
            {isCached && (
              <span className="flex items-center gap-1 text-[10px] bg-[#64FFDA]/10 text-[#64FFDA] px-2 py-0.5 rounded-full font-bold border border-[#64FFDA]/20 animate-in fade-in zoom-in">
                <Database size={10} />
                بيانات مؤرشفة
              </span>
            )}
            <div className="group relative cursor-help">
              <Info size={14} className="text-slate-500" />
              <div className="absolute bottom-full mb-2 right-0 w-48 bg-[#112240] text-xs p-3 rounded-xl border border-[#233554] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-white">
                تعتمد هذه البيانات على محاكاة واقعية لمتطلبات سوق العمل الحالي وتوقعات النمو المستقبلي.
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button 
            variant="secondary" 
            onClick={refresh} 
            isLoading={loading}
            className="bg-[#64FFDA] text-[#0A192F]"
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            تحديث البيانات
          </Button>
          {data && (
            <span className="text-xs text-slate-500 font-medium">آخر تحديث: {lastUpdated}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section className="bg-[#112240] p-6 md:p-8 rounded-3xl shadow-sm border border-[#233554]">
          {loading && !data ? <ChartSkeleton /> : data && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#64FFDA]/10 p-2 rounded-lg text-[#64FFDA]">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-white text-right">أكثر المهارات طلباً</h3>
                <div className="group relative mr-auto">
                  <HelpCircle size={16} className="text-slate-600 cursor-help" />
                  <div className="absolute bottom-full mb-2 left-0 w-40 bg-[#0A192F] text-[10px] p-2 rounded-lg border border-[#233554] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                    يمثل هذا الرسم البياني نسبة تواجد المهارة في إعلانات الوظائف الحالية.
                  </div>
                </div>
              </div>
              <SkillsChart data={data.skills} />
            </>
          )}
        </section>

        <section className="bg-[#112240] p-6 md:p-8 rounded-3xl shadow-sm border border-[#233554]">
          {loading && !data ? <ChartSkeleton /> : data && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#64FFDA]/10 p-2 rounded-lg text-[#64FFDA]">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-xl font-bold text-white text-right">نطاقات الرواتب (ريال)</h3>
                <div className="group relative mr-auto">
                  <HelpCircle size={16} className="text-slate-600 cursor-help" />
                  <div className="absolute bottom-full mb-2 left-0 w-40 bg-[#0A192F] text-[10px] p-2 rounded-lg border border-[#233554] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                    يوضح الحد الأدنى والأقصى للرواتب الشهرية المتوقعة لكل مسمى وظيفي.
                  </div>
                </div>
              </div>
              <SalariesChart data={data.salaries} />
            </>
          )}
        </section>
      </div>

      <section className="bg-[#112240] p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-[#233554] mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#64FFDA]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#64FFDA]/10 p-3 rounded-2xl text-[#64FFDA]">
              <Newspaper size={24} />
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-white">رادار الأخبار المهنية (Live)</h3>
              <p className="text-sm text-slate-400">بحث حي عبر Google Search لتقديم أحدث المعلومات</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['التقنية', 'المالية', 'الرعاية الصحية', 'الهندسة'].map(cat => (
              <button 
                key={cat} 
                onClick={() => fetchNews(cat)}
                className="px-4 py-1.5 rounded-full bg-[#0A192F] text-xs font-bold text-slate-400 hover:bg-[#64FFDA] hover:text-[#0A192F] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isNewsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <div className="relative">
                <RefreshCw size={40} className="animate-spin text-[#64FFDA]" />
                <Sparkles size={16} className="absolute -top-1 -right-1 text-[#64FFDA] animate-pulse" />
             </div>
             <p className="text-sm font-bold text-slate-500 italic text-right">Gemini يبحث في الويب عن أحدث المستجدات...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-[#0A192F]/50 p-6 rounded-3xl text-sm leading-relaxed text-slate-300 whitespace-pre-wrap border border-[#233554] text-right">
              {liveNews.text || 'اختر قطاعاً لاستعراض آخر الأخبار والمستجدات.'}
            </div>
            
            {liveNews.sources && liveNews.sources.length > 0 && (
              <div className="pt-6 border-t border-[#233554]">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-right">المصادر المرجعية:</h4>
                <div className="flex flex-wrap gap-4 justify-end">
                   {liveNews.sources.map((source: any, i: number) => (
                     <a key={i} href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#0A192F] px-3 py-1.5 rounded-lg border border-[#233554] text-[10px] font-bold text-[#64FFDA] hover:border-[#64FFDA] transition-all">
                       <ExternalLink size={12} />
                       {source.web?.title || 'مصدر خارجي'}
                     </a>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#112240] p-6 md:p-8 rounded-3xl shadow-sm border border-[#233554]">
          {loading && !data ? <ChartSkeleton /> : data && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#10B981]/10 p-2 rounded-lg text-[#10B981]">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-bold text-white text-right">مجالات النمو المتسارع</h3>
                <div className="group relative mr-auto">
                  <HelpCircle size={16} className="text-slate-600 cursor-help" />
                  <div className="absolute bottom-full mb-2 left-0 w-40 bg-[#0A192F] text-[10px] p-2 rounded-lg border border-[#233554] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                    يوضح النسبة المئوية للنمو السنوي المتوقع في التوظيف لهذا المجال.
                  </div>
                </div>
              </div>
              <GrowthChart data={data.growth} />
            </>
          )}
        </section>

        <section className="bg-[#112240] p-6 md:p-8 rounded-3xl shadow-sm border border-[#233554]">
          {loading && !data ? <ChartSkeleton /> : data && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-slate-700/30 p-2 rounded-lg text-slate-300">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-bold text-white text-right">التوزيع الجغرافي للفرص</h3>
                <div className="group relative mr-auto">
                  <HelpCircle size={16} className="text-slate-600 cursor-help" />
                  <div className="absolute bottom-full mb-2 left-0 w-40 bg-[#0A192F] text-[10px] p-2 rounded-lg border border-[#233554] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                    تركيز الوظائف المتاحة في المدن الرئيسية بالمملكة.
                  </div>
                </div>
              </div>
              <GeoChart data={data.distribution} />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MarketTrends;
