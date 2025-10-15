/**
 * Sentiment Analyzer for Chinese Traditional Text
 * Analyzes Dcard posts and extracts sentiment, keywords, and metadata
 */

// Chinese positive keywords (Traditional Chinese)
const POSITIVE_KEYWORDS = [
  '開心', '快樂', '喜歡', '愛', '好', '棒', '讚', '感謝', '謝謝',
  '美好', '幸福', '完美', '優秀', '厲害', '加油', '支持', '溫暖',
  '可愛', '帥', '漂亮', '成功', '順利', '有趣', '笑', '哈哈'
];

// Chinese negative keywords (Traditional Chinese)
const NEGATIVE_KEYWORDS = [
  '難過', '傷心', '痛苦', '討厭', '糟', '爛', '差', '壞', '失望',
  '生氣', '憤怒', '煩', '累', '辛苦', '困難', '問題', '錯誤', '失敗',
  '害怕', '擔心', '焦慮', '後悔', '哭', '可惜', '無聊', '寂寞'
];

/**
 * Analyze sentiment of Chinese text
 * @param {string} text - Text to analyze
 * @returns {object} - Sentiment analysis result
 */
function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0
    };
  }

  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive keywords
  POSITIVE_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = text.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  });

  // Count negative keywords
  NEGATIVE_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = text.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  });

  // Calculate sentiment score (-1 to 1)
  const totalKeywords = positiveCount + negativeCount;
  let score = 0;
  let sentiment = 'neutral';

  if (totalKeywords > 0) {
    score = (positiveCount - negativeCount) / totalKeywords;

    if (score > 0.2) {
      sentiment = 'positive';
    } else if (score < -0.2) {
      sentiment = 'negative';
    }
  }

  // Calculate confidence based on keyword density
  const textLength = text.length;
  const keywordDensity = totalKeywords / (textLength / 100); // per 100 chars
  const confidence = Math.min(keywordDensity / 2, 1); // Cap at 1

  return {
    sentiment,
    score: parseFloat(score.toFixed(3)),
    confidence: parseFloat(confidence.toFixed(3)),
    positiveKeywords: positiveCount,
    negativeKeywords: negativeCount
  };
}

/**
 * Extract keywords from Chinese text
 * @param {string} text - Text to extract keywords from
 * @param {number} limit - Maximum number of keywords
 * @returns {array} - Array of keywords
 */
function extractKeywords(text, limit = 20) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Common Chinese keywords and phrases
  const keywordPatterns = [
    // Emotions
    /暈船|曖昧|喜歡|愛情|感情|交友|約會|分手|想念/g,
    // Social
    /朋友|家人|同學|室友|鄰居|陌生人/g,
    // Places
    /台北|台中|台南|高雄|學校|公司|家裡|餐廳/g,
    // Activities
    /吃飯|看電影|聊天|玩遊戲|運動|旅遊|工作|讀書/g,
    // Time
    /今天|昨天|明天|週末|假日|早上|晚上|最近/g
  ];

  const keywords = new Set();

  keywordPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => keywords.add(match));
    }
  });

  // Extract 2-4 character phrases (common in Chinese)
  const phraseRegex = /[\u4e00-\u9fa5]{2,4}/g;
  const phrases = text.match(phraseRegex) || [];

  // Count frequency
  const frequency = {};
  phrases.forEach(phrase => {
    frequency[phrase] = (frequency[phrase] || 0) + 1;
  });

  // Get top phrases by frequency
  const topPhrases = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([phrase]) => phrase);

  topPhrases.forEach(phrase => keywords.add(phrase));

  return Array.from(keywords).slice(0, limit);
}

/**
 * Extract timestamp from entities
 * @param {array} entities - Array of entities
 * @returns {string} - ISO timestamp
 */
function extractTimestamp(entities) {
  if (!entities || !Array.isArray(entities)) {
    return new Date().toISOString();
  }

  // Find timestamp entity
  const timestampEntity = entities.find(e => e.type === 'timestamp');
  if (timestampEntity && timestampEntity.mentionText) {
    // Try to parse Chinese date format
    const dateText = timestampEntity.mentionText;

    // Match patterns like "9月12日 18:08"
    const match = dateText.match(/(\d+)月(\d+)日\s*(\d+):(\d+)/);
    if (match) {
      const [, month, day, hour, minute] = match;
      const year = new Date().getFullYear();
      const date = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
      return date.toISOString();
    }
  }

  return new Date().toISOString();
}

/**
 * Extract category from entities
 * @param {array} entities - Array of entities
 * @returns {string} - Category name
 */
function extractCategory(entities) {
  if (!entities || !Array.isArray(entities)) {
    return 'general';
  }

  // Find topic entity
  const topicEntity = entities.find(e => e.type === 'topic');
  if (topicEntity && topicEntity.mentionText) {
    return topicEntity.mentionText;
  }

  return 'general';
}

/**
 * Process Dcard JSON document and add sentiment analysis
 * @param {object} data - Raw Dcard data with document.text and document.entities
 * @returns {object} - Processed data with sentiment fields
 */
function processDcardDocument(data) {
  if (!data || !data.document) {
    return null;
  }

  const { text, entities } = data.document;

  // Analyze sentiment
  const sentimentResult = analyzeSentiment(text);

  // Extract metadata
  const timestamp = extractTimestamp(entities);
  const category = extractCategory(entities);
  const keywords = extractKeywords(text);

  // Extract title if available
  const titleEntity = entities.find(e => e.type === 'title');
  const title = titleEntity ? titleEntity.mentionText : text.substring(0, 50) + '...';

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    text: text.substring(0, 500), // Limit text length
    title,
    sentiment: sentimentResult.sentiment,
    score: sentimentResult.score,
    confidence: sentimentResult.confidence,
    timestamp,
    category,
    keywords,
    entities,
    raw: data // Keep original data
  };
}

module.exports = {
  analyzeSentiment,
  extractKeywords,
  extractTimestamp,
  extractCategory,
  processDcardDocument
};
