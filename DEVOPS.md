# DevOps Engineer Guide (部署工程師指南)

## Role Overview
You are responsible for CI/CD, deployment configuration, domain setup, and production monitoring.

## Your Branch
```bash
git checkout -b devops
```

## File Ownership
**You ONLY work on these files:**
- `.github/workflows/` directory
- `vercel.json` or `netlify.toml`
- `Dockerfile` (if needed)
- `.env.example`
- `.gitignore`
- `README.md`
- `docs/` directory
- Deployment configuration files

**DO NOT modify:**
- `server/` core logic (Backend's responsibility)
- `src/` components (Frontend/Viz's responsibility)
- Only update deployment configs, not business logic

## Project Configuration
- **GCP Project**: `sharp-bivouac-472901-s8`
- **GCS Bucket**: `gs://sharp-bivouac-472901-s8-docs/rawdata/`
- **Backend**: Google Cloud Run
- **Frontend**: Vercel or Netlify
- **Region**: asia-east1 (Taiwan)

## Milestones

### Milestone 1: M1-DevOps-CI
**Goal**: Setup Git workflow for automated testing

**Tasks**:
1. Create `.github/workflows/ci.yml`:
   ```yaml
   name: CI Pipeline

   on:
     push:
       branches: [ main, backend-dev, frontend-dev, viz-dev ]
     pull_request:
       branches: [ main ]

   jobs:
     test-backend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install dependencies
           run: cd server && npm install
         - name: Run tests
           run: cd server && npm test

     test-frontend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install
         - name: Run tests
           run: npm test
         - name: Build
           run: npm run build
   ```

2. Create `.gitignore` if not exists:
   ```
   node_modules/
   build/
   dist/
   .env
   .env.local
   .DS_Store
   *.log
   ```

3. Create `.env.example`:
   ```
   # Backend
   PORT=3001
   GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8
   GCS_BUCKET=sharp-bivouac-472901-s8-docs

   # Frontend
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Test workflow runs successfully

**Commit**:
```bash
git add .github/ .gitignore .env.example
git commit -m "ci: add Git Actions for automated testing

Completed: M1-DevOps-CI
- Created CI workflow for backend and frontend
- Added automated testing on push
- Configured Node.js 18 environment
- Created .env.example template
- Updated .gitignore for security

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

### Milestone 2: M2-DevOps-Frontend-Deploy
**Goal**: Deploy frontend to Vercel with custom domain support

**Tasks**:
1. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/static/(.*)",
         "dest": "/static/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "env": {
       "REACT_APP_API_URL": "@api_url"
     }
   }
   ```

2. Add build script to package.json if missing:
   ```json
   {
     "scripts": {
       "build": "react-scripts build",
       "vercel-build": "npm run build"
     }
   }
   ```

3. Deploy to Vercel (locally first):
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

4. Add environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: (will be added after backend deploy)

5. Document deployment URL

**Commit**:
```bash
git add vercel.json package.json
git commit -m "deploy: configure Vercel for frontend deployment

Completed: M2-DevOps-Frontend-Deploy
- Created vercel.json configuration
- Configured static build settings
- Set up routing for SPA
- Deployed to Vercel
- Documented deployment process

Frontend URL: https://sentiment-app-xxx.vercel.app

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

### Milestone 3: M3-DevOps-Backend-Deploy
**Goal**: Deploy backend to Google Cloud Run

**Tasks**:
1. Create `server/Dockerfile`:
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .

   EXPOSE 3001

   CMD ["node", "index.js"]
   ```

2. Create `server/.dockerignore`:
   ```
   node_modules
   npm-debug.log
   .env
   .git
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy sentiment-api \
     --source ./server \
     --region asia-east1 \
     --platform managed \
     --allow-unauthenticated \
     --project sharp-bivouac-472901-s8 \
     --set-env-vars GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8,GCS_BUCKET=sharp-bivouac-472901-s8-docs
   ```

4. Get deployment URL:
   ```bash
   gcloud run services describe sentiment-api \
     --region asia-east1 \
     --format='value(status.url)'
   ```

5. Update CORS in backend to allow frontend domain

6. Update Vercel env variable with backend URL

**Commit**:
```bash
git add server/Dockerfile server/.dockerignore
git commit -m "deploy: configure Cloud Run for backend

