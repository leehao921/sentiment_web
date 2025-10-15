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

**Status**: ✅ Complete (Commit: `57121de`)

### Milestone 2: M2-Frontend-i18n
**Goal**: Configure Chinese Traditional localization

**Status**: ✅ Complete (Commit: `ae7d451`)

### Milestone 3: M3-Frontend-API
**Goal**: Connect to backend API

**Status**: ✅ Complete (Commit: `bfca4f2`)

### Milestone 4: M4-Frontend-Context
**Goal**: Implement state management with Context API

**Status**: ✅ Complete (Commit: `6109d6f`)

### Milestone 5: M5-Frontend-Layout
**Goal**: Complete main layout and navigation with Chinese UI

**Status**: ✅ Complete (Commit: `6109d6f`)

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
