/**
 * Co-occurrence Analysis for Word Associations
 * Analyzes which words appear together with a target word
 */

/**
 * Calculate word co-occurrence from sentiment data
 * @param {Array} sentimentData - Array of sentiment objects with text/keywords
 * @param {String} targetWord - Central word (e.g., "暈船")
 * @param {Number} minFrequency - Minimum co-occurrence threshold
 * @returns {Object} { nodes, edges }
 */
function analyzeCooccurrence(sentimentData, targetWord = '暈船', minFrequency = 5) {
  const cooccurrenceMap = new Map();
  const wordSentiments = new Map();

  // Step 1: Extract keywords and count co-occurrences
  sentimentData.forEach(entry => {
    const keywords = entry.keywords || extractKeywords(entry.text || '');

    // Check if target word is present
    if (keywords.includes(targetWord)) {
      keywords.forEach(keyword => {
        if (keyword !== targetWord && keyword.length > 1) {
          // Count co-occurrence
          cooccurrenceMap.set(keyword, (cooccurrenceMap.get(keyword) || 0) + 1);

          // Track sentiment for this word
          if (!wordSentiments.has(keyword)) {
            wordSentiments.set(keyword, {
              positive: 0,
              negative: 0,
              neutral: 0,
              total: 0
            });
          }
          const sentiment = wordSentiments.get(keyword);
          const sentimentType = entry.sentiment || 'neutral';
          sentiment[sentimentType]++;
          sentiment.total++;
        }
      });
    }
  });

  // Step 2: Build central node
  const targetFrequency = sentimentData.filter(e => {
    const keywords = e.keywords || extractKeywords(e.text || '');
    return keywords.includes(targetWord);
  }).length;

  const nodes = [
    {
      id: targetWord,
      label: targetWord,
      size: 100,
      sentiment: 'neutral',
      group: 'center',
      frequency: targetFrequency
    }
  ];

  // Step 3: Add related nodes above threshold
  const sortedWords = Array.from(cooccurrenceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50); // Limit to top 50 words

  for (const [word, frequency] of sortedWords) {
    if (frequency >= minFrequency) {
      const sentimentData = wordSentiments.get(word);
      const dominantSentiment = getDominantSentiment(sentimentData);
      const sentimentScore = calculateSentimentScore(sentimentData);

      nodes.push({
        id: word,
        label: word,
        size: Math.min(20 + frequency * 2, 80),
        sentiment: dominantSentiment,
        group: 'related',
        frequency: frequency,
        sentimentScore: sentimentScore
      });
    }
  }

  // Step 4: Build edges
  const edges = nodes
    .filter(n => n.group === 'related')
    .map(node => ({
      source: targetWord,
      target: node.id,
      weight: cooccurrenceMap.get(node.id),
      sentiment: node.sentiment
    }));

  return {
    nodes,
    edges,
    metadata: {
      totalEntries: sentimentData.length,
      targetFrequency,
      relatedWordsCount: edges.length
    }
  };
}

/**
 * Determine dominant sentiment from sentiment counts
 */
function getDominantSentiment(sentimentData) {
  const { positive, negative, neutral } = sentimentData;
  const max = Math.max(positive, negative, neutral);
  if (max === positive) return 'positive';
  if (max === negative) return 'negative';
  return 'neutral';
}

/**
 * Calculate sentiment score (-1 to +1)
 */
function calculateSentimentScore(sentimentData) {
  const { positive, negative, total } = sentimentData;
  if (total === 0) return 0;
  return parseFloat(((positive - negative) / total).toFixed(2));
}

/**
 * Extract keywords from Chinese text
 * Simple implementation - can be enhanced with NLP library
 */
function extractKeywords(text) {
  if (!text) return [];

  // Common Chinese stop words
  const stopWords = new Set([
    '的', '是', '在', '了', '和', '有', '我', '你', '他', '她',
    '這', '那', '就', '都', '而', '及', '與', '或', '等', '著',
    '很', '不', '也', '要', '會', '可', '能', '到', '為', '但',
    '一', '個', '們', '對', '說', '用', '把', '從', '以', '所'
  ]);

  // Extract Chinese words (2+ characters)
  const words = text.match(/[\u4e00-\u9fa5]+/g) || [];

  return words
    .filter(w => w.length >= 2 && !stopWords.has(w))
    .filter((word, index, self) => self.indexOf(word) === index); // Unique
}

module.exports = {
  analyzeCooccurrence,
  extractKeywords
};
