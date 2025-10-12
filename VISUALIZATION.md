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

**Tasks**:
1. Install visualization libraries:
   ```bash
   npm install recharts d3 react-wordcloud
   npm install date-fns
   ```
2. Create folder structure:
   ```
   src/
   ├── components/
   │   └── visualizations/
   │       ├── SentimentPieChart.jsx
   │       ├── SentimentTimeline.jsx
   │       ├── SentimentHeatmap.jsx
   │       ├── WordCloud.jsx
   │       └── MetricsCards.jsx
   ├── utils/
   │   ├── chartHelpers.js
   │   └── dataProcessing.js
   └── styles/
       └── charts.css
   ```
3. Create helper functions in `chartHelpers.js`:
   - Color schemes for sentiment
   - Data formatting utilities
   - Chart configuration defaults
4. Test imports work

**Commit**:
```bash
git add src/ package.json
git commit -m "feat: install Recharts, D3, and chart dependencies

Completed: M1-Viz-Setup
- Installed recharts, d3, react-wordcloud, date-fns
- Created visualizations folder structure
- Added chartHelpers utility
- Defined color schemes for sentiment types
- Created charts.css for styling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

### Milestone 2: M2-Viz-PieChart
**Goal**: Create sentiment distribution pie chart with Chinese labels

**Tasks**:
1. Create `src/components/visualizations/SentimentPieChart.jsx`
2. Use Recharts PieChart component
3. Implement Chinese labels (正面/負面/中性)
4. Add color coding:
   - 正面 (Positive): Green (#4CAF50)
   - 負面 (Negative): Red (#F44336)
   - 中性 (Neutral): Grey (#9E9E9E)
5. Show percentages on chart
6. Add tooltip with counts
7. Make it responsive
8. Use React.memo() for performance

**Component Interface**:
```javascript
<SentimentPieChart
  data={[
    { sentiment: 'positive', count: 45 },
    { sentiment: 'negative', count: 20 },
    { sentiment: 'neutral', count: 35 }
  ]}
  width={400}
  height={300}
/>
```

**Commit**:
```bash
git add src/components/visualizations/ src/utils/
git commit -m "feat: add SentimentPieChart with Chinese labels

Completed: M2-Viz-PieChart
- Created SentimentPieChart component
- Implemented Recharts PieChart
- Added Chinese sentiment labels
- Color-coded by sentiment type
- Added percentage display
- Made responsive
- Optimized with React.memo

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

### Milestone 3: M3-Viz-Timeline
**Goal**: Create sentiment timeline chart with date-fns locale

**Tasks**:
1. Create `src/components/visualizations/SentimentTimeline.jsx`
2. Use Recharts LineChart or AreaChart
3. Configure date-fns with zh-TW locale:
   ```javascript
   import { format } from 'date-fns';
   import { zhTW } from 'date-fns/locale';

   const formattedDate = format(new Date(date), 'M月d日', { locale: zhTW });
   ```
4. Add multiple lines for each sentiment type
5. Add date range selector
6. Add zoom functionality
7. Show data points on hover
8. Make responsive

**Component Interface**:
```javascript
<SentimentTimeline
  data={[
    { date: '2025-01-01', positive: 45, negative: 20, neutral: 35 },
    { date: '2025-01-02', positive: 50, negative: 15, neutral: 35 }
  ]}
  dateRange={{ start: '2025-01-01', end: '2025-01-31' }}
/>
```

**Commit**:
```bash
git add src/components/visualizations/ src/utils/
git commit -m "feat: add SentimentTimeline with date-fns locale

Completed: M3-Viz-Timeline
- Created SentimentTimeline component
- Implemented multi-line chart
- Integrated date-fns with zh-TW locale
- Added date formatting (M月d日)
- Implemented date range filtering
- Added interactive tooltips
- Made responsive with auto-scaling

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

### Milestone 4: M4-Viz-Advanced
**Goal**: Create heatmap and word cloud components

**Tasks - Heatmap**:
1. Create `src/components/visualizations/SentimentHeatmap.jsx`
2. Use D3 or custom grid implementation
3. Color scale: Red (negative) → Yellow (neutral) → Green (positive)
4. Show sentiment by category/topic
5. Add hover effects
6. Chinese category labels

**Tasks - Word Cloud**:
1. Create `src/components/visualizations/WordCloud.jsx`
2. Use react-wordcloud library
3. Configure Chinese font (Noto Sans TC)
4. Size by frequency
5. Color by sentiment
6. Add click handlers
7. Filter by sentiment type

**Tasks - Metrics Cards**:
1. Create `src/components/visualizations/MetricsCards.jsx`
2. Use Material-UI Cards
3. Display key metrics:
   - 總分析數 (Total Analyzed)
   - 平均分數 (Average Score)
   - 正面比率 (Positive Rate)
   - 負面比率 (Negative Rate)
4. Format numbers with Chinese locale:
   ```javascript
   const formatted = number.toLocaleString('zh-TW');
   ```
5. Add loading skeletons
6. Make responsive grid

**Commit**:
```bash
git add src/components/visualizations/ src/utils/ src/styles/
git commit -m "feat: add SentimentHeatmap, WordCloud, and MetricsCards

Completed: M4-Viz-Advanced
- Created SentimentHeatmap with D3
- Implemented color scale (red-yellow-green)
- Created WordCloud with Chinese font support
- Configured Noto Sans TC font
- Added MetricsCards with MUI
- Formatted numbers with zh-TW locale
- All components responsive

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

### Milestone 5: M5-Viz-Polish
**Goal**: Optimize performance and add interactive features

**Tasks**:
1. Optimize all components with React.memo()
2. Add useMemo() for expensive calculations
3. Implement virtual scrolling for large datasets
4. Add chart animations
5. Add export to PNG functionality
6. Add print-friendly styles
7. Add data sampling for large datasets:
   ```javascript
   const sampleData = (data, maxPoints = 100) => {
     if (data.length <= maxPoints) return data;
     const step = Math.floor(data.length / maxPoints);
     return data.filter((_, i) => i % step === 0);
   };
   ```
8. Test performance with 10,000+ data points
9. Add loading states for all charts
10. Add error boundaries

**Commit**:
```bash
git add src/components/visualizations/ src/utils/
git commit -m "feat: optimize chart rendering and add interactions

Completed: M5-Viz-Polish
- Optimized with React.memo and useMemo
- Added data sampling for large datasets
- Implemented chart animations
- Added export to PNG functionality
- Created error boundaries for charts
- Added loading skeletons
- Tested with 10,000+ data points
- Performance improvements achieved

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin viz-dev
```

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

## Resources
- [Recharts Documentation](https://recharts.org/)
- [D3.js Documentation](https://d3js.org/)
- [react-wordcloud](https://github.com/chrisrzhou/react-wordcloud)
- [date-fns Documentation](https://date-fns.org/)
