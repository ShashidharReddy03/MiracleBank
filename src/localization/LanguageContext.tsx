import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import ar from './ar.json';

type Language = 'en' | 'ar';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface LanguageContextProps {
  language: Language;
  translations: TranslationObject;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<
  LanguageContextProps | undefined
>(undefined);

const translationsMap: Record<Language, TranslationObject> = {
  en,
  ar,
};

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = 'app-language';

const LanguageProvider = ({
  children,
}: LanguageProviderProps) => {
  const [language, setLanguageState] =
    useState<Language>('en');

  const [isLanguageLoaded, setIsLanguageLoaded] =
    useState(false);

  /**
   * Load saved language
   */
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage =
          await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY,
          );

        if (
          savedLanguage === 'ar' ||
          savedLanguage === 'en'
        ) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.warn(
          'Failed to load language:',
          error,
        );
      } finally {
        setIsLanguageLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  /**
   * Change language
   */
  const setLanguage = useCallback(
    async (lang: Language) => {
      try {
        setLanguageState(lang);

        await AsyncStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          lang,
        );
      } catch (error) {
        console.warn(
          'Failed to save language:',
          error,
        );
      }
    },
    [],
  );

  /**
   * RTL state
   *
   * Arabic = RTL
   * English = LTR
   */
  const isRTL = language === 'ar';

  /**
   * Translation helper
   *
   * Supports nested keys:
   *
   * t('sidebar.items.dashboard')
   * t('login.title')
   * t('intro.slide1.title')
   */
  const t = useCallback(
    (
      key: string,
      fallback?: string,
    ): string => {
      const keys = key.split('.');

      let result:
        | string
        | TranslationObject =
        translationsMap[language];

      for (const k of keys) {
        if (
          result &&
          typeof result === 'object' &&
          k in result
        ) {
          result = result[k];
        } else {
          return fallback || key;
        }
      }

      return typeof result === 'string'
        ? result
        : fallback || key;
    },
    [language],
  );

  /**
   * Don't render the application until
   * the saved language has been loaded.
   *
   * This prevents:
   *
   * English -> Arabic
   *
   * flicker when the user previously selected Arabic.
   */
  if (!isLanguageLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations:
          translationsMap[language],
        setLanguage,
        isRTL,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Main language hook
 */
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider',
    );
  }

  return ctx;
};

/**
 * Simplified translation hook
 */
export const useTranslation = () => {
  const {
    t,
    language,
    isRTL,
  } = useLanguage();

  return {
    t,
    language,
    isRTL,
  };
};

export {
  LanguageProvider,
  LanguageContext,
};

export type {
  Language,
  TranslationObject,
  LanguageContextProps,
};