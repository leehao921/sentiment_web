const { listFiles, downloadFile } = require('../utils/gcpClient');
const { processDcardDocument } = require('../utils/sentimentAnalyzer');

// Simple in-memory cache
let dataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all data from GCS (with caching)
 */
const fetchAllData = async () => {
  // Check cache
  if (dataCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached data');
    return dataCache;
  }

  console.log('Fetching fresh data from GCS');

  const files = await listFiles('rawdata/');
  const jsonFiles = files.filter(file => file.name.endsWith('.json'));

  const allData = [];
  for (const file of jsonFiles) {
    try {
      const contents = await downloadFile(file.name);
      const jsonData = JSON.parse(contents.toString('utf-8'));

      let documents = Array.isArray(jsonData) ? jsonData : [jsonData];

      // Process each document through sentiment analyzer
      documents.forEach(doc => {
        const processed = processDcardDocument(doc);
        if (processed) {
          allData.push(processed);
        }
      });
    } catch (parseError) {
      console.error(`Error parsing ${file.name}:`, parseError.message);
    }
  }

  // Update cache
  dataCache = allData;
  cacheTimestamp = Date.now();

  return allData;
};

/**
 * Get all sentiment data from JSON files in GCS bucket
 * Supports filtering by type and date range
 * Query params: ?type=positive|negative|neutral&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
const getAllSentimentData = async (req, res) => {
  try {
    let allData = await fetchAllData();

    // Filter by sentiment type
    const { type, startDate, endDate } = req.query;

    if (type) {
      allData = allData.filter(item =>
        item.sentiment && item.sentiment.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      allData = allData.filter(item => {
        if (!item.timestamp) return false;

        const itemDate = new Date(item.timestamp);
        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;

        return true;
      });
    }

    res.json({
      data: allData,
      total: allData.length,
      filters: { type, startDate, endDate },
      source: `gs://${process.env.GCS_BUCKET}/rawdata/`
    });
  } catch (error) {
    console.error('Error in getAllSentimentData:', error);
    res.status(500).json({
      error: 'Failed to fetch sentiment data',
      message: error.message
    });
  }
};

/**
 * Validate sentiment data structure
 */
const validateSentimentData = (data) => {
  // Basic validation - can be extended
  if (!data) return false;

  // Check if it's an object or array
  if (typeof data !== 'object') return false;

  return true;
};

/**
 * Process and normalize sentiment data
 */
const normalizeSentimentData = (data) => {
  // Add default fields if missing
  return {
    id: data.id || data._id || Math.random().toString(36).substr(2, 9),
    text: data.text || data.content || data.message || '',
    sentiment: data.sentiment || 'neutral',
    score: data.score || 0,
    timestamp: data.timestamp || data.created_at || new Date().toISOString(),
    category: data.category || 'general',
    keywords: data.keywords || [],
    ...data  // Include all other fields
  };
};

/**
 * Get analytics and aggregated sentiment statistics
 */
const getAnalytics = async (req, res) => {
  try {
    const allData = await fetchAllData();

    // Calculate sentiment distribution
    const distribution = {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    let totalScore = 0;
    let scoreCount = 0;
    const dateCount = {};

    allData.forEach(item => {
      // Count by sentiment type
      const sentiment = (item.sentiment || 'neutral').toLowerCase();
      if (distribution.hasOwnProperty(sentiment)) {
        distribution[sentiment]++;
      }

      // Calculate average score
      if (item.score !== undefined && item.score !== null) {
        totalScore += parseFloat(item.score);
        scoreCount++;
      }

      // Count by date
      if (item.timestamp) {
        const date = new Date(item.timestamp).toISOString().split('T')[0];
        dateCount[date] = (dateCount[date] || 0) + 1;
      }
    });

    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : 0;

    // Get date range
    const dates = Object.keys(dateCount).sort();
    const dateRange = dates.length > 0 ? {
      start: dates[0],
      end: dates[dates.length - 1]
    } : null;

    res.json({
      distribution,
      averageScore: parseFloat(averageScore),
      totalAnalyzed: allData.length,
      dateRange,
      dailyCounts: dateCount
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
};

/**
 * Get sentiment data for analysis (internal use)
 * Returns raw data array without response formatting
 */
const getSentimentDataForAnalysis = async () => {
  return await fetchAllData();
};

module.exports = {
  getAllSentimentData,
  getAnalytics,
  validateSentimentData,
  normalizeSentimentData,
  getSentimentDataForAnalysis
};
