import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_TW from './locales/zh_TW.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh_TW: { translation: zh_TW }
    },
    lng: 'zh_TW',
    fallbackLng: 'zh_TW',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
