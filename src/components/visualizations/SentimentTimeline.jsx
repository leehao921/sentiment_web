import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const SentimentTimeline = React.memo(({ data }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => data.map(item => ({
    date: format(new Date(item.date), 'M月d日', { locale: zhTW }),
    [t('sentiment.positive')]: item.positive,
    [t('sentiment.negative')]: item.negative,
    [t('sentiment.neutral')]: item.neutral,
  })), [data, t]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={t('sentiment.positive')} stroke="#4CAF50" isAnimationActive={true} animationDuration={300} />
        <Line type="monotone" dataKey={t('sentiment.negative')} stroke="#F44336" isAnimationActive={true} animationDuration={300} />
        <Line type="monotone" dataKey={t('sentiment.neutral')} stroke="#9E9E9E" isAnimationActive={true} animationDuration={300} />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default SentimentTimeline;