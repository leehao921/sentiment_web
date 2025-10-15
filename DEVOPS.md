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

**Status**: ✅ Complete (Commits: `4bccf63`, `7c1dd31`)

### Milestone 2: M2-DevOps-Frontend-Deploy
**Goal**: Deploy frontend to Vercel with custom domain support

**Status**: ⬜️ Pending

### Milestone 3: M3-DevOps-Backend-Deploy
**Goal**: Deploy backend to Google Cloud Run

**Status**: ✅ Complete (Commit: `3112d4c`)

### Milestone 4: M4-DevOps-Domain
**Goal**: Configure custom domain with SSL

**Status**: ⬜️ Pending

### Milestone 5: M5-DevOps-Monitor
**Goal**: Setup monitoring, analytics, and error tracking

**Status**: ⬜️ Pending

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
