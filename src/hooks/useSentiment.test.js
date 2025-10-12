import React from 'react';
import { renderHook } from '@testing-library/react';
import { useSentiment } from './useSentiment';
import { SentimentProvider } from '../context/SentimentContext';
import { sentimentAPI } from '../services/api';

jest.mock('../services/api');

describe('useSentiment Hook - M4 Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSentiment());
    }).toThrow('useSentiment must be used within a SentimentProvider');

    consoleSpy.mockRestore();
  });

  test('returns context when used inside provider', () => {
    sentimentAPI.getAll.mockResolvedValue({ data: { data: [] } });

    const wrapper = ({ children }) => (
      <SentimentProvider>{children}</SentimentProvider>
    );

    const { result } = renderHook(() => useSentiment(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.fetchData).toBeDefined();
    expect(result.current.refreshData).toBeDefined();
  });
});
