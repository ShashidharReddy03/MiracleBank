import { MFTheme } from './MFTheme';

export const defaultTheme: MFTheme = {
  colors: {
    primary: '#0052CC',
    primaryDark: '#003D99',
    primaryLight: '#E6F0FF',
    secondary: '#00B8A9',
    background: '#F4F6F9',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E1E8F0',
    divider: '#EDF2F7',
    text: '#1A2B4A',
    textSecondary: '#6B7C93',
    textDisabled: '#B0BEC5',
    textOnPrimary: '#FFFFFF',
    error: '#E53935',
    success: '#2E7D32',
    warning: '#F57C00',
    info: '#0277BD',
    credit: '#2E7D32',
    debit: '#E53935',
    pending: '#F57C00',
    reversed: '#6B7C93',
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, display: 28,
    },
    lineHeight: {
      tight: 1.2, normal: 1.5, relaxed: 1.75,
    },
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  radius: {
    sm: 4, md: 8, lg: 16, xl: 24, full: 9999,
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  },
  branding: {
    splashBackgroundColor: '#0052CC',
  },
};
