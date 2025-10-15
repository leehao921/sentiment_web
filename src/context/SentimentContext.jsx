import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sentimentAPI } from '../services/api';

const SentimentContext = createContext();

export const useSentiment = () => {
  const context = useContext(SentimentContext);
  if (!context) {
    throw new Error('useSentiment must be used within a SentimentProvider');
  }
  return context;
};

export const SentimentProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('正在載入資料...');
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchSentimentData = useCallback(async (forceRefresh = false) => {
    // Check cache
    if (!forceRefresh && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
      console.log('Using cached sentiment data');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingMessage('正在從雲端儲存空間載入資料... (這可能需要 10-20 秒)');

    try {
      // Fetch both sentiment data and analytics
      setLoadingMessage('正在處理情感分析資料...');
      const [sentimentResponse, analyticsResponse] = await Promise.all([
        sentimentAPI.getAll(),
        sentimentAPI.getAnalytics()
      ]);

      setData(sentimentResponse.data.data || []);
      setAnalytics(analyticsResponse.data || null);
      setLastFetch(Date.now());

      // Cache to localStorage
      try {
        localStorage.setItem('sentimentData', JSON.stringify({
          data: sentimentResponse.data.data,
          analytics: analyticsResponse.data,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to cache data to localStorage:', e);
      }

    } catch (err) {
      console.error('Error fetching sentiment data:', err);
      setError(err.message || 'Failed to fetch sentiment data');

      // Try to load from localStorage cache
      try {
        const cached = localStorage.getItem('sentimentData');
        if (cached) {
          const parsed = JSON.parse(cached);
          setData(parsed.data || []);
          setAnalytics(parsed.analytics || null);
          console.log('Loaded data from localStorage cache');
        }
      } catch (e) {
        console.warn('Failed to load cached data:', e);
      }
    } finally {
      setLoading(false);
    }
  }, [lastFetch]);

  // Fetch data on mount
  useEffect(() => {
    fetchSentimentData();
  }, [fetchSentimentData]);

  // Process data for visualizations
  const getProcessedData = useCallback(() => {
    if (!data || data.length === 0) {
      return {
        pieData: { positive: 0, negative: 0, neutral: 0 },
        timelineData: [],
        heatmapData: [],
        wordCloudData: [],
        metricsData: {
          positive: 0,
          negative: 0,
          neutral: 0,
          averageScore: 0
        }
      };
    }

    // Count sentiments for pie chart
    const sentimentCounts = data.reduce((acc, item) => {
      const sentiment = item.sentiment?.toLowerCase() || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const pieData = {
      positive: sentimentCounts.positive || 0,
      negative: sentimentCounts.negative || 0,
      neutral: sentimentCounts.neutral || 0
    };

    // Group by date for timeline
    const dateGroups = data.reduce((acc, item) => {
      if (!item.timestamp) return acc;

      const date = new Date(item.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { positive: 0, negative: 0, neutral: 0 };
      }
      const sentiment = item.sentiment?.toLowerCase() || 'neutral';
      acc[date][sentiment] += 1;
      return acc;
    }, {});

    const timelineData = Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days

    // Extract words for word cloud
    const wordFreq = {};
    data.forEach(item => {
      if (item.keywords && Array.isArray(item.keywords)) {
        item.keywords.forEach(keyword => {
          wordFreq[keyword] = (wordFreq[keyword] || 0) + 1;
        });
      }
    });

    const wordCloudData = Object.entries(wordFreq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // Top 50 words

    // Heatmap data by category
    const categoryGroups = data.reduce((acc, item) => {
      const category = item.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = { positive: 0, negative: 0, neutral: 0, total: 0 };
      }
      const sentiment = item.sentiment?.toLowerCase() || 'neutral';
      acc[category][sentiment] += 1;
      acc[category].total += 1;
      return acc;
    }, {});

    const heatmapData = Object.entries(categoryGroups).map(([category, counts]) => ({
      category,
      positive: counts.positive,
      negative: counts.negative,
      neutral: counts.neutral,
      total: counts.total,
      score: ((counts.positive - counts.negative) / counts.total) * 100
    }));

    // Calculate metrics
    const total = data.length;
    const scores = data.filter(d => typeof d.score === 'number').map(d => d.score);
    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    const metricsData = {
      positive: pieData.positive,
      negative: pieData.negative,
      neutral: pieData.neutral,
      averageScore
    };

    return {
      pieData,
      timelineData,
      heatmapData,
      wordCloudData,
      metricsData
    };
  }, [data]);

  const value = {
    data,
    analytics,
    loading,
    loadingMessage,
    error,
    fetchSentimentData,
    getProcessedData,
    refresh: () => fetchSentimentData(true)
  };

  return (
    <SentimentContext.Provider value={value}>
      {children}
    </SentimentContext.Provider>
  );
};

export default SentimentContext;
