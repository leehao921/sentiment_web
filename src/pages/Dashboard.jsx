import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSentiment } from '../context/SentimentContext';
import { sentimentAPI } from '../services/api';
import SentimentPieChart from '../components/visualizations/SentimentPieChart';
import SentimentTimeline from '../components/visualizations/SentimentTimeline';
import SentimentHeatmap from '../components/visualizations/SentimentHeatmap';
import WordCloud from '../components/visualizations/WordCloud';
import MetricsCards from '../components/visualizations/MetricsCards';
import SemanticCooccurrenceGraph from '../components/visualizations/SemanticCooccurrenceGraph';
import './Dashboard.css';

function Dashboard() {
  const { t } = useTranslation();
  const { loading, loadingMessage, error, getProcessedData, refresh } = useSentiment();
  const [networkData, setNetworkData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(true);

  // Fetch network graph data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setNetworkLoading(true);
        const response = await sentimentAPI.getCooccurrence('暈船', 3);
        if (response.data && response.data.success) {
          setNetworkData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching network data:', err);
      } finally {
        setNetworkLoading(false);
      }
    };

    fetchNetworkData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>{loadingMessage || t('loading')}</h2>
        <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>
          首次載入可能需要較長時間，請耐心等候...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>{t('error')}</h2>
        <p>{error}</p>
        <button onClick={refresh}>{t('filters.reset')}</button>
      </div>
    );
  }

  const {
    pieData,
    timelineData,
    heatmapData,
    wordCloudData,
    metricsData
  } = getProcessedData();

  console.log('Dashboard data:', {
    pieData,
    timelineData: timelineData?.length,
    heatmapData: heatmapData?.length,
    wordCloudData: wordCloudData?.length,
    metricsData
  });

  // Show error if no data
  if (!pieData || (pieData.positive === 0 && pieData.negative === 0 && pieData.neutral === 0)) {
    return (
      <div className="dashboard-error">
        <h2>無資料</h2>
        <p>無法載入情感分析資料，請檢查網路連接或稍後再試。</p>
        <button onClick={refresh}>重新載入</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('title')}</h1>
        <button className="refresh-button" onClick={refresh}>
          {t('filters.reset')}
        </button>
      </div>

      <section className="metrics-section">
        <MetricsCards data={metricsData} />
      </section>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>{t('charts.pie_chart')}</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <SentimentPieChart data={pieData} />
          </div>
        </div>

        <div className="chart-card">
          <h2>{t('charts.word_cloud')}</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <WordCloud data={wordCloudData} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>{t('charts.line_chart')}</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <SentimentTimeline data={timelineData} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>{t('charts.heatmap')}</h2>
          <div style={{ width: '100%', height: '400px' }}>
            <SentimentHeatmap data={heatmapData} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>{t('charts.network_graph')}</h2>
          <div style={{ width: '100%', height: '400px' }}>
            {networkLoading ? (
              <div className="network-loading">{t('network.loading')}</div>
            ) : networkData ? (
              <SemanticCooccurrenceGraph data={networkData} />
            ) : (
              <div className="network-error">{t('network.no_data')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