Completed: M3-DevOps-Backend-Deploy
- Created Dockerfile for backend
- Deployed to Cloud Run (asia-east1)
- Configured environment variables
- Set up CORS for frontend
- Updated frontend env with backend URL

Backend URL: https://sentiment-api-xxx-uc.a.run.app

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

### Milestone 4: M4-DevOps-Domain
**Goal**: Configure custom domain with SSL

**Tasks**:
1. Document domain setup process in `docs/DEPLOYMENT.md`:
   ```markdown
   # Deployment Guide

   ## Frontend (Vercel)
   1. Go to Vercel Dashboard > Project > Settings > Domains
   2. Add custom domain: sentiment.yourdomain.com
   3. Add DNS records at your registrar:
      - Type: CNAME
      - Name: sentiment
      - Value: cname.vercel-dns.com
   4. Wait for DNS propagation (5-60 minutes)
   5. SSL certificate will be auto-generated

   ## Backend (Cloud Run)
   1. Map custom domain:
      ```bash
      gcloud run domain-mappings create \
        --service sentiment-api \
        --domain api.sentiment.yourdomain.com \
        --region asia-east1
      ```
   2. Add DNS records shown in output
   3. Wait for SSL certificate provisioning
   ```

2. Create SSL certificate verification script:
   ```bash
   #!/bin/bash
   # scripts/check-ssl.sh
   echo "Checking SSL certificates..."
   curl -I https://sentiment.yourdomain.com
   curl -I https://api.sentiment.yourdomain.com
   ```

3. Update CORS and environment variables with custom domains

4. Test both frontend and backend on custom domains

**Commit**:
```bash
git add docs/ scripts/
git commit -m "config: add custom domain DNS configuration

Completed: M4-DevOps-Domain
- Documented domain setup process
- Configured DNS records
- Set up SSL certificates
- Updated CORS for custom domains
- Created SSL verification script
- Tested production URLs

Frontend: https://sentiment.yourdomain.com
Backend: https://api.sentiment.yourdomain.com

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

### Milestone 5: M5-DevOps-Monitor
**Goal**: Setup monitoring, analytics, and error tracking

**Tasks**:
1. Add Google Analytics to frontend:
   ```javascript
   // src/utils/analytics.js
   import ReactGA from 'react-ga4';

   export const initGA = () => {
     ReactGA.initialize('G-XXXXXXXXXX');
   };

   export const logPageView = () => {
     ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
   };
   ```

2. Set up Sentry for error tracking:
   ```bash
   npm install @sentry/react
   ```

   ```javascript
   // src/index.js
   import * as Sentry from '@sentry/react';

   Sentry.init({
     dsn: 'your-sentry-dsn',
     environment: process.env.REACT_APP_ENVIRONMENT,
   });
   ```

3. Configure Cloud Run monitoring:
   ```bash
   gcloud run services update sentiment-api \
     --region asia-east1 \
     --cpu-throttling \
     --max-instances 10
   ```

4. Create monitoring dashboard in GCP Console:
   - Request count
   - Latency
   - Error rate
   - CPU usage
   - Memory usage

5. Set up log aggregation:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sentiment-api" --limit 50
   ```

6. Create alerts for:
   - High error rate (>5%)
   - High latency (>2s)
   - High CPU usage (>80%)

7. Document monitoring in `docs/MONITORING.md`

