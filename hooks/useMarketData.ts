
import { useState, useEffect, useCallback } from 'react';

export interface MarketTrendReport {
  timestamp: number;
  skills: { name: string; demand: number }[];
  growth: { name: string; growth: number }[];
  salaries: { name: string; min: number; max: number }[];
  distribution: { name: string; value: number }[];
}

const CACHE_KEY = 'masar_market_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const useMarketData = () => {
  const [data, setData] = useState<MarketTrendReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);

  const fetchMarketData = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setData(parsed);
            setIsCached(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { generateFullMarketReport } = await import('../backend/services/marketSimulator.js');
      const report = generateFullMarketReport();
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(report));
      setData(report);
      setIsCached(false);
    } catch (err: any) {
      console.error("Market Data Fetch Error:", err);
      let errorMsg = 'عذراً، تعذر تحديث بيانات السوق حالياً. يرجى المحاولة لاحقاً.';
      
      if (!navigator.onLine) {
        errorMsg = 'لا يوجد اتصال بالإنترنت. يرجى التحقق من الشبكة وإعادة المحاولة.';
      } else if (err.status === 429) {
        errorMsg = 'تم تجاوز عدد الطلبات المسموح به. يرجى الانتظار قليلاً.';
      } else if (err.status >= 500) {
        errorMsg = 'هناك مشكلة في خوادمنا حالياً. فريقنا يعمل على حلها.';
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return { data, loading, error, isCached, refresh: () => fetchMarketData(true) };
};
