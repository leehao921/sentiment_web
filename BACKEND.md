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

**Tasks**:
1. Create `server/` directory
2. Initialize npm project: `cd server && npm init -y`
3. Install dependencies:
   ```bash
   npm install express cors dotenv
   npm install --save-dev nodemon
   ```
4. Create `server/index.js` with Express app
5. Add CORS middleware
6. Create health check endpoint: `GET /health`
7. Add start scripts to `package.json`

**Test**:
```bash
cd server
node index.js
curl http://localhost:3001/health
```

**Commit**:
```bash
git add server/
git commit -m "feat: setup Express server with CORS and basic routes

Completed: M1-Backend-Setup
- Initialized Express server on port 3001
- Added CORS middleware
- Created health check endpoint
- Configured nodemon for development

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin backend-dev
```

### Milestone 2: M2-Backend-GCP-Integration
**Goal**: Connect to Google Cloud Storage and list JSON files

**Tasks**:
1. Install Google Cloud dependencies:
   ```bash
   npm install @google-cloud/storage
   ```
2. Configure Application Default Credentials (use your gcloud CLI)
3. Create `server/utils/gcpClient.js` to initialize Storage client
4. Create endpoint: `GET /api/files` to list bucket files
5. Test connection to `gs://sharp-bivouac-472901-s8-docs/rawdata/`

**Test**:
```bash
curl http://localhost:3001/api/files
```

Expected response:
```json
{
  "files": ["file1.json", "file2.json"],
  "count": 2
}
```

**Commit**:
```bash
git add server/
git commit -m "feat: integrate GCP Storage API for rawdata access

Completed: M2-Backend-GCP-Integration
- Added @google-cloud/storage dependency
- Created GCP Storage client with ADC
- Implemented /api/files endpoint
- Successfully connected to bucket

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin backend-dev
```

### Milestone 3: M3-Backend-Data-Processing
**Goal**: Read and process JSON data from bucket

**Tasks**:
1. Create `server/controllers/sentimentController.js`
2. Implement function to download JSON from bucket
3. Create endpoint: `GET /api/sentiment-data`
4. Parse and combine all JSON files
5. Add data validation
6. Handle errors gracefully

**Expected Response Format**:
```json
{
  "data": [
    {
      "id": "1",
      "text": "評論內容",
      "sentiment": "positive",
      "score": 0.85,
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 100,
  "source": "gs://sharp-bivouac-472901-s8-docs/rawdata/"
}
```

**Commit**:
```bash
git add server/
git commit -m "feat: add data processing for sentiment analysis JSON

Completed: M3-Backend-Data-Processing
- Created sentiment controller
- Implemented JSON parsing from GCS
- Added data validation
- Created /api/sentiment-data endpoint

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin backend-dev
```

### Milestone 4: M4-Backend-API-Complete
**Goal**: Complete all API endpoints with filtering and aggregation

**Tasks**:
1. Add filtering endpoints:
   - `GET /api/sentiment-data?type=positive|negative|neutral`
   - `GET /api/sentiment-data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
2. Create analytics endpoint: `GET /api/analytics`
3. Add aggregation functions:
   - Calculate sentiment distribution
   - Compute average scores
   - Count by date
4. Add caching with memory cache or Redis
5. Add rate limiting middleware
6. Write API documentation

**Analytics Response Format**:
```json
{
  "distribution": {
    "positive": 45,
    "negative": 20,
    "neutral": 35
  },
  "averageScore": 0.65,
  "totalAnalyzed": 1000,
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-15"
  }
}
```

**Commit**:
```bash
git add server/
git commit -m "feat: complete sentiment data API endpoints

Completed: M4-Backend-API-Complete
- Added filtering by sentiment type
- Added date range filtering
- Created analytics aggregation endpoint
- Implemented caching layer
- Added rate limiting
- Documented all API endpoints

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin backend-dev
```

### Milestone 5: M5-Backend-Deploy
**Goal**: Deploy backend to Google Cloud Run

**Tasks**:
1. Create `server/Dockerfile`
2. Test Docker build locally
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy sentiment-api \
     --source ./server \
     --region asia-east1 \
     --allow-unauthenticated \
     --project sharp-bivouac-472901-s8
   ```
4. Get deployment URL
5. Test production endpoints
6. Update CORS to allow frontend domain
7. Document deployment process

**Commit**:
```bash
git add server/
git commit -m "deploy: backend deployed to Google Cloud Run

Completed: M5-Backend-Deploy
- Created Dockerfile for backend
- Deployed to Cloud Run (asia-east1)
- Configured production CORS
- Updated environment variables
- Tested all endpoints in production

Deployment URL: https://sentiment-api-xxx-uc.a.run.app

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin backend-dev
```

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
