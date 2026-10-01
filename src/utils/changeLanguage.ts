import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n }from '../core/localization/i18n';
// import {triggerAppRefresh,triggerRTL,} from '../localization/LanguageContext';
import { appStorage} from '../core/storage/AppStorage';

const LANG_KEY ='selected_language';

export async function changeLanguage(language: | 'en' | 'ar') {
  try {
    const rtl = language === 'ar';
    await AsyncStorage.setItem( LANG_KEY,language);
    try {
      appStorage.set(LANG_KEY, language);
    }
    catch { }
    await i18n.changeLanguage(
      language
    );
    // triggerRTL(rtl);
    // triggerAppRefresh();
    console.log( '[LANG]', language,rtl );
  } catch (e) {
    console.error(
      '[LANG ERROR]',
      e
    );
  }
}