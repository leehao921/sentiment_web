# Word Cloud Enhancement Guide (Affective Landscape)
# 詞雲增強指南（情感地景）

## Overview (概述)

This document provides specifications for enhancing the existing Word Cloud component to create an "Affective Landscape" visualization that displays emotional terms co-appearing with "暈船".

**Current Component**: `src/components/visualizations/WordCloud.jsx`
**Status**: Basic implementation exists
**Enhancement Milestone**: M7-Viz-WordCloudEnhancement

---

## Current vs. Enhanced Features

### Current Implementation
- ✅ Basic 2D word cloud using d3-cloud
- ✅ Simple size mapping based on frequency
- ✅ Random rotation (0° or 90°)
- ✅ Static Impact font

### Proposed Enhancements
- 🎯 **Color Mapping**: Hue represents sentiment score, brightness encodes frequency
- 🎯 **3D/Planar Options**: Toggle between 3D rotating cloud or weighted planar layout
- 🎯 **Animated Hover**: Magnification effect on hover
- 🎯 **Motion Blur**: Subtle blur to simulate "emotional turbulence"
- 🎯 **Day/Night Mode**: Toggle between light/dark color schemes
- 🎯 **Chinese Font Support**: Use Noto Sans TC for proper rendering

---

## Design Specifications (設計規格)

### Color Mapping System

#### Sentiment Score → Hue
```javascript
// Sentiment score range: -1 (negative) to +1 (positive)
const sentimentToHue = (score) => {
  // Map sentiment to color wheel
  // -1.0 (negative) → 0° (red)
  // 0.0 (neutral) → 60° (yellow)
  // +1.0 (positive) → 120° (green)
  return ((score + 1) / 2) * 120;
};
```

#### Frequency → Brightness
```javascript
// Higher frequency = brighter color
const frequencyToBrightness = (frequency, maxFreq) => {
  const normalized = frequency / maxFreq;
  return 30 + (normalized * 50); // Range: 30% - 80% lightness
};
```

#### Complete Color Formula
```javascript
const getWordColor = (sentiment, frequency, maxFreq, isDarkMode) => {
  const hue = ((sentiment + 1) / 2) * 120;
  const lightness = frequencyToBrightness(frequency, maxFreq);
  const saturation = 70;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
```

### Layout Options

#### Option 1: Planar Weighted Layout (Default)
- Words arranged in 2D plane
- Size based on frequency
- Position clustered by sentiment
- Smooth transitions between states

#### Option 2: 3D Rotating Cloud
- Words distributed in 3D sphere
- Continuous rotation animation
- Depth-based opacity (farther = more transparent)
- Perspective projection

### Interaction Design

#### Hover Effects
1. **Magnification**: Scale word to 1.3x on hover
2. **Glow**: Add drop-shadow with sentiment color
3. **Focus**: Slightly dim other words (opacity 0.5)
4. **Tooltip**: Show statistics (frequency, sentiment, co-occurrence)

#### Motion Blur Effect
- Applied during layout transitions
- Simulates emotional turbulence
- CSS filter: `blur(2px)` during animation
- Clears after 300ms

#### Day/Night Mode
```javascript
// Day Mode (Light)
background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf0 100%)
textShadow: 1px 1px 2px rgba(0,0,0,0.1)

// Night Mode (Dark)
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)
textShadow: 0 0 10px currentColor
```

---

## Implementation Guide (實作指南)

### Phase 1: Enhanced 2D Word Cloud

#### Step 1.1: Update Component Structure

Create enhanced version: `src/components/visualizations/WordCloudEnhanced.jsx`

