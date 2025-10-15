# Semantic Co-occurrence Network Graph Implementation Guide
# 語義共現網絡圖實作指南

## Overview (概述)

This document provides a complete implementation plan for adding a force-directed network graph to visualize semantic relationships between "暈船" and related terms.

**Milestone**: M6-Viz-NetworkGraph
**Component**: `SemanticCooccurrenceGraph.jsx`
**Backend Support**: M6-Backend-Cooccurrence

---

## Visual Design Specifications (視覺設計規格)

### Graph Elements

1. **Central Node (中心節點)**
   - Text: "暈船"
   - Color: Neon blue (#00D9FF)
   - Size: 100px diameter
   - Animation: Pulsing effect (scale 1.0 → 1.1 → 1.0, 2s cycle)
   - Shadow: Glowing neon effect

2. **Related Nodes (相關節點)**
   - Size: Based on frequency (20px - 80px)
   - Color: Sentiment-based
     - Positive (正面): #4CAF50 (green)
     - Negative (負面): #F44336 (red)
     - Neutral (中性): #9E9E9E (gray)
   - Label: Chinese term
   - Hover: Enlarge + show tooltip

3. **Edges (連線)**
   - Thickness: Proportional to co-occurrence weight (1px - 10px)
   - Color: Semi-transparent based on sentiment
     - Positive: rgba(76, 175, 80, 0.6)
     - Negative: rgba(244, 67, 54, 0.6)
     - Neutral: rgba(158, 158, 158, 0.4)
   - Animation: Luminous glow effect

4. **Background (背景)**
   - Base: Dark gradient (#1a1a2e → #16213e)
   - Dynamic: Subtle color shift based on dominant emotion cluster
     - Positive dominant: Slight blue tint
     - Negative dominant: Slight red tint
   - Pattern: Optional subtle grid or particle effect

### Interactive Features

1. **Threshold Slider (閾值滑桿)**
   - Range: 0 - 100 (co-occurrence frequency)
   - Position: Top-right corner
   - Effect: Filter weak associations in real-time
   - Label: "顯示閾值：{value}"

2. **Zoom & Pan (縮放與平移)**
   - Mouse wheel: Zoom in/out (0.5x - 3x)
   - Drag background: Pan view
   - Double-click: Reset view

3. **Node Interactions (節點互動)**
   - Hover: Show tooltip with statistics
   - Click: Filter to show secondary associations
   - Right-click: Pin node position

4. **Tooltip Content (提示框內容)**
   ```
   曖昧
   ───────────────
   共現次數: 45
   情感分數: +0.72
   關聯強度: ★★★★☆
   ```

---

## Implementation Steps (實作步驟)

### Phase 1: Backend Development (後端開發)

**Developer**: Backend Developer
**Branch**: `backend-dev`
**Milestone**: M6-Backend-Cooccurrence

#### 1.1 Create Co-occurrence Analysis Algorithm

Create `server/utils/cooccurrenceAnalyzer.js`:

```javascript
/**
 * Calculate word co-occurrence from sentiment data
 * @param {Array} sentimentData - Array of sentiment objects
 * @param {String} targetWord - Central word (e.g., "暈船")
 * @param {Number} minFrequency - Minimum co-occurrence threshold
 * @returns {Object} { nodes, edges }
 */
function analyzeCooccurrence(sentimentData, targetWord = '暈船', minFrequency = 5) {
  const cooccurrenceMap = new Map();
  const wordSentiments = new Map();

  // Step 1: Extract keywords from each entry
  sentimentData.forEach(entry => {
    const keywords = entry.keywords || extractKeywords(entry.text);

    // Check if target word is present
    if (keywords.includes(targetWord)) {
      keywords.forEach(keyword => {
        if (keyword !== targetWord) {
          // Count co-occurrence
          const key = keyword;
          cooccurrenceMap.set(key, (cooccurrenceMap.get(key) || 0) + 1);

          // Track sentiment for this word
          if (!wordSentiments.has(key)) {
            wordSentiments.set(key, { positive: 0, negative: 0, neutral: 0, total: 0 });
          }
          const sentiment = wordSentiments.get(key);
          sentiment[entry.sentiment]++;
          sentiment.total++;
        }
      });
    }
  });

  // Step 2: Build nodes
  const nodes = [
    {
      id: targetWord,
      label: targetWord,
      size: 100,
      sentiment: 'neutral',
      group: 'center',
      frequency: sentimentData.filter(e =>
        (e.keywords || []).includes(targetWord)
      ).length
    }
  ];

  // Add related nodes above threshold
  for (const [word, frequency] of cooccurrenceMap.entries()) {
    if (frequency >= minFrequency) {
      const sentimentData = wordSentiments.get(word);
      const dominantSentiment = getDominantSentiment(sentimentData);

      nodes.push({
        id: word,
        label: word,
        size: Math.min(20 + frequency * 2, 80),
        sentiment: dominantSentiment,
        group: 'related',
        frequency: frequency,
        sentimentScore: calculateSentimentScore(sentimentData)
      });
    }
  }

  // Step 3: Build edges
  const edges = nodes
    .filter(n => n.group === 'related')
    .map(node => ({
      source: targetWord,
      target: node.id,
      weight: cooccurrenceMap.get(node.id),
      sentiment: node.sentiment
    }));

  return { nodes, edges };
}

function getDominantSentiment(sentimentData) {
  const { positive, negative, neutral } = sentimentData;
  const max = Math.max(positive, negative, neutral);
  if (max === positive) return 'positive';
  if (max === negative) return 'negative';
  return 'neutral';
}

function calculateSentimentScore(sentimentData) {
  const { positive, negative, total } = sentimentData;
  return ((positive - negative) / total).toFixed(2);
}

function extractKeywords(text) {
  // Simple keyword extraction (can be improved with NLP)
  // Remove common words, split by punctuation
  const stopWords = new Set(['的', '是', '在', '了', '和', '有', '我', '你', '他', '她']);
  const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
  return words.filter(w => w.length > 1 && !stopWords.has(w));
}

module.exports = { analyzeCooccurrence };
```

#### 1.2 Create API Endpoint

Create `server/controllers/cooccurrenceController.js`:

```javascript
const { analyzeCooccurrence } = require('../utils/cooccurrenceAnalyzer');
const { getSentimentData } = require('./sentimentController');

async function getCooccurrenceData(req, res) {
  try {
    const { term = '暈船', threshold = 5 } = req.query;

    // Fetch sentiment data
    const sentimentData = await getSentimentData();

    // Analyze co-occurrence
    const networkData = analyzeCooccurrence(
      sentimentData,
      term,
      parseInt(threshold)
    );

    res.json({
      success: true,
      targetTerm: term,
      threshold: parseInt(threshold),
      nodeCount: networkData.nodes.length,
      edgeCount: networkData.edges.length,
      data: networkData
    });
  } catch (error) {
    console.error('Error in co-occurrence analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze co-occurrence'
    });
  }
}

module.exports = { getCooccurrenceData };
```

#### 1.3 Add Route

Update `server/index.js`:

```javascript
const { getCooccurrenceData } = require('./controllers/cooccurrenceController');

// Add route
app.get('/api/cooccurrence', getCooccurrenceData);
```

#### 1.4 Test Endpoint

```bash
# Test locally
curl "http://localhost:3001/api/cooccurrence?term=暈船&threshold=5"

# Test production
curl "https://sentiment-api-944971472305.asia-east1.run.app/api/cooccurrence?term=暈船&threshold=5"
```

**Commit**:
```bash
git add server/utils/cooccurrenceAnalyzer.js server/controllers/cooccurrenceController.js server/index.js
git commit -m "feat: add co-occurrence analysis API endpoint

Completed: M6-Backend-Cooccurrence
- Implemented word co-occurrence calculation algorithm
- Created /api/cooccurrence endpoint with query parameters
- Support filtering by target word and threshold
- Calculate edge weights based on frequency
- Add sentiment scoring for word pairs

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Phase 2: Frontend Visualization (前端視覺化)

**Developer**: Visualization Developer
**Branch**: `viz-dev`
**Milestone**: M6-Viz-NetworkGraph

#### 2.1 Install Dependencies

```bash
npm install d3-force d3-selection d3-zoom d3-scale d3-drag
```

Update `package.json`:
```json
{
  "dependencies": {
    "d3-force": "^3.0.0",
    "d3-selection": "^3.0.0",
    "d3-zoom": "^3.0.0",
    "d3-scale": "^4.0.2",
    "d3-drag": "^3.0.0"
  }
}
```

#### 2.2 Create Network Graph Component

Create `src/components/visualizations/SemanticCooccurrenceGraph.jsx`:

```javascript
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3-force';
import { select } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { drag } from 'd3-drag';
import { useTranslation } from 'react-i18next';
import NetworkControls from './NetworkControls';
import NetworkTooltip from './NetworkTooltip';
import './SemanticCooccurrenceGraph.css';

const COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
  center: '#00D9FF'
};

const SemanticCooccurrenceGraph = React.memo(({
  data,
  width = 800,
  height = 600,
  initialThreshold = 5
}) => {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [tooltip, setTooltip] = useState({ visible: false, data: null, x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  // Filter data based on threshold
  const filteredData = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const filteredEdges = data.edges.filter(e => e.weight >= threshold);
    const connectedNodeIds = new Set(filteredEdges.flatMap(e => [e.source, e.target]));
    const filteredNodes = data.nodes.filter(n =>
      n.group === 'center' || connectedNodeIds.has(n.id)
    );

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [data, threshold]);

  useEffect(() => {
    if (!svgRef.current || !filteredData.nodes.length) return;

    // Clear previous content
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Create zoom behavior
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation(filteredData.nodes)
      .force('link', d3.forceLink(filteredData.edges)
        .id(d => d.id)
        .distance(d => 150 - d.weight * 2)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size / 2 + 10));

    // Draw edges
    const link = g.append('g')
      .selectAll('line')
      .data(filteredData.edges)
      .enter()
      .append('line')
      .attr('stroke', d => COLORS[d.sentiment])
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight) * 2)
      .attr('class', 'edge');

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.size / 2)
      .attr('fill', d => d.group === 'center' ? COLORS.center : COLORS[d.sentiment])
      .attr('class', d => d.group === 'center' ? 'center-node' : '')
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave)
      .on('click', handleNodeClick);

    // Add labels to nodes
    node.append('text')
      .text(d => d.label)
      .attr('font-size', d => d.group === 'center' ? '16px' : '12px')
      .attr('font-weight', d => d.group === 'center' ? 'bold' : 'normal')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size / 2 + 15)
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Mouse event handlers
    function handleMouseEnter(event, d) {
      if (d.group === 'center') return;

      const [x, y] = [event.pageX, event.pageY];
      setTooltip({
        visible: true,
        data: d,
        x,
        y
      });

      // Highlight node
      select(event.target)
        .transition()
        .duration(200)
        .attr('r', d.size / 2 * 1.2);
    }

    function handleMouseLeave(event, d) {
      setTooltip({ visible: false, data: null, x: 0, y: 0 });

      // Reset node size
      select(event.target)
        .transition()
        .duration(200)
        .attr('r', d.size / 2);
    }

    function handleNodeClick(event, d) {
      if (d.group !== 'center') {
        setSelectedNode(selectedNode === d.id ? null : d.id);
        // TODO: Load secondary associations
      }
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [filteredData, width, height]);

  return (
    <div className="semantic-cooccurrence-graph">
      <NetworkControls
        threshold={threshold}
        onThresholdChange={setThreshold}
        maxThreshold={data?.edges ? Math.max(...data.edges.map(e => e.weight)) : 100}
      />

      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="network-svg"
      />

      {tooltip.visible && (
        <NetworkTooltip
          data={tooltip.data}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </div>
  );
});

