# Sentiment Analysis Backend API

Backend server for the Sentiment Analysis Dashboard that connects to Google Cloud Storage.

## Tech Stack
- Node.js with Express
- Google Cloud Storage
- CORS enabled
- dotenv for environment variables

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3001
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=sharp-bivouac-472901-s8
GCS_BUCKET=sharp-bivouac-472901-s8-docs
```

3. Authenticate with Google Cloud:
```bash
gcloud auth application-default login
gcloud config set project sharp-bivouac-472901-s8
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### API Info
```
GET /api
```
Returns API information and available endpoints.

## Testing

Test the health check:
```bash
curl http://localhost:3001/health
```

## Project Structure
```
server/
├── index.js          # Main Express application
├── package.json      # Dependencies and scripts
├── .env             # Environment variables (not committed)
└── README.md        # This file
```

## Port
Default: 3001

## Environment
- Development: Uses local gcloud credentials
- Production: Uses Cloud Run service account
