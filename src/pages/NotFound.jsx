import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <h1>404 - {t('notfound.title')}</h1>
      <p>{t('notfound.message')}</p>
      <Link to="/">{t('notfound.back')}</Link>
    </div>
  );
}

export default NotFound;
