import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = {
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
};

const SentimentPieChart = React.memo(({ data }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => [
    { name: t('sentiment.positive'), value: data.positive, sentiment: 'positive' },
    { name: t('sentiment.negative'), value: data.negative, sentiment: 'negative' },
    { name: t('sentiment.neutral'), value: data.neutral, sentiment: 'neutral' },
  ], [data, t]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
});

export default SentimentPieChart;