
import React, { useEffect, useState } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { SkillsChart, SalariesChart, GrowthChart, GeoChart } from '../components/MarketCharts';
import Button from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { RefreshCw, TrendingUp, HelpCircle, MapPin, DollarSign, Target, Database, Newspaper, ExternalLink, Sparkles, Info, AlertCircle, Clock } from 'lucide-react';
import { getLiveMarketNews } from '../services/geminiService';

const MarketTrendsSkeleton = () => (
  <div className="container-custom py-12 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
      <div className="space-y-4 w-full md:w-1/3">
        <div className="h-10 bg-white/5 rounded-2xl w-3/4"></div>
        <div className="h-4 bg-white/5 rounded-full w-full"></div>
      </div>
      <div className="h-12 bg-white/5 rounded-2xl w-32"></div>
    </div>

    {/* Bento Grid Charts Skeletons */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
      <div className="md:col-span-8 bento-card p-10 h-[400px] flex flex-col gap-6">
        <div className="flex justify-between items-center flex-row-reverse">
          <div className="h-6 bg-white/5 rounded-lg w-32"></div>
          <div className="h-4 bg-white/5 rounded-full w-4"></div>
        </div>
        <div className="flex-1 bg-white/5 rounded-3xl"></div>
      </div>
      <div className="md:col-span-4 bento-card p-10 h-[400px] flex flex-col items-center justify-center gap-6">
        <div className="h-20 w-20 bg-white/5 rounded-3xl"></div>
        <div className="h-6 bg-white/5 rounded-lg w-32"></div>
        <div className="h-40 w-40 bg-white/5 rounded-full"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
      <div className="md:col-span-4 bento-card p-10 h-[400px] flex flex-col gap-6">
        <div className="h-6 bg-white/5 rounded-lg w-32 self-end"></div>
        <div className="flex-1 bg-white/5 rounded-3xl"></div>
      </div>
      <div className="md:col-span-8 bento-card p-10 h-[400px] flex flex-col gap-6">
        <div className="flex justify-between items-center flex-row-reverse">
          <div className="h-6 bg-white/5 rounded-lg w-32"></div>
          <div className="h-4 bg-white/5 rounded-full w-4"></div>
        </div>
        <div className="flex-1 bg-white/5 rounded-3xl"></div>
      </div>
    </div>

    {/* News Section Skeleton */}
    <div className="bento-card p-10 h-[300px] bg-white/5"></div>
  </div>
);

const MarketTrends: React.FC = () => {
  const { data, loading, error, refresh } = useMarketData();
  const { dispatch } = useUser();
  const [liveNews, setLiveNews] = useState<{text: string, sources: any[] | null}>( {text: '', sources: null});
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: 'INCREMENT_MARKET_VISITS' });
    dispatch({ type: 'ADD_POINTS', amount: 5 });
    if (!loading && data) {
      fetchNews('الذكاء الاصطناعي والتقنية');
    }
  }, [dispatch, loading, !!data]);

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

  if (loading && !data) {
    return <MarketTrendsSkeleton />;
  }

  if (error) {
    return (
      <div className="container-custom py-24 text-center">
        <div className="max-w-md mx-auto bento-card p-12 border-red-500/20">
          <div className="bg-red-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
          <Button onClick={refresh} leftIcon={<RefreshCw size={16} />}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  const lastUpdated = data ? new Date(data.timestamp).toLocaleTimeString('ar-SA') : '';

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
        <div className="text-right">
          <h1 className="text-4xl font-black mb-2 text-white tracking-tighter">رادار سوق العمل</h1>
          <p className="text-neutral-400 font-medium">تحليل إحصائي وتوقعات النمو للقطاعات الواعدة في 2025</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Button 
            variant="outline" 
            onClick={refresh} 
            isLoading={loading}
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            تحديث البيانات
          </Button>
          {data && (
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-black uppercase tracking-widest">
              <Clock size={12} />
              آخر تحديث: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* Bento Grid Charts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-8 bento-card p-10">
          <div className="flex items-center justify-between mb-10 flex-row-reverse">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--accent)] bg-opacity-10 p-2 rounded-xl text-[var(--accent)]">
                <Target size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">المهارات الأكثر طلباً</h3>
            </div>
            <div className="group relative cursor-help">
              <HelpCircle size={16} className="text-neutral-600" />
              <div className="absolute bottom-full mb-3 left-0 w-48 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 text-[10px] text-neutral-400 font-bold pointer-events-none">
                يمثل هذا الرسم البياني المهارات التي تظهر بشكل متكرر في إعلانات التوظيف النشطة حالياً.
              </div>
            </div>
          </div>
          <SkillsChart data={data?.skills || []} />
        </div>

        <div className="md:col-span-4 bento-card p-10 bg-neutral-900/50">
           <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="bg-[var(--accent)] bg-opacity-10 p-4 rounded-3xl mb-6">
               <MapPin size={32} className="text-[var(--accent)]" />
             </div>
             <h3 className="text-xl font-bold mb-4">التوزيع الجغرافي</h3>
             <GeoChart data={data?.distribution || []} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-4 bento-card p-10">
           <div className="flex items-center gap-3 mb-8 flex-row-reverse">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-bold">مجالات النمو</h3>
           </div>
           <GrowthChart data={data?.growth || []} />
        </div>

        <div className="md:col-span-8 bento-card p-10">
           <div className="flex items-center justify-between mb-8 flex-row-reverse">
             <div className="flex items-center gap-3">
               <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                 <DollarSign size={20} />
               </div>
               <h3 className="text-xl font-bold">توقعات الرواتب</h3>
             </div>
             <div className="group relative cursor-help">
                <HelpCircle size={16} className="text-neutral-600" />
                <div className="absolute bottom-full mb-3 left-0 w-48 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-20 text-[10px] text-neutral-400 font-bold pointer-events-none">
                  نطاق الرواتب الشهرية المتوقع (بالريال السعودي) للمسميات الوظيفية الأكثر طلباً.
                </div>
              </div>
           </div>
           <SalariesChart data={data?.salaries || []} />
        </div>
      </div>

      {/* Live News Bento Section with Search Grounding Display */}
      <div className="bento-card p-10 bg-[var(--accent)] text-[var(--accent-text)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-8 mb-10">
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end mb-2">
                <Sparkles size={20} />
                <h2 className="text-2xl font-black">أخبار السوق الذكية</h2>
              </div>
              <p className="font-bold opacity-60">تغطية حية لأحدث التوجهات عبر Gemini AI</p>
            </div>
            <div className="flex flex-wrap flex-row-reverse gap-2">
              {['التقنية', 'المالية', 'الهندسة'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => fetchNews(cat)}
                  className="px-6 py-2 rounded-full bg-black/10 text-xs font-black hover:bg-black/20 transition-all border border-black/5"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/10 p-8 rounded-[2rem] border border-black/5 min-h-[200px] flex items-center justify-center">
            {isNewsLoading ? (
              <div className="flex flex-col items-center gap-4">
                 <RefreshCw size={32} className="animate-spin" />
                 <p className="text-sm font-black italic">جاري البحث في المصادر العالمية...</p>
              </div>
            ) : (
              <div className="w-full space-y-8">
                <div className="text-right leading-relaxed font-bold text-lg whitespace-pre-wrap">
                  {liveNews.text || 'اختر قطاعاً لاستعراض آخر الأخبار والمستجدات المهنية.'}
                </div>
                
                {/* Mandatory display of grounding source URLs */}
                {liveNews.sources && liveNews.sources.length > 0 && (
                  <div className="border-t border-black/10 pt-6 mt-6">
                    <h4 className="text-[10px] font-black mb-4 flex items-center justify-end gap-2 opacity-60 uppercase tracking-widest">
                      المصادر والمراجع الموثوقة
                      <ExternalLink size={14} />
                    </h4>
                    <div className="flex flex-wrap flex-row-reverse gap-2">
                      {liveNews.sources.map((chunk, idx) => chunk.web && (
                        <a 
                          key={idx} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-bold flex items-center gap-2 transition-all border border-black/10 group"
                        >
                          <span className="max-w-[150px] truncate">{chunk.web.title || 'رابط المصدر'}</span>
                          <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
