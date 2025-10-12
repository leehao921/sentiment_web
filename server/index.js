const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { listFiles, checkBucketAccess } = require('./utils/gcpClient');
const { getAllSentimentData } = require('./controllers/sentimentController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sentiment-analysis-api'
  });
});

// Basic API route
app.get('/api', (req, res) => {
  res.json({
    message: 'Sentiment Analysis API',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /api',
      'GET /api/files',
      'GET /api/sentiment-data'
    ]
  });
});

// List files from GCS bucket (M2)
app.get('/api/files', async (req, res) => {
  try {
    const bucketExists = await checkBucketAccess();
    if (!bucketExists) {
      return res.status(404).json({
        error: 'Bucket Not Found',
        message: `Bucket ${process.env.GCS_BUCKET} does not exist or is not accessible`
      });
    }

    const files = await listFiles('rawdata/');
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));

    res.json({
      files: jsonFiles.map(file => file.name),
      details: jsonFiles,
      count: jsonFiles.length,
      bucket: process.env.GCS_BUCKET
    });
  } catch (error) {
    console.error('Error in /api/files:', error);
    res.status(500).json({
      error: 'Failed to fetch files',
      message: error.message
    });
  }
});

// Get all sentiment data (M3)
app.get('/api/sentiment-data', getAllSentimentData);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;