const { listFiles, downloadFile } = require('../utils/gcpClient');

/**
 * Get all sentiment data from JSON files in GCS bucket
 */
const getAllSentimentData = async (req, res) => {
  try {
    // List all JSON files
    const files = await listFiles('rawdata/');
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} JSON files`);

    // Download and parse all JSON files
    const allData = [];
    for (const file of jsonFiles) {
      try {
        const contents = await downloadFile(file.name);
        const jsonData = JSON.parse(contents.toString('utf-8'));

        // Handle both single objects and arrays
        if (Array.isArray(jsonData)) {
          allData.push(...jsonData);
        } else {
          allData.push(jsonData);
        }
      } catch (parseError) {
        console.error(`Error parsing ${file.name}:`, parseError.message);
        // Continue with other files
      }
    }

    console.log(`Successfully processed ${allData.length} sentiment records`);

    res.json({
      data: allData,
      total: allData.length,
      source: `gs://${process.env.GCS_BUCKET}/rawdata/`,
      filesProcessed: jsonFiles.length
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

module.exports = {
  getAllSentimentData,
  validateSentimentData,
  normalizeSentimentData
};
