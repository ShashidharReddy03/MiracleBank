import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import en from '../../localization/en';
import ar from '../../localization/ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng:           'en',
    fallbackLng:   'en',
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

/**
 * initI18n — called ONCE in bootstrap.ts
 *
 * IMPORTANT ORDER:
 *   1. Apply RTL to layout FIRST (before any component mounts)
 *   2. Then apply language to i18n
 *
 * If you reverse the order, React Native may render
 * LTR layout with RTL text or vice versa for one frame.
 */
export async function initI18n(language = 'en'): Promise<void> {
  try {
    const rtl = language === 'ar';

    // Apply RTL BEFORE language — layout must be set before render
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);

    await i18n.changeLanguage(language);
    console.log(`[i18n] Language: ${language} | RTL: ${rtl}`);
  } catch (e) {
    console.warn('[i18n] initI18n failed:', e);
  }
}

export { i18n };



// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";

// import en from '../../localization/en';
// import ar from '../../localization/ar';

// const resources = {
//   en: { translation: en },

//   ar: { translation: ar },
// };

// i18n
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en", // default language
//     fallbackLng: "en",

//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;