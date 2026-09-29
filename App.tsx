import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './src/ui-kit/theme/ThemeProvider';
import { MFLoader } from './src/ui-kit/components/loaders/MFLoader';
import { store } from './src/store/store';
import { queryClient } from './src/store/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { bootstrap } from './src/bootstrap';
import { bankTheme } from './src/theme/bankTheme';
import { appConfig } from './src/config/appConfig';
import { LanguageProvider, useLanguage } from './src/localization/LanguageContext'; 
import { ScreenshotBlocker } from './src/security/screenshot/ScreenshotBlocker';
import { logger } from './src/core/logging/MFLogger';

// Configure Reactotron in development (keeps dev-only dependency isolated)
if (__DEV__) {
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
require('./src/reactotronConfig');
}
type AppState = 'loading' | 'ready';

function AppContent() {
  const { isRTL } = useLanguage();
  return (
    <View style={{ flex: 1,direction: isRTL ? 'rtl' : 'ltr', }}>
      <RootNavigator />
    </View>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    if (appConfig.security.screenshotBlocking) {
      ScreenshotBlocker.enable();
      logger.info('App', 'Screenshot blocking enabled ✓');
    }

    return () => {
      if (appConfig.security.screenshotBlocking) {
        ScreenshotBlocker.disable();
        logger.info('App', 'Screenshot blocking disabled ✓');
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void bootstrap()
      .catch(error => {
        logger.error('App', 'Bootstrap failed; continuing to app', { error });
      })
      .finally(() => {
        if (isMounted) {
          setAppState('ready');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (appState === 'loading') {
    return (
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <ThemeProvider theme={bankTheme}>
          <MFLoader message={`Loading ${appConfig.bankName}...`} />
        </ThemeProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={bankTheme}>
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