**Commit**:
```bash
git add src/utils/ docs/ package.json
git commit -m "feat: add monitoring with Google Analytics and Sentry

Completed: M5-DevOps-Monitor
- Integrated Google Analytics (GA4)
- Set up Sentry error tracking
- Configured Cloud Run monitoring
- Created GCP monitoring dashboard
- Set up log aggregation
- Configured alerting rules
- Documented monitoring setup

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

## Deployment Commands Reference

### Frontend (Vercel)
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variable
vercel env add REACT_APP_API_URL production

# View logs
vercel logs
```

### Backend (Cloud Run)
```bash
# Deploy
gcloud run deploy sentiment-api \
  --source ./server \
  --region asia-east1 \
  --project sharp-bivouac-472901-s8

# View logs
gcloud run services logs read sentiment-api \
  --region asia-east1

# Update service
gcloud run services update sentiment-api \
  --region asia-east1 \
  --set-env-vars KEY=VALUE

# List services
gcloud run services list

# Describe service
gcloud run services describe sentiment-api \
  --region asia-east1
```

### Domain Management
```bash
# Verify DNS propagation
dig sentiment.yourdomain.com
dig api.sentiment.yourdomain.com

# Check SSL certificate
curl -I https://sentiment.yourdomain.com
openssl s_client -connect sentiment.yourdomain.com:443
```

## Environment Variables

### Frontend (Vercel)
```
REACT_APP_API_URL=https://api.sentiment.yourdomain.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (Cloud Run)
```
GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8
GCS_BUCKET=sharp-bivouac-472901-s8-docs
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://sentiment.yourdomain.com
```

## Monitoring Dashboards

### Google Cloud Console
1. Go to Cloud Run > sentiment-api > Metrics
2. Monitor:
   - Request count
   - Request latency
   - Container instance count
   - CPU utilization
   - Memory utilization

### Vercel Dashboard
1. Go to Project > Analytics
2. Monitor:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Build times

### Sentry Dashboard
1. Go to sentry.io > Project
2. Monitor:
   - Error rate
   - Affected users
   - Error types
   - Performance issues

## Troubleshooting

### Issue: Deployment fails
**Solution**: Check build logs
```bash
vercel logs  # for frontend
gcloud run services logs read sentiment-api --region asia-east1
```

### Issue: CORS errors in production
**Solution**: Update backend CORS configuration
```javascript
cors({
  origin: ['https://sentiment.yourdomain.com']
})
```

### Issue: DNS not propagating
**Solution**: Check DNS records
```bash
dig sentiment.yourdomain.com
# Wait 5-60 minutes for propagation
```

### Issue: SSL certificate not working
**Solution**: Verify domain ownership and wait for provisioning

## Integration with Other Roles

### Backend Developer Provides:
- Dockerfile
- Environment variables needed
- Health check endpoint
- Deployment instructions

### Frontend Developer Provides:
- Build command
- Build output directory
- Environment variables needed
- Static file requirements

### DevOps Provides to All:
- Deployment URLs
- Environment variable values
- Monitoring dashboard access
- Deployment documentation

## Development Workflow

### Daily Tasks
```bash
# Check build status
git checkout devops
git pull origin main

# Monitor production
gcloud run services logs read sentiment-api --region asia-east1
vercel logs

# Check metrics
# Visit GCP Console and Vercel Dashboard
```

### Completing a Milestone
```bash
git add .github/ docs/ scripts/ *.json *.yml
git commit -m "deploy/ci/config: milestone description

Completed: M#-DevOps-MilestoneName
- Task 1
- Task 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin devops
```

## Security Checklist

- [ ] All sensitive data in environment variables (not in code)
- [ ] .gitignore includes .env files
- [ ] CORS configured with specific domains (not *)
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting enabled on backend
- [ ] Service account has minimum required permissions
- [ ] Secrets stored in Secret Manager (if needed)
- [ ] Regular security audits scheduled

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Git Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud DNS](https://cloud.google.com/dns/docs)
- [Sentry Documentation](https://docs.sentry.io/)
