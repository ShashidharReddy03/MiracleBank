import React, { createContext, useContext, useMemo } from 'react';
import { MFTheme } from './MFTheme';
import { defaultTheme } from './defaultTheme';

const ThemeContext = createContext<MFTheme>(defaultTheme);

interface ThemeProviderProps {
  theme?: Partial<MFTheme>;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const merged = useMemo<MFTheme>(
    () => deepMerge(defaultTheme, theme ?? {}) as MFTheme,
    [theme],
  );
  return <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>;
}

export function useTheme(): MFTheme {
  return useContext(ThemeContext);
}

function deepMerge(target: object, source: object): object {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const s = (source as any)[key];
    const t = (target as any)[key];
    if (s && typeof s === 'object' && !Array.isArray(s)) {
      (result as any)[key] = deepMerge(t ?? {}, s);
    } else {
      (result as any)[key] = s;
    }
  }
  return result;
}