export default SemanticCooccurrenceGraph;
```

#### 2.3 Create Controls Component

Create `src/components/visualizations/NetworkControls.jsx`:

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';
import './NetworkControls.css';

const NetworkControls = ({ threshold, onThresholdChange, maxThreshold }) => {
  const { t } = useTranslation();

  return (
    <div className="network-controls">
      <label>
        {t('filters.threshold')}: {threshold}
      </label>
      <input
        type="range"
        min="1"
        max={maxThreshold}
        value={threshold}
        onChange={(e) => onThresholdChange(parseInt(e.target.value))}
        className="threshold-slider"
      />
    </div>
  );
};

export default NetworkControls;
```

#### 2.4 Create Tooltip Component

Create `src/components/visualizations/NetworkTooltip.jsx`:

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';
import './NetworkTooltip.css';

const NetworkTooltip = ({ data, x, y }) => {
  const { t } = useTranslation();

  const getRatingStars = (score) => {
    const rating = Math.round((Math.abs(parseFloat(score)) * 5));
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div
      className="network-tooltip"
      style={{ left: x + 10, top: y + 10 }}
    >
      <div className="tooltip-title">{data.label}</div>
      <div className="tooltip-divider"></div>
      <div className="tooltip-row">
        <span>{t('network.frequency')}:</span>
        <span>{data.frequency}</span>
      </div>
      <div className="tooltip-row">
        <span>{t('network.sentiment_score')}:</span>
        <span>{data.sentimentScore > 0 ? '+' : ''}{data.sentimentScore}</span>
      </div>
      <div className="tooltip-row">
        <span>{t('network.strength')}:</span>
        <span>{getRatingStars(data.sentimentScore)}</span>
      </div>
    </div>
  );
};

