# Claude Configuration for Sentiment Analysis Dashboard

## Project Overview
A sentiment analysis visualization dashboard that connects to Google Cloud JSON data and presents insights through interactive graphs and charts. Deployed on a custom domain.

**Language**: Chinese Traditional (繁體中文)

## Bash Commands
- npm start: Start development server
- npm run build: Build for production
- npm test: Run tests
- npm run lint: Run ESLint
- npm run type-check: Run TypeScript type checking (if using TypeScript)
- npm run preview: Preview production build locally

## Google Cloud Integration

### Setup with Google Cloud CLI (Recommended)
You already have Google Cloud CLI installed. Use it for authentication:

1. **Verify gcloud CLI installation:**
   ```bash
   gcloud --version
   ```

2. **Check current authentication:**
   ```bash
   gcloud auth list
   gcloud config list project
   ```

3. **Set your project:**
   ```bash
   gcloud config set project sharp-bivouac-472901-s8
   ```

4. **Authenticate Application Default Credentials:**
   ```bash
   gcloud auth application-default login
   ```
   This creates credentials that your backend can use automatically.

### Backend API with gcloud CLI
Create Express server in `/server` directory that uses gcloud CLI credentials:

**server/index.js:**
```javascript
const express = require('express');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
app.use(cors());
app.use(express.json());

// Uses Application Default Credentials from gcloud CLI
const bigquery = new BigQuery();
const storage = new Storage();
const firestore = new Firestore();

// Fetch sentiment data from BigQuery
app.get('/api/sentiment-data', async (req, res) => {
  try {
    const query = `
      SELECT * FROM \`your-dataset.your-table\`
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
    const [rows] = await bigquery.query({ query });
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Fetch from Firestore
app.get('/api/sentiment-firestore', async (req, res) => {
  try {
    const snapshot = await firestore.collection('sentiment-data').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ data });
  } catch (error) {
    console.error('Error fetching from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Fetch JSON from Cloud Storage
app.get('/api/sentiment-storage', async (req, res) => {
  try {
    const bucket = storage.bucket('sharp-bivouac-472901-s8-docs');
    const [files] = await bucket.getFiles({ prefix: 'rawdata/' });

    // Read all JSON files in the rawdata folder
    const allData = [];
    for (const file of files) {
      if (file.name.endsWith('.json')) {
        const [contents] = await file.download();
        const jsonData = JSON.parse(contents.toString());
        allData.push(jsonData);
      }
    }

    res.json({ data: allData, count: allData.length });
  } catch (error) {
    console.error('Error fetching from Storage:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Install backend dependencies:**
```bash
cd server
npm init -y
npm install express cors @google-cloud/bigquery @google-cloud/storage @google-cloud/firestore
```

**Run backend locally:**
```bash
node server/index.js
```

### Data Fetching Options

#### Option 1: BigQuery
Best for structured data and complex queries:
```bash
# Query data directly from terminal
gcloud bigquery query --use_legacy_sql=false \
  'SELECT * FROM `your-dataset.your-table` LIMIT 10'

# Export to JSON
bq extract --destination_format=NEWLINE_DELIMITED_JSON \
  your-dataset.your-table \
  gs://your-bucket/sentiment-data.json
```

#### Option 2: Cloud Storage
Best for static JSON files:
```bash
# List files in your bucket
gsutil ls gs://sharp-bivouac-472901-s8-docs/rawdata/

# Download all JSON files
gsutil -m cp gs://sharp-bivouac-472901-s8-docs/rawdata/*.json ./data/

# Download specific file
gsutil cp gs://sharp-bivouac-472901-s8-docs/rawdata/sentiment-data.json ./data/

# Upload new data
gsutil cp ./data/sentiment-data.json gs://sharp-bivouac-472901-s8-docs/rawdata/
```

#### Option 3: Firestore
Best for real-time data:
```bash
# Use Firestore through backend API or Firebase SDK
```

### Environment Configuration
No `.env` file needed for local development with gcloud CLI!
For production deployment, set these variables:

**For backend deployment (Vercel, Render, Railway):**
```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

