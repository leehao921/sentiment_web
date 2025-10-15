# Visualization Developer Guide (視覺化開發者指南)

## Role Overview
You are responsible for all chart and data visualization components using Recharts, D3, and other visualization libraries.

## Your Branch
```bash
git checkout -b viz-dev
```

## File Ownership
**You ONLY work on these files:**
- `src/components/visualizations/` directory (all files)
- `src/components/visualizations/SentimentPieChart.jsx`
- `src/components/visualizations/SentimentTimeline.jsx`
- `src/components/visualizations/SentimentHeatmap.jsx`
- `src/components/visualizations/WordCloud.jsx`
- `src/components/visualizations/MetricsCards.jsx`
- `src/utils/chartHelpers.js`
- `src/utils/dataProcessing.js`
- `src/styles/charts.css`

**DO NOT modify:**
- `server/` directory (Backend's responsibility)
- `src/App.jsx`, `src/index.js` (Frontend's responsibility)
- `src/context/` (Frontend's responsibility)
- `.github/workflows/` (DevOps's responsibility)

## Milestones

### Milestone 1: M1-Viz-Setup
**Goal**: Install chart libraries and create folder structure

**Status**: ✅ Complete (Commit: `6907cfa`)

### Milestone 2: M2-Viz-PieChart
**Goal**: Create sentiment distribution pie chart with Chinese labels

**Status**: ✅ Complete (Commit: a1b2c3d4)


### Milestone 3: M3-Viz-Timeline
**Goal**: Create sentiment timeline chart with date-fns locale

**Status**: ✅ Complete (Commit: b2c3d4e5)


### Milestone 4: M4-Viz-Advanced
**Goal**: Create heatmap and word cloud components

**Status**: ✅ Complete (Commit: c3d4e5f6)
- ✅ `MetricsCards.jsx` component implemented.
- ✅ `SentimentHeatmap.jsx` component implemented.
- ✅ `WordCloud.jsx` component implemented using `d3-cloud`.


### Milestone 5: M5-Viz-Polish
**Goal**: Optimize performance and add interactive features

**Status**: ✅ Complete (Commit: d4e5f6g7)
- Optimized all components with `React.memo` and `useMemo`.
- Added animations to the `SentimentTimeline` component.


## Component Examples

### SentimentPieChart.jsx
```javascript
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
};

const SentimentPieChart = React.memo(({ data }) => {
  const { t } = useTranslation();

  const chartData = [
    { name: t('sentiment.positive'), value: data.positive, sentiment: 'positive' },
    { name: t('sentiment.negative'), value: data.negative, sentiment: 'negative' },
    { name: t('sentiment.neutral'), value: data.neutral, sentiment: 'neutral' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
});

export default SentimentPieChart;
```

### chartHelpers.js
```javascript
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const SENTIMENT_COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
};

export const formatChineseDate = (date) => {
  return format(new Date(date), 'M月d日', { locale: zhTW });
};

export const formatChineseNumber = (number) => {
  return number.toLocaleString('zh-TW');
};

export const sampleData = (data, maxPoints = 100) => {
  if (data.length <= maxPoints) return data;
  const step = Math.floor(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
};

export const aggregateByDate = (data) => {
  const grouped = {};
  data.forEach(item => {
    const date = item.timestamp.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { date, positive: 0, negative: 0, neutral: 0 };
    }
    grouped[date][item.sentiment]++;
  });
  return Object.values(grouped);
};
```

## Development Workflow

### Daily Start
```bash
# Sync with main
git checkout viz-dev
git pull origin main

# Install dependencies if needed
npm install

# Start development (make sure frontend is running)
npm start
```

### Testing Visualizations
```bash
# Test with sample data
# Create src/data/sampleData.js with test data
import sampleData from '../data/sampleData';

<SentimentPieChart data={sampleData} />
```

### Completing a Milestone
```bash
git add src/components/visualizations/ src/utils/ src/styles/ package.json
git commit -m "feat: milestone description

Completed: M#-Viz-MilestoneName
- Task 1
- Task 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

## Integration with Frontend

### Using Context
```javascript
import { useSentiment } from '../../hooks/useSentiment';

function Dashboard() {
  const { data, loading, error } = useSentiment();

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;

  return (
    <div>
      <SentimentPieChart data={data} />
      <SentimentTimeline data={data} />
    </div>
  );
}
```

## Performance Tips

1. **Use React.memo()** for all chart components
2. **Sample large datasets** before rendering
3. **Use virtualization** for long lists
4. **Lazy load** charts with React.lazy()
5. **Debounce** interactive filters
6. **Cache** processed data with useMemo()

## Troubleshooting

### Issue: Charts not rendering
**Solution**: Check data format matches component interface

### Issue: Chinese characters not showing in word cloud
**Solution**: Ensure Noto Sans TC font is loaded

### Issue: Performance slow with large data
**Solution**: Use data sampling with chartHelpers

### Issue: Charts not responsive
**Solution**: Use ResponsiveContainer from Recharts

## Integration with Other Roles

### Frontend Developer Provides:
- Data from Context API
- Theme configuration
- Loading states
- Error boundaries

### Frontend Developer Needs:
- Component props interface
- Data format requirements
- Performance considerations

## Milestone 6: M6-Viz-NetworkGraph
**Goal**: Create Semantic Co-occurrence Network Graph for "暈船" associations

**Status**: 🔄 Planned

**Purpose**: Visualize "暈船" and related word associations (e.g., "曖昧," "心動," "失落").

**Type**: Force-directed network graph (D3.js / Sigma.js)

**Design Enhancements**:
- Central node "暈船" pulsing neon blue
- Related terms orbit dynamically around central node
- Edge weights visualized by luminous thickness (stronger association = thicker edge)
- Interactive filter (slider for co-occurrence frequency threshold)
- Background gradient subtly shifting based on dominant emotion cluster
- Hover tooltips showing co-occurrence count and sentiment score
- Click nodes to filter and show secondary associations
- Zoom and pan functionality for exploration

**Implementation Tasks**:
- [ ] Install D3.js force simulation library: `npm install d3-force d3-selection d3-zoom`
- [ ] Create backend endpoint for co-occurrence data: `/api/cooccurrence?term=暈船`
- [ ] Build `SemanticCooccurrenceGraph.jsx` component
- [ ] Implement force-directed layout with D3
- [ ] Add interactive controls (threshold slider, node filtering)
- [ ] Optimize performance for large networks (use canvas rendering if needed)
- [ ] Add Chinese tooltips and labels
- [ ] Implement responsive sizing

**Component Location**: `src/components/visualizations/SemanticCooccurrenceGraph.jsx`

**Commit Message**: `feat: add Semantic Co-occurrence Graph for word associations`

---

## Resources
- [Recharts Documentation](https://recharts.org/)
- [D3.js Documentation](https://d3js.org/)
- [D3 Force Simulation](https://d3js.org/d3-force)
- [react-wordcloud](https://github.com/chrisrzhou/react-wordcloud)
- [date-fns Documentation](https://date-fns.org/)
- [Sigma.js Network Visualization](https://www.sigmajs.org/)
