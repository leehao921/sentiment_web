import { api, sentimentAPI } from './api';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('API Service - M3 Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('api instance is created', () => {
    expect(api).toBeDefined();
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.defaults.timeout).toBe(10000);
  });

  test('sentimentAPI has all required methods', () => {
    expect(sentimentAPI.getAll).toBeDefined();
    expect(sentimentAPI.getByType).toBeDefined();
    expect(sentimentAPI.getByDateRange).toBeDefined();
    expect(sentimentAPI.getAnalytics).toBeDefined();
    expect(sentimentAPI.getFiles).toBeDefined();
  });

  test('getAll endpoint is correct', async () => {
    const mockData = { data: { data: [] } };
    api.get = jest.fn().mockResolvedValue(mockData);

    await sentimentAPI.getAll();
    expect(api.get).toHaveBeenCalledWith('/sentiment-data');
  });

  test('getByType endpoint is correct', async () => {
    const mockData = { data: { data: [] } };
    api.get = jest.fn().mockResolvedValue(mockData);

    await sentimentAPI.getByType('positive');
    expect(api.get).toHaveBeenCalledWith('/sentiment-data?type=positive');
  });

  test('getByDateRange endpoint is correct', async () => {
    const mockData = { data: { data: [] } };
    api.get = jest.fn().mockResolvedValue(mockData);

    await sentimentAPI.getByDateRange('2025-01-01', '2025-01-31');
    expect(api.get).toHaveBeenCalledWith('/sentiment-data?startDate=2025-01-01&endDate=2025-01-31');
  });

  test('getAnalytics endpoint is correct', async () => {
    const mockData = { data: {} };
    api.get = jest.fn().mockResolvedValue(mockData);

    await sentimentAPI.getAnalytics();
    expect(api.get).toHaveBeenCalledWith('/analytics');
  });

  test('getFiles endpoint is correct', async () => {
    const mockData = { data: { files: [] } };
    api.get = jest.fn().mockResolvedValue(mockData);

    await sentimentAPI.getFiles();
    expect(api.get).toHaveBeenCalledWith('/files');
  });
});