**For frontend (React):**
```
REACT_APP_API_URL=https://your-backend-api.com
```

### Security with gcloud CLI
- Credentials stored securely by gcloud CLI at `~/.config/gcloud/`
- Never commit service account keys to git
- Backend uses Application Default Credentials automatically
- Frontend only calls your backend API, never directly accesses GCP
- Use Cloud IAM to restrict permissions

## Sentiment Analysis Visualization

### Required Libraries
```bash
npm install recharts chart.js react-chartjs-2 d3
npm install @mui/material @emotion/react @emotion/styled
npm install axios date-fns
npm install i18next react-i18next
```

### Internationalization (i18n) Setup
1. Create `src/i18n/config.js`:
   ```javascript
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import zh_TW from './locales/zh_TW.json';

   i18n
     .use(initReactI18next)
     .init({
       resources: {
         zh_TW: { translation: zh_TW }
       },
       lng: 'zh_TW',
       fallbackLng: 'zh_TW',
       interpolation: {
         escapeValue: false
       }
     });

   export default i18n;
   ```

2. Create `src/i18n/locales/zh_TW.json`:
   ```json
   {
     "title": "情感分析儀表板",
     "sentiment": {
       "positive": "正面",
       "negative": "負面",
       "neutral": "中性",
       "distribution": "情感分布",
       "timeline": "情感趨勢",
       "score": "情感分數"
     },
     "metrics": {
       "total": "總分析數",
       "average": "平均分數",
       "positive_rate": "正面比率",
       "negative_rate": "負面比率"
     },
     "filters": {
       "date_range": "日期範圍",
       "category": "類別",
       "apply": "套用",
       "reset": "重設"
     },
     "charts": {
       "word_cloud": "詞雲圖",
       "heatmap": "熱力圖",
       "pie_chart": "圓餅圖",
       "line_chart": "折線圖"
     },
     "loading": "載入中...",
     "error": "發生錯誤",
     "no_data": "無資料"
   }
   ```

3. Import in `src/index.js` or `src/App.js`:
   ```javascript
   import './i18n/config';
   ```

4. Use in components:
   ```javascript
   import { useTranslation } from 'react-i18next';

   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('title')}</h1>;
   }
   ```

### Visualization Components
Create in `src/components/visualizations/`:

1. **SentimentPieChart.jsx**
   - Display sentiment distribution (正面/負面/中性)
   - Use Recharts PieChart with custom colors
   - Show percentages and counts
   - Labels in Traditional Chinese

2. **SentimentTimeline.jsx**
   - Line chart showing sentiment trends over time
   - Use Recharts LineChart or AreaChart
   - Filter by date range
   - Use date-fns with zh-TW locale for date formatting

3. **SentimentHeatmap.jsx**
   - Show sentiment intensity by category/topic
   - Use D3 or custom grid component
   - Color scale from red (negative) to green (positive)
   - Chinese category labels

4. **WordCloud.jsx**
   - Display most frequent Chinese words/phrases
   - Use react-wordcloud library with Chinese font support
   - Filter by sentiment type
   - Font recommendation: Noto Sans TC or Microsoft JhengHei

5. **MetricsCards.jsx**
   - Display key metrics (總分析數, 平均情感分數, etc.)
   - Use Material-UI Cards
   - Real-time updates
   - Number formatting with Chinese locale

### Data Structure
Expected JSON format from Google Cloud:
```json
{
  "data": [
    {
      "id": "unique-id",
      "text": "Sample text content",
      "sentiment": "positive|negative|neutral",
      "score": 0.85,
      "timestamp": "2025-01-15T10:30:00Z",
      "category": "product-review",
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}
```

## Code Style
- Use functional components with hooks
- Destructure props and state
- Use TypeScript for better type safety
- Follow React best practices for performance
- Use async/await for data fetching
- Implement error boundaries for chart components
- All UI text must use i18next translation keys
- Use Traditional Chinese for all user-facing content
- Support Chinese character encoding (UTF-8)

