# Backend Developer Guide (後端開發者指南)

## Role Overview
You are responsible for the backend API server that connects to Google Cloud and serves sentiment analysis data to the frontend.

## Your Branch
```bash
git checkout -b backend-dev
```

## File Ownership
**You ONLY work on these files:**
- `server/` directory (all files)
- `server/index.js`
- `server/routes/`
- `server/controllers/`
- `server/middleware/`
- `server/utils/`
- `server/package.json`
- `server/README.md`

**DO NOT modify:**
- `src/` directory (Frontend's responsibility)
- `.github/` workflows (DevOps's responsibility)
- `public/` directory (Frontend's responsibility)

## Project Configuration
- **Google Cloud Project ID**: `sharp-bivouac-472901-s8`
- **Cloud Storage Bucket**: `gs://sharp-bivouac-472901-s8-docs/rawdata/`
- **Backend Port**: `3001`
- **API Base URL**: `http://localhost:3001/api`

## Milestones

### Milestone 1: M1-Backend-Setup
**Goal**: Initialize Express server with CORS and basic structure

**Status**: ✅ Complete (Commit: `f58c928`)

### Milestone 2: M2-Backend-GCP-Integration
**Goal**: Connect to Google Cloud Storage and list JSON files

**Status**: ✅ Complete (Commit: `4e2a376`)

### Milestone 3: M3-Backend-Data-Processing
**Goal**: Read and process JSON data from bucket

**Status**: ✅ Complete (Commit: `4e2a376`)


### Milestone 4: M4-Backend-API-Complete
**Goal**: Complete all API endpoints with filtering and aggregation

**Status**: ✅ Complete (Commit: `1c5ce2c`)


### Milestone 5: M5-Backend-Deploy
**Goal**: Deploy backend to Google Cloud Run

**Status**: ✅ Complete (Commit: `3112d4c`)


## API Endpoints Reference

### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "2025-01-15T10:30:00Z" }
```

### List Files
```
GET /api/files
Response: { "files": ["file1.json"], "count": 1 }
```

### Get Sentiment Data
```
GET /api/sentiment-data
GET /api/sentiment-data?type=positive
GET /api/sentiment-data?startDate=2025-01-01&endDate=2025-01-15
Response: { "data": [...], "total": 100 }
```

### Get Analytics
```
GET /api/analytics
Response: { "distribution": {...}, "averageScore": 0.65, "totalAnalyzed": 1000 }
```

## Development Workflow

### Daily Start
```bash
# Sync with main
git checkout backend-dev
git pull origin main

# Start development server
cd server
npm run dev
```

### Testing
```bash
# Test health check
curl http://localhost:3001/health

# Test sentiment data
curl http://localhost:3001/api/sentiment-data

# Test with filtering
curl "http://localhost:3001/api/sentiment-data?type=positive"

# Test analytics
curl http://localhost:3001/api/analytics
```

### Completing a Milestone
```bash
# Add all changes
git add server/

# Commit with milestone format
git commit -m "feat: milestone description

Completed: M#-Backend-MilestoneName
- Task 1
- Task 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to your branch
git push origin backend-dev

# Create PR
gh pr create --title "Backend: M# Complete" \
  --body "See BACKEND.md for details"
```

## Environment Variables

### Local Development
```bash
# .env file (DO NOT COMMIT)
PORT=3001
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8
GCS_BUCKET=sharp-bivouac-472901-s8-docs
```

### Production (Cloud Run)
Set in Cloud Run configuration:
```
GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8
GCS_BUCKET=sharp-bivouac-472901-s8-docs
NODE_ENV=production
```

## Troubleshooting

### Issue: Cannot connect to GCS
**Solution**: Verify gcloud auth
```bash
gcloud auth application-default login
gcloud config set project sharp-bivouac-472901-s8
```

### Issue: CORS errors
**Solution**: Add frontend URL to CORS whitelist
```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### Issue: Rate limit too strict
**Solution**: Adjust rate limit in middleware
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## Integration with Other Roles

### Frontend Developer Needs:
- API base URL (provide after M5-Backend-Deploy)
- API endpoint documentation
- Response data format
- Error codes and messages

### DevOps Engineer Needs:
- Dockerfile
- Environment variables list
- Health check endpoint URL
- Deployment region preference

## Resources
- [Express.js Documentation](https://expressjs.com/)
- [Google Cloud Storage Node.js Client](https://cloud.google.com/nodejs/docs/reference/storage/latest)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
