# Claude Configuration for Sentiment Analysis Dashboard

## Quick Reference
- **Project**: Sentiment Analysis Visualization Dashboard
- **Language**: Chinese Traditional (繁體中文)
- **Backend API**: https://sentiment-api-944971472305.asia-east1.run.app
- **Frontend URL**: https://sharp-bivouac-472901-s8.web.app
- **GCP Project**: sharp-bivouac-472901-s8

## Development Commands
```bash
# Frontend
npm start              # Start dev server
npm run build          # Build for production
npm test              # Run tests

# Backend (in server/)
node index.js         # Start backend server locally

# Deployment
firebase deploy       # Deploy to Firebase Hosting
```

## Project Structure
```
firstweb/
├── src/
│   ├── components/
│   │   └── visualizations/    # Chart components (COMPLETED)
│   ├── context/               # Context API for state
│   ├── pages/                 # Dashboard, NotFound
│   ├── services/              # API integration
│   ├── i18n/                  # Internationalization
│   └── App.jsx
├── server/                    # Backend (deployed to Cloud Run)
└── public/
```

## Current Status

### Completed
- ✅ Backend API deployed to Cloud Run
- ✅ Visualization components built:
  - SentimentPieChart.jsx
  - SentimentTimeline.jsx
  - SentimentHeatmap.jsx
  - WordCloud.jsx
  - MetricsCards.jsx
- ✅ i18n configuration with Traditional Chinese
- ✅ API service layer (src/services/api.js)
- ✅ Firebase Hosting setup

### In Progress
- 🔄 Integrating visualizations into Dashboard
- 🔄 Creating SentimentContext for state management

### Planned
- 📋 Semantic Co-occurrence Network Graph (語義共現網絡圖)
  - Force-directed graph for "暈船" word associations
  - Interactive filtering and exploration
  - D3.js force simulation implementation

### Issues Found
1. Dashboard.jsx only shows basic text - no graphs rendered
2. SentimentContext.jsx doesn't exist (only test file)
3. Missing dependencies: @mui/material, d3-cloud

## Implementation Plan

### Step 1: Create SentimentContext
Create `src/context/SentimentContext.jsx` to:
- Fetch data from backend API
- Manage loading/error states
- Provide data to all components

### Step 2: Update Dashboard
Modify `src/pages/Dashboard.jsx` to:
- Import all visualization components
- Use SentimentContext to get data
- Render all charts with proper data

### Step 3: Install Dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled d3-cloud
```

### Step 4: Build & Deploy
```bash
npm run build
firebase deploy
```

## Data Flow
```
GCP Storage → Backend API → Frontend Context → Dashboard → Visualizations
```

## Backend API Endpoints
- `GET /api/sentiment-data` - Get all sentiment data
- `GET /api/analytics` - Get analytics aggregation
- `GET /api/files` - List available data files

## Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_URL=https://sentiment-api-944971472305.asia-east1.run.app/api
```

## Next Steps
1. Create SentimentContext with data fetching
2. Wire up Dashboard with all visualization components
3. Install missing dependencies
4. Test locally
5. Build and deploy to Firebase
6. Implement Semantic Co-occurrence Graph (M6-Viz-NetworkGraph)

## Future Enhancements

### Semantic Co-occurrence Network Graph
**Component**: `SemanticCooccurrenceGraph.jsx`

**Purpose**: Visualize "暈船" and related word associations (曖昧, 心動, 失落, etc.)

**Implementation Approach**:

1. **Backend Data Processing** (Backend Developer):
   - Create `/api/cooccurrence` endpoint
   - Calculate word co-occurrence from sentiment data
   - Return format:
   ```json
   {
     "nodes": [
       {"id": "暈船", "label": "暈船", "size": 100, "sentiment": "neutral", "group": "center"},
       {"id": "曖昧", "label": "曖昧", "size": 80, "sentiment": "positive", "group": "related"}
     ],
     "edges": [
       {"source": "暈船", "target": "曖昧", "weight": 45, "sentiment": "positive"}
     ]
   }
   ```

2. **Frontend Implementation** (Visualization Developer):
   - Install D3 force simulation: `npm install d3-force d3-selection d3-zoom`
   - Build React component with D3 integration
   - Use SVG for rendering (or Canvas for performance)

3. **Visual Features**:
   - Central node "暈船" with pulsing animation (CSS keyframes)
   - Node colors based on sentiment (positive=green, negative=red, neutral=blue)
   - Edge thickness proportional to co-occurrence weight
   - Interactive zoom/pan with d3-zoom
   - Threshold slider to filter weak associations
   - Hover tooltips showing statistics

4. **Performance Optimization**:
   - Limit initial nodes to top 50 associations
   - Use canvas rendering if >100 nodes
   - Implement lazy loading for secondary associations
   - Debounce threshold slider changes

**Dependencies**:
```bash
npm install d3-force d3-selection d3-zoom d3-scale
```

**File Structure**:
```
src/components/visualizations/
├── SemanticCooccurrenceGraph.jsx     # Main component
├── NetworkControls.jsx                # Slider and filters
└── NetworkTooltip.jsx                 # Hover tooltip
```

**Integration Points**:
- Requires backend endpoint: Backend Developer (M6-Backend-Cooccurrence)
- Context integration: Frontend Developer
- Visualization implementation: Visualization Developer (M6-Viz-NetworkGraph)