## Component Guidelines
- Place components in `src/components/`
- Visualizations in `src/components/visualizations/`
- Place utility functions in `src/utils/`
- Use PascalCase for component names
- Export components as default exports
- Use React.memo() for chart components to prevent unnecessary re-renders

## State Management
- Use Context API for global sentiment data
- Create `src/context/SentimentContext.jsx`
- Implement loading states and error handling
- Cache fetched data in localStorage (with expiry)

## Testing
- Use React Testing Library
- Test data fetching and error states
- Mock Google Cloud API responses
- Test chart rendering with sample data
- Place tests alongside components

## Deployment Options

### Option 1: Vercel (Recommended for React)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel login`
3. Deploy: `vercel --prod`
4. Custom domain:
   - Go to Project Settings > Domains
   - Add your domain (e.g., sentimentapp.yourdomain.com)
   - Update DNS records at your domain registrar:
     - Type: CNAME
     - Name: sentimentapp (or @)
     - Value: cname.vercel-dns.com
   - Wait for DNS propagation (5-60 minutes)

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify login`
3. Deploy: `netlify deploy --prod`
4. Custom domain:
   - Go to Site Settings > Domain Management
   - Add custom domain
   - Update DNS:
     - Type: A Record
     - Name: @ or subdomain
     - Value: 75.2.60.5
   - Or use CNAME to your-site.netlify.app

### Option 3: Google Cloud Platform (Firebase Hosting)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```
Custom domain:
- Firebase Console > Hosting > Connect Domain
- Follow DNS setup instructions

### Option 4: GitHub Pages
1. Install: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`
4. Custom domain: Add CNAME file in public/ folder

## Environment Variables

### Local Development (using gcloud CLI)
No `.env` file needed! gcloud CLI handles authentication automatically.

**Optional frontend `.env` for API endpoint:**
```
REACT_APP_API_URL=http://localhost:3001
```

### Production Deployment

**Frontend (React) - `.env.production`:**
```
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_ENVIRONMENT=production
```

**Backend deployment environment variables:**

For Vercel/Netlify/Railway, add in dashboard:
```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=3001
```

For Google Cloud Run (no credentials needed):
```
GOOGLE_CLOUD_PROJECT=your-project-id
```

**Deployment platform configuration:**
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Build & Deploy > Environment
- Railway: Variables tab
- Google Cloud Run: Uses built-in service account (easiest!)

### Using gcloud CLI for deployment
```bash
# Deploy backend to Cloud Run (automatically uses your gcloud credentials)
gcloud run deploy sentiment-api \
  --source ./server \
  --region asia-east1 \
  --allow-unauthenticated