export default NetworkTooltip;
```

#### 2.5 Create CSS Styles

Create `src/components/visualizations/SemanticCooccurrenceGraph.css`:

```css
.semantic-cooccurrence-graph {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  overflow: hidden;
}

.network-svg {
  cursor: grab;
}

.network-svg:active {
  cursor: grabbing;
}

/* Central node pulsing animation */
.center-node {
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px #00D9FF);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Edge glow effect */
.edge {
  filter: drop-shadow(0 0 2px currentColor);
}

/* Node hover effect */
.node circle {
  transition: all 0.2s ease;
  cursor: pointer;
}

.node circle:hover {
  filter: brightness(1.3);
}

.node text {
  font-family: 'Noto Sans TC', sans-serif;
  user-select: none;
}
```

Create `src/components/visualizations/NetworkControls.css`:

```css
.network-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 8px;
  z-index: 10;
  color: #fff;
}

.network-controls label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
}

.threshold-slider {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.threshold-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #00D9FF;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px #00D9FF;
}

.threshold-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #00D9FF;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px #00D9FF;
  border: none;
}
```

Create `src/components/visualizations/NetworkTooltip.css`:

```css
.network-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  min-width: 180px;
}

.tooltip-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #00D9FF;
}

.tooltip-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 0;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  font-family: 'Noto Sans TC', sans-serif;
}

