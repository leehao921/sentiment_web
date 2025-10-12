import React from 'react';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <h1>{t('title')}</h1>
      <p>{t('welcome')}</p>
    </div>
  );
}

export default Dashboard;
