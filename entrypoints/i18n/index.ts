import { createI18n } from 'vue-i18n';
import en from './en';
import zhCN from './zh-CN';

type SupportedLocale = 'en' | 'zh-CN';

function getLocale(): SupportedLocale {
  const lang = navigator.language;
  if (lang.startsWith('zh')) return 'zh-CN';
  return 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
});

export function setAppLocale(preference: string): void {
  const resolved: SupportedLocale =
    preference === 'auto' ? getLocale() : (preference as SupportedLocale);
  i18n.global.locale.value = resolved;
}

export default i18n;