.tooltip-row span:first-child {
  color: #999;
  margin-right: 10px;
}

.tooltip-row span:last-child {
  font-weight: 500;
}
```

#### 2.6 Update i18n Translations

Update `src/i18n/locales/zh_TW.json`:

```json
{
  "network": {
    "title": "語義共現網絡圖",
    "frequency": "共現次數",
    "sentiment_score": "情感分數",
    "strength": "關聯強度",
    "loading": "載入網絡圖中..."
  },
  "filters": {
    "threshold": "顯示閾值"
  }
}
```

#### 2.7 Integrate into Dashboard

Update `src/pages/Dashboard.jsx`:

```javascript
import SemanticCooccurrenceGraph from '../components/visualizations/SemanticCooccurrenceGraph';
import { fetchCooccurrenceData } from '../services/api';

// In Dashboard component
const [networkData, setNetworkData] = useState(null);

useEffect(() => {
  async function loadNetworkData() {
    try {
      const data = await fetchCooccurrenceData('暈船', 5);
      setNetworkData(data.data);
    } catch (error) {
      console.error('Error loading network data:', error);
    }
  }
  loadNetworkData();
}, []);

// In render
<SemanticCooccurrenceGraph
  data={networkData}
  width={1000}
  height={600}
/>
```

#### 2.8 Add API Service Method

Update `src/services/api.js`:

```javascript
export const fetchCooccurrenceData = async (term = '暈船', threshold = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cooccurrence`, {
      params: { term, threshold }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching co-occurrence data:', error);
    throw error;
  }
};
```

---

### Phase 3: Testing & Optimization (測試與優化)

#### 3.1 Performance Testing

1. Test with various threshold values
2. Test with large datasets (>100 nodes)
3. Monitor rendering performance
4. Optimize force simulation parameters

#### 3.2 Browser Compatibility

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

#### 3.3 Responsive Design

Add media queries for different screen sizes:

```css
@media (max-width: 768px) {
  .semantic-cooccurrence-graph {
    height: 400px;
  }

  .network-controls {
    top: 10px;
    right: 10px;
    padding: 10px;
  }
}
```

---

## Deployment (部署)

### Backend Deployment

```bash
cd server
gcloud run deploy sentiment-api \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated
```

### Frontend Deployment

```bash
npm run build
firebase deploy
```

---

## Success Criteria (成功標準)

- [ ] Central node "暈船" displays with pulsing animation
- [ ] Related nodes render with correct size and color
- [ ] Edges display with appropriate thickness
- [ ] Threshold slider filters nodes in real-time
- [ ] Zoom and pan work smoothly
- [ ] Tooltips display correct information
- [ ] Chinese text renders properly
- [ ] Performance is acceptable with 50+ nodes
- [ ] Component is responsive on mobile devices
- [ ] Backend API returns data in <1 second

---

## Future Enhancements (未來增強)

1. **Secondary Associations**: Click node to show its own associations
2. **Search Functionality**: Search for specific terms in the graph
3. **Export**: Export graph as PNG/SVG
4. **Animation Controls**: Play/pause force simulation
5. **Clustering**: Group nodes by sentiment or topic
6. **Time-based Analysis**: Show how associations change over time
7. **Canvas Rendering**: Switch to canvas for better performance with large graphs

---

## Resources (資源)

- [D3 Force Documentation](https://d3js.org/d3-force)
- [D3 Zoom Documentation](https://d3js.org/d3-zoom)
- [React + D3 Best Practices](https://2019.wattenberger.com/blog/react-and-d3)
- [Force-Directed Graph Tutorial](https://observablehq.com/@d3/force-directed-graph)

---

**Last Updated**: 2025-10-15
**Status**: Ready for Implementation
