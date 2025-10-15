import React from 'react';
import { useTranslation } from 'react-i18next';
import './NetworkControls.css';

const NetworkControls = ({ threshold, onThresholdChange, maxThreshold }) => {
  const { t } = useTranslation();

  return (
    <div className="network-controls">
      <div className="control-label">
        {t('filters.threshold')}: <span className="threshold-value">{threshold}</span>
      </div>
      <input
        type="range"
        min="1"
        max={maxThreshold || 50}
        value={threshold}
        onChange={(e) => onThresholdChange(parseInt(e.target.value))}
        className="threshold-slider"
      />
      <div className="threshold-range">
        <span>1</span>
        <span>{maxThreshold || 50}</span>
      </div>
    </div>
  );
};

export default NetworkControls;
