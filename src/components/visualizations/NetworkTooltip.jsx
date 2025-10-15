import React from 'react';
import { useTranslation } from 'react-i18next';
import './NetworkTooltip.css';

const NetworkTooltip = ({ data, x, y, visible }) => {
  const { t } = useTranslation();

  if (!visible || !data) return null;

  const getRatingStars = (score) => {
    const rating = Math.round(Math.abs(parseFloat(score)) * 5);
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div
      className="network-tooltip"
      style={{
        left: `${x + 15}px`,
        top: `${y + 15}px`
      }}
    >
      <div className="tooltip-title">{data.label}</div>
      <div className="tooltip-divider"></div>
      <div className="tooltip-content">
        <div className="tooltip-row">
          <span className="tooltip-label">{t('network.frequency')}:</span>
          <span className="tooltip-value">{data.frequency}</span>
        </div>
        {data.sentimentScore !== undefined && (
          <div className="tooltip-row">
            <span className="tooltip-label">{t('network.sentiment_score')}:</span>
            <span className={`tooltip-value ${data.sentimentScore > 0 ? 'positive' : data.sentimentScore < 0 ? 'negative' : 'neutral'}`}>
              {data.sentimentScore > 0 ? '+' : ''}{data.sentimentScore}
            </span>
          </div>
        )}
        {data.sentimentScore !== undefined && (
          <div className="tooltip-row">
            <span className="tooltip-label">{t('network.strength')}:</span>
            <span className="tooltip-stars">{getRatingStars(data.sentimentScore)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkTooltip;
