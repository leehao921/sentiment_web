
import { SENTIMENT_COLORS, formatChineseDate, formatChineseNumber, sampleData } from './chartHelpers';

describe('chartHelpers', () => {
  it('should export SENTIMENT_COLORS', () => {
    expect(SENTIMENT_COLORS).toBeDefined();
  });

  it('should format Chinese date', () => {
    const date = new Date('2025-10-12');
    const formattedDate = formatChineseDate(date);
    expect(formattedDate).toBe('10月12日');
  });

  it('should format Chinese number', () => {
    const number = 12345.67;
    const formattedNumber = formatChineseNumber(number);
    expect(formattedNumber).toBe('12,345.67');
  });

  it('should sample data', () => {
    const data = Array.from({ length: 200 }, (_, i) => i);
    const sampledData = sampleData(data, 100);
    expect(sampledData.length).toBe(100);
  });
});
