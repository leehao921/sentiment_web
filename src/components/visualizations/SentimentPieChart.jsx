import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

// Dark High-Tech Neon Color Palette
const COLORS = {
  positive: '#4FC3F7',  // Electric Blue
  negative: '#FF00CC',  // Magenta
  neutral: '#FFB100',   // Amber
};

const GLOW_COLORS = {
  positive: 'rgba(79, 195, 247, 0.6)',
  negative: 'rgba(255, 0, 204, 0.6)',
  neutral: 'rgba(255, 177, 0, 0.6)',
};

const SentimentPieChart = React.memo(({ data }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => [
    { name: t('sentiment.positive'), value: data.positive, sentiment: 'positive' },
    { name: t('sentiment.negative'), value: data.negative, sentiment: 'negative' },
    { name: t('sentiment.neutral'), value: data.neutral, sentiment: 'neutral' },
  ].filter(item => item.value > 0), [data, t]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: `2px solid ${COLORS[item.payload.sentiment]}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px ${GLOW_COLORS[item.payload.sentiment]}`,
          fontFamily: 'var(--font-primary)'
        }}>
          <p style={{
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.25rem'
          }}>
            {item.name}
          </p>
          <p style={{
            color: COLORS[item.payload.sentiment],
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            textShadow: `0 0 10px ${GLOW_COLORS[item.payload.sentiment]}`
          }}>
            {item.value.toLocaleString('zh-TW')}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <defs>
          {Object.entries(COLORS).map(([sentiment, color]) => (
            <filter key={`glow-${sentiment}`} id={`glow-${sentiment}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feFlood floodColor={color} floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={renderCustomLabel}
          labelLine={{
            stroke: 'var(--holo-border)',
            strokeWidth: 2
          }}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))',
            fontFamily: 'var(--font-primary)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.sentiment]}
              stroke={COLORS[entry.sentiment]}
              strokeWidth={2}
              filter={`url(#glow-${entry.sentiment})`}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontFamily: 'var(--font-primary)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}
          iconType="circle"
          formatter={(value, entry) => (
            <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

SentimentPieChart.displayName = 'SentimentPieChart';

export default SentimentPieChart;
