import i18n from './config';

describe('i18n Configuration - M2 Test', () => {
  test('i18n is initialized', () => {
    expect(i18n).toBeDefined();
    expect(i18n.isInitialized).toBe(true);
  });

  test('default language is zh_TW', () => {
    expect(i18n.language).toBe('zh_TW');
  });

  test('translations are loaded', () => {
    expect(i18n.hasResourceBundle('zh_TW', 'translation')).toBe(true);
  });

  test('can translate title', () => {
    const title = i18n.t('title');
    expect(title).toBe('情感分析儀表板');
  });

  test('can translate sentiment terms', () => {
    expect(i18n.t('sentiment.positive')).toBe('正面');
    expect(i18n.t('sentiment.negative')).toBe('負面');
    expect(i18n.t('sentiment.neutral')).toBe('中性');
  });

  test('can translate loading state', () => {
    expect(i18n.t('loading')).toBe('載入中...');
  });

  test('can translate error state', () => {
    expect(i18n.t('error')).toBe('發生錯誤');
  });
});
