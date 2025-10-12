import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SentimentProvider, SentimentContext } from './SentimentContext';
import { sentimentAPI } from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('SentimentContext - M4 Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('SentimentProvider renders children', () => {
    render(
      <SentimentProvider>
        <div>Test Child</div>
      </SentimentProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('provides initial loading state', () => {
    const TestComponent = () => {
      const context = React.useContext(SentimentContext);
      return <div>{context.loading ? 'Loading' : 'Not Loading'}</div>;
    };

    render(
      <SentimentProvider>
        <TestComponent />
      </SentimentProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('fetches data on mount', async () => {
    const mockData = [{ id: 1, sentiment: 'positive' }];
    sentimentAPI.getAll.mockResolvedValue({ data: { data: mockData } });

    const TestComponent = () => {
      const context = React.useContext(SentimentContext);
      return (
        <div>
          {context.loading && <div>Loading...</div>}
          {!context.loading && context.data.length > 0 && <div>Data Loaded</div>}
        </div>
      );
    };

    render(
      <SentimentProvider>
        <TestComponent />
      </SentimentProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Data Loaded')).toBeInTheDocument();
    });
  });

  test('handles API errors', async () => {
    sentimentAPI.getAll.mockRejectedValue(new Error('API Error'));

    const TestComponent = () => {
      const context = React.useContext(SentimentContext);
      return (
        <div>
          {context.error && <div>Error: {context.error}</div>}
        </div>
      );
    };

    render(
      <SentimentProvider>
        <TestComponent />
      </SentimentProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  test('caches data in localStorage', async () => {
    const mockData = [{ id: 1, sentiment: 'positive' }];
    sentimentAPI.getAll.mockResolvedValue({ data: { data: mockData } });

    const TestComponent = () => {
      const context = React.useContext(SentimentContext);
      return <div>{context.data.length}</div>;
    };

    render(
      <SentimentProvider>
        <TestComponent />
      </SentimentProvider>
    );

    await waitFor(() => {
      const cached = localStorage.getItem('sentimentData');
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached)).toEqual(mockData);
    });
  });
});
