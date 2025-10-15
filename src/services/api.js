import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sentiment-api-455948041791.asia-east1.run.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for initial data load from GCS
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      // Server responded with error
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received');
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Sentiment API endpoints
export const sentimentAPI = {
  // Get all sentiment data
  getAll: () => api.get('/api/sentiment-data'),

  // Get by sentiment type (positive, negative, neutral)
  getByType: (type) => api.get(`/api/sentiment-data?type=${type}`),

  // Get by date range
  getByDateRange: (startDate, endDate) =>
    api.get(`/api/sentiment-data?startDate=${startDate}&endDate=${endDate}`),

  // Get analytics aggregation
  getAnalytics: () => api.get('/api/analytics'),

  // Get files list
  getFiles: () => api.get('/api/files'),

  // Get co-occurrence network data
  getCooccurrence: (term = '暈船', threshold = 5) =>
    api.get(`/api/cooccurrence?term=${encodeURIComponent(term)}&threshold=${threshold}`),
};

export default api;