# Get the deployed URL
gcloud run services describe sentiment-api --region asia-east1 --format='value(status.url)'
```

## Security Best Practices
1. Never commit Google Cloud credentials
2. Use backend API to proxy Google Cloud requests
3. Implement rate limiting on API endpoints
4. Use HTTPS only (enforce in hosting platform)
5. Add CORS restrictions in backend
6. Sanitize user inputs if allowing filters/search
7. Use environment variables for all sensitive data

## Performance Optimization
- Lazy load chart components with React.lazy()
- Implement virtual scrolling for large datasets
- Use chart data sampling for large time ranges
- Optimize bundle size: `npm run build -- --analyze`
- Enable compression in hosting platform
- Use CDN for static assets

## Monitoring & Analytics
- Add Google Analytics or Plausible
- Monitor API usage in Google Cloud Console
- Set up error tracking (Sentry)
- Monitor Core Web Vitals

## Role-Based Development Workflow

### Project Roles & Responsibilities

This project uses a role-based workflow to prevent file conflicts and ensure organized development. Each role has specific file ownership and milestones.

#### Role 1: Backend Developer (後端開發者)
**File Ownership:**
- `server/` directory (all files)
- `server/index.js`
- `server/routes/`
- `server/controllers/`
- `server/utils/`
- `server/package.json`

**Responsibilities:**
- Google Cloud integration (BigQuery, Storage, Firestore)
- API endpoint development
- Data processing and transformation
- Authentication and security
- Server deployment configuration

**Branch:** `backend-dev`

**Milestones:**
1. **M1-Backend-Setup**: Initialize Express server with CORS
   - Commit message: `feat: setup Express server with CORS and basic routes`

2. **M2-Backend-GCP-Integration**: Connect to Google Cloud Storage
   - Commit message: `feat: integrate GCP Storage API for rawdata access`

3. **M3-Backend-Data-Processing**: Process JSON data from bucket
   - Commit message: `feat: add data processing for sentiment analysis JSON`

4. **M4-Backend-API-Complete**: Complete all API endpoints
   - Commit message: `feat: complete sentiment data API endpoints`

5. **M5-Backend-Deploy**: Deploy backend to Cloud Run
   - Commit message: `deploy: backend deployed to Google Cloud Run`

#### Role 2: Frontend Developer (前端開發者)
**File Ownership:**
- `src/` directory (except `/src/components/visualizations/`)
- `src/App.jsx`
- `src/index.js`
- `src/context/`
- `src/hooks/`
- `src/services/api.js`
- `public/index.html`
- `package.json`

**Responsibilities:**
- React application structure
- API integration with backend
- State management (Context API)
- Routing and navigation
- User interface layout
- Chinese localization (i18n)

**Branch:** `frontend-dev`

**Milestones:**
1. **M1-Frontend-Setup**: Initialize React app with routing
   - Commit message: `feat: setup React app with routing and basic structure`

2. **M2-Frontend-i18n**: Configure Chinese Traditional localization
   - Commit message: `feat: add i18n configuration for Traditional Chinese`

3. **M3-Frontend-API**: Connect to backend API
   - Commit message: `feat: integrate backend API service layer`

4. **M4-Frontend-Context**: Implement state management
   - Commit message: `feat: add SentimentContext for global state`

5. **M5-Frontend-Layout**: Complete main layout and navigation
   - Commit message: `feat: complete dashboard layout with Chinese UI`

#### Role 3: Visualization Developer (視覺化開發者)
**File Ownership:**
- `src/components/visualizations/` directory
- `src/components/visualizations/SentimentPieChart.jsx`
- `src/components/visualizations/SentimentTimeline.jsx`
- `src/components/visualizations/SentimentHeatmap.jsx`
- `src/components/visualizations/WordCloud.jsx`
- `src/components/visualizations/MetricsCards.jsx`
- `src/utils/chartHelpers.js`
- `src/styles/charts.css`

**Responsibilities:**
- Chart and graph components
- Data visualization with Recharts/D3
- Chart performance optimization
- Chinese word cloud implementation
- Interactive data filtering

**Branch:** `viz-dev`

**Milestones:**
1. **M1-Viz-Setup**: Install chart libraries and setup
   - Commit message: `feat: install Recharts, D3, and chart dependencies`

2. **M2-Viz-PieChart**: Create sentiment distribution pie chart
   - Commit message: `feat: add SentimentPieChart with Chinese labels`

3. **M3-Viz-Timeline**: Create sentiment timeline chart
   - Commit message: `feat: add SentimentTimeline with date-fns locale`

4. **M4-Viz-Advanced**: Create heatmap and word cloud
   - Commit message: `feat: add SentimentHeatmap and WordCloud components`

5. **M5-Viz-Polish**: Optimize performance and add interactions
   - Commit message: `feat: optimize chart rendering with React.memo`

#### Role 4: DevOps Engineer (部署工程師)
**File Ownership:**
- `.github/workflows/` directory
- `vercel.json` or `netlify.toml`
- `Dockerfile`
- `.env.example`
- `README.md`
- `CLAUDE.md`

**Responsibilities:**
- CI/CD pipeline setup
- Domain configuration
- SSL certificate management
- Monitoring and logging
- Production deployment

**Branch:** `devops`

**Milestones:**
1. **M1-DevOps-CI**: Setup GitHub Actions workflow
   - Commit message: `ci: add GitHub Actions for automated testing`

2. **M2-DevOps-Frontend-Deploy**: Deploy frontend to Vercel
   - Commit message: `deploy: configure Vercel for frontend deployment`

3. **M3-DevOps-Backend-Deploy**: Deploy backend to Cloud Run
   - Commit message: `deploy: configure Cloud Run for backend`

4. **M4-DevOps-Domain**: Configure custom domain
   - Commit message: `config: add custom domain DNS configuration`

5. **M5-DevOps-Monitor**: Setup monitoring and analytics
   - Commit message: `feat: add monitoring with Google Analytics and Sentry`

### Git Workflow

#### Branch Strategy
```
main (production)
├── backend-dev (Backend Developer)
├── frontend-dev (Frontend Developer)
├── viz-dev (Visualization Developer)
└── devops (DevOps Engineer)
```

#### Workflow Steps

1. **Create your role branch:**
   ```bash
   git checkout -b backend-dev  # or frontend-dev, viz-dev, devops
   ```

2. **Work on your assigned files only:**
   - Backend: Only modify `server/` directory
   - Frontend: Only modify `src/` (except `src/components/visualizations/`)
   - Visualization: Only modify `src/components/visualizations/`
   - DevOps: Only modify config and deployment files

3. **Commit when milestone is complete:**
   ```bash
   git add .
   git commit -m "feat: milestone description

   Completed: M1-Backend-Setup
   - Initialized Express server
   - Added CORS middleware
   - Created basic route structure

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"

   git push origin backend-dev
   ```

4. **Create Pull Request:**
   ```bash
   gh pr create --title "Backend: M1-Backend-Setup Complete" \
     --body "## Milestone: M1-Backend-Setup

   ### Changes
   - Initialized Express server with TypeScript
   - Added CORS configuration
   - Created basic API route structure

   ### Testing
   - [x] Server starts successfully
   - [x] CORS headers present
   - [x] Health check endpoint works

   ### Next Steps
   - M2-Backend-GCP-Integration

   🤖 Generated with [Claude Code](https://claude.com/claude-code)"
   ```

5. **Merge to main after review:**
   ```bash
   # After PR approval
   git checkout main
   git merge backend-dev
   git push origin main
   git checkout backend-dev
   git merge main  # Keep branch updated
   ```

### Conflict Prevention Rules

1. **Never edit files outside your role's ownership**
2. **Always work on your dedicated branch**
3. **Pull from main before starting new milestone:**
   ```bash
   git checkout backend-dev
   git pull origin main
   ```
4. **Communicate when shared files need updates**
5. **Use PR reviews before merging to main**

### Milestone Tracking

Create a `MILESTONES.md` file to track progress:

```markdown
# Project Milestones

## Backend Developer
- [x] M1-Backend-Setup (2025-01-12) - Commit: abc123
- [x] M2-Backend-GCP-Integration (2025-01-13) - Commit: def456
- [ ] M3-Backend-Data-Processing
- [ ] M4-Backend-API-Complete
- [ ] M5-Backend-Deploy

## Frontend Developer
- [x] M1-Frontend-Setup (2025-01-12) - Commit: ghi789
- [ ] M2-Frontend-i18n
- [ ] M3-Frontend-API
- [ ] M4-Frontend-Context
- [ ] M5-Frontend-Layout

## Visualization Developer
- [ ] M1-Viz-Setup
- [ ] M2-Viz-PieChart
- [ ] M3-Viz-Timeline
- [ ] M4-Viz-Advanced
- [ ] M5-Viz-Polish

## DevOps Engineer
- [ ] M1-DevOps-CI
- [ ] M2-DevOps-Frontend-Deploy
- [ ] M3-DevOps-Backend-Deploy
- [ ] M4-DevOps-Domain
- [ ] M5-DevOps-Monitor
```

### Automated Git Commit Script

Create `scripts/commit-milestone.sh`:

```bash
#!/bin/bash
# Usage: ./scripts/commit-milestone.sh "M1-Backend-Setup" "setup Express server"

MILESTONE=$1
DESCRIPTION=$2
ROLE=$(git branch --show-current)

git add .
git commit -m "feat: ${DESCRIPTION}

Completed: ${MILESTONE}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✓ Committed ${MILESTONE} on branch ${ROLE}"
git push origin ${ROLE}
echo "✓ Pushed to remote"
```

Make it executable:
```bash
chmod +x scripts/commit-milestone.sh
```

Use it:
```bash
./scripts/commit-milestone.sh "M2-Backend-GCP-Integration" "integrate GCP Storage API"
```

### Integration Points

When roles need to coordinate:

1. **Frontend ↔ Backend**: API contract defined in `API.md`
2. **Frontend ↔ Visualization**: Props interface in `src/types/chartProps.ts`
3. **Backend ↔ DevOps**: Environment variables in `.env.example`

### Daily Sync Workflow

```bash
# Start of day - sync with main
git checkout backend-dev
git pull origin main

# Work on milestone
# ... make changes ...

# End of milestone - commit and push
./scripts/commit-milestone.sh "M2-Backend-GCP-Integration" "complete GCP integration"

# Create PR
gh pr create --title "Backend: M2 Complete" --body "See MILESTONES.md"
```

## Custom Domain Setup Checklist
- [ ] Purchase domain from registrar (Namecheap, GoDaddy, etc.)
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Deploy website to hosting platform
- [ ] Add custom domain in hosting platform dashboard
- [ ] Update DNS records at domain registrar
- [ ] Wait for DNS propagation (check with: dig yourdomain.com)
- [ ] Verify SSL certificate is active (https://)
- [ ] Test website on custom domain
- [ ] Set up www redirect if needed

## Useful Commands

### Google Cloud CLI Commands
```bash
# Check current project
gcloud config get-value project

# List available projects
gcloud projects list

# Switch project
gcloud config set project YOUR_PROJECT_ID

# Test BigQuery
gcloud bigquery query --use_legacy_sql=false \
  'SELECT * FROM `your-dataset.your-table` LIMIT 5'

# List Cloud Storage buckets
gsutil ls

# Download data from storage
gsutil cp gs://your-bucket/sentiment-data.json ./

# Check authentication
gcloud auth list

# Application default credentials
gcloud auth application-default login
```

### Development & Testing
```bash
# Check DNS propagation
dig yourdomain.com

# Test backend API connection
curl -X GET http://localhost:3001/api/sentiment-data

# Test production API
curl -X GET https://your-api-url.com/api/sentiment-data

# Check build size
npm run build && ls -lh build/static/js/

# Local HTTPS testing
HTTPS=true npm start

# Run backend server
node server/index.js

# Run both frontend and backend concurrently
npm start & node server/index.js
```

## Chinese Language Specific Configuration

### Font Setup
1. Add to `public/index.html`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
   ```

2. Update CSS (in `src/index.css` or `src/App.css`):
   ```css
   body {
     font-family: 'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC',
                  'Heiti TC', sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   ```

### Date & Number Formatting
Install localization utilities:
```bash
npm install date-fns
```

Use in components:
```javascript
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// Format dates
const formattedDate = format(new Date(), 'PPP', { locale: zhTW });
// Output: 2025年1月15日

// Format numbers
const number = 1234567.89;
const formatted = number.toLocaleString('zh-TW');
// Output: 1,234,567.89
```

### Material-UI Chinese Localization
```javascript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { zhTW } from '@mui/material/locale';

const theme = createTheme({}, zhTW);

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your components */}
    </ThemeProvider>
  );
}
```

### Meta Tags for Chinese
Add to `public/index.html`:
```html
<html lang="zh-TW">
<head>
  <meta charset="utf-8" />
  <meta name="description" content="情感分析儀表板 - 數據視覺化平台" />
  <meta name="keywords" content="情感分析,數據分析,視覺化,儀表板" />
  <title>情感分析儀表板</title>
</head>
```

## Resources
- [Recharts Documentation](https://recharts.org/)
- [Google Cloud Node.js Client](https://cloud.google.com/nodejs/docs/reference)
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [i18next Documentation](https://www.i18next.com/)
- [date-fns Locale Support](https://date-fns.org/docs/Locale)
- [Material-UI Localization](https://mui.com/material-ui/guides/localization/)