```javascript
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useTranslation } from 'react-i18next';
import './WordCloudEnhanced.css';

const WordCloudEnhanced = React.memo(({
  data, // Array of { text, frequency, sentiment, cooccurrence }
  width = 800,
  height = 600,
  mode = 'planar', // 'planar' or '3d'
  theme = 'dark' // 'dark' or 'light'
}) => {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate max frequency for normalization
  const maxFrequency = useMemo(() => {
    return Math.max(...data.map(d => d.frequency));
  }, [data]);

  // Color scale based on sentiment and frequency
  const getWordColor = (word) => {
    const hue = ((word.sentiment + 1) / 2) * 120; // -1 to +1 → 0° to 120°
    const lightness = 30 + ((word.frequency / maxFrequency) * 50); // 30% to 80%
    const saturation = 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Prepare word cloud layout
  const layout = useMemo(() => {
    return cloud()
      .size([width, height])
      .words(data.map(d => ({
        text: d.text,
        size: 10 + (d.frequency / maxFrequency) * 60, // 10px - 70px
        sentiment: d.sentiment,
        frequency: d.frequency,
        cooccurrence: d.cooccurrence || 0
      })))
      .padding(8)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0)) // 30% vertical, 70% horizontal
      .font('Noto Sans TC, sans-serif')
      .fontSize(d => d.size)
      .spiral('archimedean')
      .on('end', draw);
  }, [data, width, height, maxFrequency]);

  function draw(words) {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw words
    const text = g
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Noto Sans TC, sans-serif')
      .style('fill', d => getWordColor(d))
      .style('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('class', 'word-cloud-text')
      .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave);

    // Add entrance animation
    text
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 20)
      .style('opacity', 1);
  }

  function handleMouseEnter(event, d) {
    setHoveredWord(d);

    const element = d3.select(event.target);

    // Magnify word
    element
      .transition()
      .duration(200)
      .style('font-size', `${d.size * 1.3}px`)
      .style('filter', `drop-shadow(0 0 8px ${getWordColor(d)})`);

    // Dim other words
    d3.selectAll('.word-cloud-text')
      .filter(word => word !== d)
      .transition()
      .duration(200)
      .style('opacity', 0.3);
  }

  function handleMouseLeave(event, d) {
    setHoveredWord(null);

    const element = d3.select(event.target);

    // Reset word size
    element
      .transition()
      .duration(200)
      .style('font-size', `${d.size}px`)
      .style('filter', 'none');

    // Restore other words
    d3.selectAll('.word-cloud-text')
      .transition()
      .duration(200)
      .style('opacity', 1);
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setIsAnimating(true);
      layout.start();

      // Clear motion blur after animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }, [data, layout]);

  return (
    <div className={`word-cloud-enhanced ${theme}-theme`}>
      <div className="word-cloud-header">
        <h3>{t('wordcloud.title')}</h3>
        <div className="word-cloud-controls">
          {/* Theme toggle button */}
          <button
            onClick={() => {/* Toggle theme */}}
            className="theme-toggle"
          >
            {theme === 'dark' ? '☀️ 日間模式' : '🌙 夜間模式'}
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        className={`word-cloud-svg ${isAnimating ? 'animating' : ''}`}
      />

      {hoveredWord && (
        <div className="word-cloud-tooltip">
          <div className="tooltip-word">{hoveredWord.text}</div>
          <div className="tooltip-stats">
            <div>頻率: {hoveredWord.frequency}</div>
            <div>情感: {hoveredWord.sentiment > 0 ? '+' : ''}{hoveredWord.sentiment.toFixed(2)}</div>
            <div>共現: {hoveredWord.cooccurrence}</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default WordCloudEnhanced;
```

#### Step 1.2: Add CSS Styling

Create `src/components/visualizations/WordCloudEnhanced.css`:

```css
.word-cloud-enhanced {
  position: relative;
  width: 100%;
  border-radius: 8px;
  padding: 20px;
  transition: background 0.3s ease;
}

/* Dark Theme */
.word-cloud-enhanced.dark-theme {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.word-cloud-enhanced.dark-theme .word-cloud-text {
  filter: drop-shadow(0 0 4px currentColor);
}

/* Light Theme */
.word-cloud-enhanced.light-theme {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf0 100%);
}

.word-cloud-enhanced.light-theme .word-cloud-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Header */
.word-cloud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.word-cloud-header h3 {
  margin: 0;
  color: #fff;
  font-family: 'Noto Sans TC', sans-serif;
}

.light-theme .word-cloud-header h3 {
  color: #333;
}

/* Controls */
.word-cloud-controls {
  display: flex;
  gap: 10px;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Noto Sans TC', sans-serif;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.light-theme .theme-toggle {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

/* SVG Container */
.word-cloud-svg {
  display: block;
  margin: 0 auto;
  transition: filter 0.3s ease;
}

/* Motion blur during animation */
.word-cloud-svg.animating {
  filter: blur(2px);
  animation: turbulence 0.8s ease-out;
}

@keyframes turbulence {
  0%, 100% { filter: blur(0px); }
  50% { filter: blur(3px); }
}

/* Word text styling */
.word-cloud-text {
  transition: all 0.2s ease;
  font-weight: 500;
}

/* Tooltip */
.word-cloud-tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-family: 'Noto Sans TC', sans-serif;
}

.tooltip-word {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  color: #00D9FF;
}

.tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tooltip-stats div {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .word-cloud-enhanced {
    padding: 10px;
  }

  .word-cloud-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
```

