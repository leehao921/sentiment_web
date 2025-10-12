# Frontend Developer Guide (前端開發者指南)

## Role Overview
You are responsible for the React application interface, i18n localization, and API integration with the backend.

## Your Branch
```bash
git checkout -b frontend-dev
```

## File Ownership
**You ONLY work on these files:**
- `src/` directory (EXCEPT `src/components/visualizations/`)
- `src/App.jsx`
- `src/index.js`
- `src/context/`
- `src/hooks/`
- `src/services/api.js`
- `src/i18n/`
- `src/layouts/`
- `src/pages/`
- `public/index.html`
- `public/favicon.ico`
- `package.json` (frontend dependencies)

**DO NOT modify:**
- `server/` directory (Backend's responsibility)
- `src/components/visualizations/` (Visualization Developer's responsibility)
- `.github/workflows/` (DevOps's responsibility)

## Milestones

### Milestone 1: M1-Frontend-Setup
**Goal**: Initialize React app with routing and basic structure

**Tasks**:
1. Verify React app is initialized
2. Install routing:
   ```bash
   npm install react-router-dom
   ```
3. Create folder structure:
   ```
   src/
   ├── components/
   ├── pages/
   ├── layouts/
   ├── context/
   ├── hooks/
   ├── services/
   └── utils/
   ```
4. Create `src/App.jsx` with router
5. Create basic pages:
   - `src/pages/Dashboard.jsx`
   - `src/pages/NotFound.jsx`
6. Create layout: `src/layouts/MainLayout.jsx`
7. Test routing works

**Commit**:
```bash
git add src/ package.json
git commit -m "feat: setup React app with routing and basic structure

Completed: M1-Frontend-Setup
- Installed react-router-dom
- Created folder structure
- Implemented basic routing
- Created Dashboard and NotFound pages
- Added MainLayout component

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin frontend-dev
```

### Milestone 2: M2-Frontend-i18n
**Goal**: Configure Chinese Traditional localization

**Tasks**:
1. Install i18n:
   ```bash
   npm install i18next react-i18next
   ```
2. Create `src/i18n/config.js`
3. Create `src/i18n/locales/zh_TW.json` with translations:
   ```json
   {
     "title": "情感分析儀表板",
     "nav": {
       "dashboard": "儀表板",
       "analytics": "分析"
     },
     "sentiment": {
       "positive": "正面",
       "negative": "負面",
       "neutral": "中性"
     },
     "loading": "載入中...",
     "error": "發生錯誤"
   }
   ```
4. Import i18n in `src/index.js`
5. Update HTML lang attribute in `public/index.html`:
   ```html
   <html lang="zh-TW">
   ```
6. Add Google Fonts for Chinese:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
   ```
7. Update CSS with Chinese fonts
8. Test translations in Dashboard

**Commit**:
```bash
git add src/ public/ package.json
git commit -m "feat: add i18n configuration for Traditional Chinese

Completed: M2-Frontend-i18n
- Installed i18next and react-i18next
- Created i18n configuration
- Added zh_TW translations
- Configured Chinese fonts (Noto Sans TC)
- Updated HTML meta tags for Chinese
- Tested translations in Dashboard page

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin frontend-dev
```

### Milestone 3: M3-Frontend-API
**Goal**: Connect to backend API

**Tasks**:
1. Install axios:
   ```bash
   npm install axios
   ```
2. Create `src/services/api.js`:
   ```javascript
   import axios from 'axios';

   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

   export const api = axios.create({
     baseURL: API_BASE_URL,
     timeout: 10000,
   });

   export const sentimentAPI = {
     getAll: () => api.get('/sentiment-data'),
     getByType: (type) => api.get(`/sentiment-data?type=${type}`),
     getAnalytics: () => api.get('/analytics'),
   };
   ```
3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```
4. Add error handling
5. Test API calls
6. Create loading states

**Commit**:
```bash
git add src/ .env.example package.json
git commit -m "feat: integrate backend API service layer

Completed: M3-Frontend-API
- Installed axios for HTTP requests
- Created API service layer
- Configured API base URL
- Added error handling
- Created .env configuration
- Tested connection with backend

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin frontend-dev
```

### Milestone 4: M4-Frontend-Context
**Goal**: Implement state management with Context API

**Tasks**:
1. Create `src/context/SentimentContext.jsx`:
   ```javascript
   import React, { createContext, useState, useEffect } from 'react';
   import { sentimentAPI } from '../services/api';

   export const SentimentContext = createContext();

   export const SentimentProvider = ({ children }) => {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const fetchData = async () => {
       try {
         setLoading(true);
         const response = await sentimentAPI.getAll();
         setData(response.data.data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };

     useEffect(() => {
       fetchData();
     }, []);

     return (
       <SentimentContext.Provider value={{ data, loading, error, fetchData }}>
         {children}
       </SentimentContext.Provider>
     );
   };
   ```
2. Wrap App with SentimentProvider
3. Create custom hook: `src/hooks/useSentiment.js`
4. Add data caching with localStorage
5. Test context in Dashboard

**Commit**:
```bash
git add src/
git commit -m "feat: add SentimentContext for global state

Completed: M4-Frontend-Context
- Created SentimentContext with Provider
- Implemented data fetching logic
- Added loading and error states
- Created useSentiment custom hook
- Implemented localStorage caching
- Wrapped App with context provider

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin frontend-dev
```

### Milestone 5: M5-Frontend-Layout
**Goal**: Complete main layout and navigation with Chinese UI

**Tasks**:
1. Install Material-UI:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material
   ```
2. Configure MUI theme with Chinese locale:
   ```javascript
   import { createTheme, ThemeProvider } from '@mui/material/styles';
   import { zhTW } from '@mui/material/locale';

   const theme = createTheme({}, zhTW);
   ```
3. Create navigation bar with Chinese labels
4. Create sidebar (optional)
5. Add loading spinner component
6. Add error boundary component
7. Create responsive layout
8. Style with CSS modules or styled-components
9. Test on mobile and desktop

**Commit**:
```bash
git add src/ package.json
git commit -m "feat: complete dashboard layout with Chinese UI

Completed: M5-Frontend-Layout
- Installed Material-UI with Chinese locale
- Created responsive navigation bar
- Implemented MainLayout component
- Added loading spinner
- Created error boundary
- Styled with MUI components
- Tested responsive design

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin frontend-dev
```

## Development Workflow

### Daily Start
```bash
# Sync with main
git checkout frontend-dev
git pull origin main

# Start development server
npm start
```

### Testing Locally
```bash
# Make sure backend is running first
cd ../server && npm run dev

# In another terminal, start frontend
npm start

# Open browser to http://localhost:3000
```

### Completing a Milestone
```bash
# Add changes
git add src/ public/ package.json

# Commit with milestone format
git commit -m "feat: milestone description

Completed: M#-Frontend-MilestoneName
- Task 1
- Task 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push origin frontend-dev

# Create PR (after merge)
git checkout main
git merge frontend-dev
git push origin main
```

## Key Files to Create

### src/App.jsx
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { zhTW } from '@mui/material/locale';
import { SentimentProvider } from './context/SentimentContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './i18n/config';

const theme = createTheme({}, zhTW);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SentimentProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </SentimentProvider>
    </ThemeProvider>
  );
}

export default App;
```

### src/services/api.js
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const sentimentAPI = {
  getAll: () => api.get('/sentiment-data'),
  getByType: (type) => api.get(`/sentiment-data?type=${type}`),
  getByDateRange: (startDate, endDate) =>
    api.get(`/sentiment-data?startDate=${startDate}&endDate=${endDate}`),
  getAnalytics: () => api.get('/analytics'),
};
```

## Environment Variables

### .env (Local Development)
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### .env.production
```
REACT_APP_API_URL=https://sentiment-api-xxx.run.app/api
REACT_APP_ENVIRONMENT=production
```

## Integration with Other Roles

### Backend Developer Provides:
- API base URL
- Endpoint documentation
- Response data format
- Error codes

### Visualization Developer Needs:
- Context hook (useSentiment)
- Data format from API
- Loading and error states
- Theme configuration

### DevOps Engineer Needs:
- Build command: `npm run build`
- Build output directory: `build/`
- Environment variables list

## Troubleshooting

### Issue: CORS error
**Solution**: Backend needs to allow frontend origin
```javascript
// Backend should have:
cors({
  origin: 'http://localhost:3000'
})
```

### Issue: API connection refused
**Solution**: Check backend is running
```bash
curl http://localhost:3001/health
```

### Issue: Chinese fonts not loading
**Solution**: Check Google Fonts link in public/index.html

## Resources
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Material-UI](https://mui.com/)
- [i18next](https://www.i18next.com/)
- [Axios](https://axios-http.com/)
