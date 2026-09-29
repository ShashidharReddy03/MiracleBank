// // core/localization/LanguageContext.tsx
// import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

// type LanguageContextType = {
//   refreshApp: () => void;
// };

// const LanguageContext = createContext<LanguageContextType>({ refreshApp: () => {} });
// export const useLanguage = () => useContext(LanguageContext);

// // ✅ Module-level ref — accessible anywhere, no React needed
// let _refreshApp: () => void = () => {
//   console.warn('[LanguageContext] refreshApp called before provider mounted');
// };

// /** Called by changeLanguage.ts directly — no hook needed */
// export function triggerAppRefresh() {
//   _refreshApp();
// }

// export function LanguageProvider({ children }: { children: React.ReactNode }) {
//   const [appKey, setAppKey] = useState(0);

//   const refreshApp = useCallback(() => {
//     setAppKey(k => k + 1);
//   }, []);

//   // ✅ Register into the module-level ref when provider mounts
//   useEffect(() => {
//     _refreshApp = refreshApp;
//     return () => { _refreshApp = () => {}; };
//   }, [refreshApp]);

//   return (
//     <LanguageContext.Provider value={{ refreshApp }}>
//       <React.Fragment key={appKey}>{children}</React.Fragment>
//     </LanguageContext.Provider>
//   );
// }

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

type LanguageContextType = {
  refreshApp: () => void;
  isRTL: boolean;
  setRTL: (rtl: boolean) => void;
};

const LanguageContext =
  createContext<LanguageContextType>({
    refreshApp: () => {},
    isRTL: false,
    setRTL: () => {},
  });

export const useLanguage = () =>
  useContext(LanguageContext);

let refreshRef = () => {};
let rtlRef = (_: boolean) => {};

export const triggerAppRefresh = () => {
  refreshRef();
};

export const triggerRTL = (
  rtl: boolean
) => {
  rtlRef(rtl);
};

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appKey, setAppKey] =
    useState(0);

  const [isRTL, setRTL] =
    useState(false);

  const refreshApp =
    useCallback(() => {
      setAppKey(
        prev => prev + 1
      );
    }, []);

  useEffect(() => {
    refreshRef =
      refreshApp;

    rtlRef =
      setRTL;

    return () => {
      refreshRef =
        () => {};

      rtlRef =
        () => {};
    };
  }, [refreshApp]);

  return (
    <LanguageContext.Provider
      value={{
        refreshApp,
        isRTL,
        setRTL,
      }}
    >
      <React.Fragment key={appKey}>
        {children}
      </React.Fragment>
    </LanguageContext.Provider>
  );
}