---

### Phase 2: 3D Rotating Word Cloud (Optional)

For 3D implementation, consider using:
1. **Three.js + React Three Fiber**: Full 3D rendering
2. **CSS 3D Transforms**: Lighter-weight pseudo-3D effect

#### Simple 3D with CSS (Recommended for MVP)

```javascript
// Add rotation state
const [rotation, setRotation] = useState({ x: 0, y: 0 });

// Auto-rotate effect
useEffect(() => {
  if (mode === '3d') {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 0.3
      }));
    }, 50);

    return () => clearInterval(interval);
  }
}, [mode]);

// Apply 3D transform
<div
  className="word-cloud-3d-container"
  style={{
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
  }}
>
  {/* Word cloud content */}
</div>
```

---

## Integration with Dashboard (儀表板整合)

### Update Dashboard to use Enhanced Word Cloud

```javascript
// src/pages/Dashboard.jsx
import WordCloudEnhanced from '../components/visualizations/WordCloudEnhanced';

const [wordCloudData, setWordCloudData] = useState([]);
const [wordCloudTheme, setWordCloudTheme] = useState('dark');

// Fetch word cloud data
useEffect(() => {
  async function loadWordCloudData() {
    const data = await fetchCooccurrenceData('暈船', 3);
    const formattedData = data.nodes
      .filter(n => n.group === 'related')
      .map(n => ({
        text: n.label,
        frequency: n.frequency,
        sentiment: parseFloat(n.sentimentScore),
        cooccurrence: n.frequency
      }));
    setWordCloudData(formattedData);
  }
  loadWordCloudData();
}, []);

// Render
<WordCloudEnhanced
  data={wordCloudData}
  width={800}
  height={600}
  mode="planar"
  theme={wordCloudTheme}
  onThemeChange={setWordCloudTheme}
/>
```

---

## Update i18n Translations

Add to `src/i18n/locales/zh_TW.json`:

```json
{
  "wordcloud": {
    "title": "情感地景詞雲",
    "subtitle": "與「暈船」共現的情感詞彙",
    "frequency": "頻率",
    "sentiment": "情感分數",
    "cooccurrence": "共現次數",
    "day_mode": "日間模式",
    "night_mode": "夜間模式",
    "planar_mode": "平面佈局",
    "3d_mode": "3D旋轉"
  }
}
```

---

## Testing Checklist (測試清單)

- [ ] Color mapping correctly reflects sentiment (red → yellow → green)
- [ ] Brightness increases with word frequency
- [ ] Hover magnification works smoothly
- [ ] Other words dim when one is hovered
- [ ] Motion blur animation plays during layout changes
- [ ] Day/night theme toggle works correctly
- [ ] Chinese characters render properly with Noto Sans TC
- [ ] Tooltip displays correct statistics
- [ ] Performance is acceptable with 50+ words
- [ ] Responsive on mobile devices

---

## Performance Optimization (效能優化)

1. **Limit Words**: Display max 50-80 most frequent words
2. **Debounce Layout**: Debounce layout recalculation on data changes
3. **Use CSS Transitions**: Prefer CSS over JS animations
4. **Memoization**: Memoize color calculations
5. **Virtual Words**: For 3D mode, only render visible words

---

## Future Enhancements (未來增強)

1. **Sentiment Clustering**: Group words by sentiment regions
2. **Time Animation**: Show word evolution over time
3. **Word Connections**: Draw lines between related words
4. **Export**: Save word cloud as image
5. **Custom Filters**: Filter by sentiment range or frequency
6. **Multiple Terms**: Compare word clouds for different terms
7. **VR Support**: Full 3D experience in VR headset

---

## Resources (資源)

- [d3-cloud Documentation](https://github.com/jasondavies/d3-cloud)
- [D3 Color Scales](https://d3js.org/d3-scale-chromatic)
- [React + D3 Patterns](https://2019.wattenberger.com/blog/react-and-d3)
- [Three.js for 3D](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

---

**Status**: Ready for Implementation
**Estimated Time**: 4-6 hours
**Priority**: Medium
**Dependencies**: M6-Backend-Cooccurrence (co-occurrence data endpoint)
