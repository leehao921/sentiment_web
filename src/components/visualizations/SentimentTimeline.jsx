import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// Dark High-Tech Neon Color Palette
const COLORS = {
  positive: '#4FC3F7',  // Electric Blue
  negative: '#FF00CC',  // Magenta
  neutral: '#FFB100',   // Amber
};

const SentimentTimeline = React.memo(({ data }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => data.map(item => ({
    date: format(new Date(item.date), 'M月d日', { locale: zhTW }),
    [t('sentiment.positive')]: item.positive,
    [t('sentiment.negative')]: item.negative,
    [t('sentiment.neutral')]: item.neutral,
  })), [data, t]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '2px solid var(--neon-cyan)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          boxShadow: 'var(--shadow-lg), var(--glow-cyan)',
          fontFamily: 'var(--font-primary)'
        }}>
          <p style={{
            color: 'var(--text-accent)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {label}
          </p>
          {payload.map((item, index) => (
            <p key={index} style={{
              color: item.color,
              fontSize: '1rem',
              fontWeight: 500,
              marginBottom: '0.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 'var(--spacing-lg)'
            }}>
              <span>{item.name}:</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                textShadow: `0 0 8px ${item.color}`
              }}>
                {item.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, stroke, payload, dataKey } = props;

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={stroke}
          stroke={stroke}
          strokeWidth={2}
          filter={`drop-shadow(0 0 6px ${stroke})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="var(--bg-primary)"
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <defs>
          <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.positive} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.positive} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.negative} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.negative} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.neutral} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.neutral} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--holo-border)"
          strokeOpacity={0.3}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-primary)' }}
          tickLine={{ stroke: 'var(--holo-border)' }}
          axisLine={{ stroke: 'var(--holo-border)' }}
        />
        <YAxis
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-primary)' }}
          tickLine={{ stroke: 'var(--holo-border)' }}
          axisLine={{ stroke: 'var(--holo-border)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontFamily: 'var(--font-primary)',
            fontSize: '0.875rem',
            paddingTop: '1rem'
          }}
          iconType="line"
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey={t('sentiment.positive')}
          stroke={COLORS.positive}
          strokeWidth={3}
          dot={<CustomDot />}
          activeDot={{ r: 8, strokeWidth: 3, filter: `drop-shadow(0 0 8px ${COLORS.positive})` }}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-out"
          fill="url(#colorPositive)"
        />
        <Line
          type="monotone"
          dataKey={t('sentiment.negative')}
          stroke={COLORS.negative}
          strokeWidth={3}
          dot={<CustomDot />}
          activeDot={{ r: 8, strokeWidth: 3, filter: `drop-shadow(0 0 8px ${COLORS.negative})` }}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-out"
          fill="url(#colorNegative)"
        />
        <Line
          type="monotone"
          dataKey={t('sentiment.neutral')}
          stroke={COLORS.neutral}
          strokeWidth={3}
          dot={<CustomDot />}
          activeDot={{ r: 8, strokeWidth: 3, filter: `drop-shadow(0 0 8px ${COLORS.neutral})` }}
          isAnimationActive={true}
          animationDuration={1000}
          animationEasing="ease-out"
          fill="url(#colorNeutral)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

SentimentTimeline.displayName = 'SentimentTimeline';

export default SentimentTimeline;
