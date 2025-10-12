import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MetricsCards = React.memo(({ data }) => {
  const { t } = useTranslation();

  const total = data.positive + data.negative + data.neutral;
  const positiveRate = total > 0 ? (data.positive / total) * 100 : 0;
  const negativeRate = total > 0 ? (data.negative / total) * 100 : 0;

  const metrics = [
    { title: t('metrics.total'), value: total.toLocaleString('zh-TW') },
    { title: t('metrics.average'), value: data.averageScore.toFixed(2) },
    { title: t('metrics.positive_rate'), value: `${positiveRate.toFixed(1)}%` },
    { title: t('metrics.negative_rate'), value: `${negativeRate.toFixed(1)}%` },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {metric.title}
              </Typography>
              <Typography variant="h5" component="h2">
                {metric.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
});

export default MetricsCards;