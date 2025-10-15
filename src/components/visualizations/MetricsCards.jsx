import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './MetricsCards.css';

const MetricsCards = React.memo(({ data }) => {
  const { t } = useTranslation();

  const metrics = useMemo(() => {
    const total = data.positive + data.negative + data.neutral;
    const positiveRate = total > 0 ? (data.positive / total) * 100 : 0;
    const negativeRate = total > 0 ? (data.negative / total) * 100 : 0;

    return [
      {
        title: t('metrics.total'),
        value: total.toLocaleString('zh-TW'),
        color: '#00FFFF', // Cyan
        icon: '📊'
      },
      {
        title: t('metrics.average'),
        value: data.averageScore.toFixed(2),
        color: '#4FC3F7', // Electric Blue
        icon: '⚡'
      },
      {
        title: t('metrics.positive_rate'),
        value: `${positiveRate.toFixed(1)}%`,
        color: '#00FF88', // Lime
        icon: '📈'
      },
      {
        title: t('metrics.negative_rate'),
        value: `${negativeRate.toFixed(1)}%`,
        color: '#FF00CC', // Magenta
        icon: '📉'
      },
    ];
  }, [data, t]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="metrics-card" sx={{
              background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
              border: '1px solid var(--holo-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-normal)',
              '&:hover': {
                borderColor: metric.color,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 48px ${metric.color}40`,
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <div className="metrics-icon" style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                  filter: `drop-shadow(0 0 8px ${metric.color})`
                }}>
                  {metric.icon}
                </div>
                <Typography
                  sx={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-primary)'
                  }}
                  gutterBottom
                >
                  {metric.title}
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: metric.color,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    textShadow: `0 0 20px ${metric.color}, 0 0 40px ${metric.color}40`,
                    fontSize: '2.5rem'
                  }}
                >
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
});

MetricsCards.displayName = 'MetricsCards';

export default MetricsCards;
