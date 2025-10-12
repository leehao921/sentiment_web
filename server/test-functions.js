/**
 * Test script for sentiment controller functions
 * Run with: node test-functions.js
 */

const fs = require('fs');
const path = require('path');

// Mock GCP client
const mockGcpClient = {
  listFiles: async (prefix) => {
    return [
      { name: 'rawdata/sample1.json', size: '1234', updated: '2025-10-12', contentType: 'application/json' }
    ];
  },
  downloadFile: async (fileName) => {
    // Read from local test data
    const testData = [
      {
        id: "1",
        text: "這個產品真的很棒，非常滿意！",
        sentiment: "positive",
        score: 0.95,
        timestamp: "2025-10-10T10:00:00Z",
        category: "product-review",
        keywords: ["產品", "滿意", "很棒"]
      },
      {
        id: "2",
        text: "服務態度不好，很失望。",
        sentiment: "negative",
        score: -0.75,
        timestamp: "2025-10-11T14:30:00Z",
        category: "service",
        keywords: ["服務", "失望"]
      },
      {
        id: "3",
        text: "普通的體驗，沒有特別感覺。",
        sentiment: "neutral",
        score: 0.05,
        timestamp: "2025-10-12T09:15:00Z",
        category: "general",
        keywords: ["普通", "體驗"]
      },
      {
        id: "4",
        text: "超級推薦！質量很好。",
        sentiment: "positive",
        score: 0.88,
        timestamp: "2025-10-10T15:20:00Z",
        category: "product-review",
        keywords: ["推薦", "質量"]
      }
    ];
    return Buffer.from(JSON.stringify(testData));
  },
  checkBucketAccess: async () => true
};

// Mock the GCP client module
require.cache[require.resolve('./utils/gcpClient')] = {
  exports: mockGcpClient
};

const { getAllSentimentData, getAnalytics, validateSentimentData, normalizeSentimentData } = require('./controllers/sentimentController');

// Helper to create mock request/response objects
const createMockReq = (query = {}) => ({ query });
const createMockRes = () => {
  const res = {};
  res.json = (data) => {
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    return res;
  };
  res.status = (code) => {
    console.log(`📊 Status: ${code}`);
    return res;
  };
  return res;
};

async function runTests() {
  console.log('🧪 Starting Function Tests\n');
  console.log('='.repeat(60));

  // Test 1: validateSentimentData
  console.log('\n📝 Test 1: validateSentimentData');
  console.log('-'.repeat(60));
  const validData = { id: '1', text: 'test', sentiment: 'positive' };
  const invalidData = null;
  console.log('Valid data:', validateSentimentData(validData)); // Should be true
  console.log('Invalid data:', validateSentimentData(invalidData)); // Should be false

  // Test 2: normalizeSentimentData
  console.log('\n📝 Test 2: normalizeSentimentData');
  console.log('-'.repeat(60));
  const rawData = { content: 'Some text', score: 0.8 };
  const normalized = normalizeSentimentData(rawData);
  console.log('Normalized:', normalized);

  // Test 3: getAllSentimentData (all data)
  console.log('\n📝 Test 3: getAllSentimentData (all data)');
  console.log('-'.repeat(60));
  await getAllSentimentData(createMockReq(), createMockRes());

  // Test 4: getAllSentimentData (filter by type=positive)
  console.log('\n📝 Test 4: getAllSentimentData (filter by type=positive)');
  console.log('-'.repeat(60));
  await getAllSentimentData(
    createMockReq({ type: 'positive' }),
    createMockRes()
  );

  // Test 5: getAllSentimentData (filter by type=negative)
  console.log('\n📝 Test 5: getAllSentimentData (filter by type=negative)');
  console.log('-'.repeat(60));
  await getAllSentimentData(
    createMockReq({ type: 'negative' }),
    createMockRes()
  );

  // Test 6: getAllSentimentData (filter by date range)
  console.log('\n📝 Test 6: getAllSentimentData (filter by date range)');
  console.log('-'.repeat(60));
  await getAllSentimentData(
    createMockReq({ startDate: '2025-10-11', endDate: '2025-10-12' }),
    createMockRes()
  );

  // Test 7: getAnalytics
  console.log('\n📝 Test 7: getAnalytics');
  console.log('-'.repeat(60));
  await getAnalytics(createMockReq(), createMockRes());

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!\n');
}

// Run the tests
runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
