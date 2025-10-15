import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  const { loading, error, getProcessedData, refresh } = useSentiment();
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="dashboard-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2>{t('loading')}</h2>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="dashboard-error"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2>{t('error')}</h2>
        <p>{error}</p>
        <button onClick={refresh}>{t('filters.reset')}</button>
      </motion.div>
    );
  }

  const {
    pieData,
    timelineData,
    heatmapData,
    wordCloudData,
    metricsData
  } = getProcessedData();

  return (
    <motion.div
      className="dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="dashboard-header"
        variants={headerVariants}
      >
        <h1>{t('title')}</h1>
        <motion.button
          className="refresh-button"
          onClick={refresh}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('filters.reset')}
        </motion.button>
      </motion.div>

      <motion.section
        className="metrics-section"
        variants={itemVariants}
      >
        <MetricsCards data={metricsData} />
      </motion.section>

      <motion.div
        className="charts-grid"
        variants={containerVariants}
      >
        <motion.section
          className="chart-card"
          variants={itemVariants}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <h2>{t('charts.pie_chart')}</h2>
          <SentimentPieChart data={pieData} />
        </motion.section>

        <motion.section
          className="chart-card"
          variants={itemVariants}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <h2>{t('charts.word_cloud')}</h2>
          <WordCloud data={wordCloudData} />
        </motion.section>

        <motion.section
          className="chart-card full-width"
          variants={itemVariants}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <h2>{t('charts.line_chart')}</h2>
          <SentimentTimeline data={timelineData} />
        </motion.section>

        <motion.section
          className="chart-card full-width"
          variants={itemVariants}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <h2>{t('charts.heatmap')}</h2>
          <SentimentHeatmap data={heatmapData} />
        </motion.section>

        <motion.section
          className="chart-card full-width"
          variants={itemVariants}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { duration: 0.3 }
          }}
        >
          <h2>{t('charts.network_graph')}</h2>
          {networkLoading ? (
            <div className="network-loading">{t('network.loading')}</div>
          ) : networkData ? (
            <SemanticCooccurrenceGraph data={networkData} />
          ) : (
            <div className="network-error">{t('network.no_data')}</div>
          )}
        </motion.section>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
