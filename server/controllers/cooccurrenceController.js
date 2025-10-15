const { analyzeCooccurrence } = require('../utils/cooccurrenceAnalyzer');
const { getSentimentDataForAnalysis } = require('./sentimentController');

/**
 * Get co-occurrence network data
 * Query params:
 *  - term: target word (default: 暈船)
 *  - threshold: minimum frequency (default: 5)
 */
async function getCooccurrenceData(req, res) {
  try {
    const { term = '暈船', threshold = 5 } = req.query;
    const minThreshold = parseInt(threshold);

    // Validate threshold
    if (isNaN(minThreshold) || minThreshold < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid threshold. Must be a positive integer.'
      });
    }

    // Fetch all sentiment data
    const sentimentData = await getSentimentDataForAnalysis();

    if (!sentimentData || sentimentData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No sentiment data available'
      });
    }

    // Analyze co-occurrence
    const networkData = analyzeCooccurrence(sentimentData, term, minThreshold);

    res.json({
      success: true,
      targetTerm: term,
      threshold: minThreshold,
      nodeCount: networkData.nodes.length,
      edgeCount: networkData.edges.length,
      metadata: networkData.metadata,
      data: {
        nodes: networkData.nodes,
        edges: networkData.edges
      }
    });

  } catch (error) {
    console.error('Error in co-occurrence analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze co-occurrence',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  getCooccurrenceData
};
