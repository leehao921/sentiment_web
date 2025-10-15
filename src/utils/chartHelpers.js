
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const SENTIMENT_COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
};

export const formatChineseDate = (date) => {
  return format(new Date(date), 'M月d日', { locale: zhTW });
};

export const formatChineseNumber = (number) => {
  return number.toLocaleString('zh-TW');
};

export const sampleData = (data, maxPoints = 100) => {
  if (data.length <= maxPoints) return data;
  const step = Math.floor(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
};
