# Claude Configuration for Sentiment Analysis Dashboard

## Quick Reference
- **Project**: Sentiment Analysis Visualization Dashboard
- **Language**: Chinese Traditional (繁體中文)
- **Backend API**: https://sentiment-api-455948041791.asia-east1.run.app
- **Backend Revision**: sentiment-api-00010-j2m (deployed 2025-10-15)
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

### Completed ✅ (All Milestones: 23/24 - 96%)
- ✅ Backend API deployed to Cloud Run (revision: sentiment-api-00010-j2m)
  - All endpoints working: /api/sentiment-data, /api/analytics, /api/cooccurrence
  - 512 records processed from GCS bucket
  - Co-occurrence endpoint: 51 nodes, 50 edges (threshold=5)
  - 5-minute timeout, 512Mi memory allocation
- ✅ Visualization components built (all with dark high-tech neon design):
  - SentimentPieChart.jsx (neon colors with SVG glow)
  - SentimentTimeline.jsx (multi-line with gradients)
  - SentimentHeatmap.jsx (D3 gradient scale)
  - WordCloud.jsx (Noto Sans TC font)
  - MetricsCards.jsx (Framer Motion animations)
  - SemanticCooccurrenceGraph.jsx (D3 force simulation) ✅ NEW
- ✅ i18n configuration with Traditional Chinese
- ✅ API service layer (src/services/api.js) - Fixed endpoint paths
- ✅ Firebase Hosting setup and deployed
- ✅ SentimentContext with data fetching and caching
- ✅ Dashboard fully integrated with all visualizations
- ✅ Dark high-tech design system with neon accents

### Recent Fixes (2025-10-15) 🔧
- Fixed API endpoint configuration (removed duplicate /api prefix in baseURL)
- Updated frontend to point to correct Cloud Run service URL
- Backend redeployed to Cloud Run with improved configuration
- All endpoints tested and verified working in production

### Remaining Tasks
- ⏳ M5-DevOps-Monitor: Setup monitoring and analytics (Google Analytics, Sentry)

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
- `GET /api/sentiment-data` - Get all sentiment data (512 records)
- `GET /api/analytics` - Get analytics aggregation
- `GET /api/files` - List available data files
- `GET /api/cooccurrence?term=暈船&threshold=5` - Co-occurrence network (51 nodes, 50 edges)

## Environment Variables
```bash
# Frontend (.env) - DO NOT commit this file
REACT_APP_API_URL=https://sentiment-api-455948041791.asia-east1.run.app
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
