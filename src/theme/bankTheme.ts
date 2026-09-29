

import { MFTheme } from '../ui-kit/theme/MFTheme';

export const bankTheme: Partial<MFTheme> = {
  colors: {
    primary: '#873d00',   // ← Your main brand color
    primaryDark: '#001F5B',
    primaryLight: '#E8EEF8',
    secondary: '#00A859',

    // ── Surface ──────────────────────────────────────────────────────────────
    background: '#F5F7FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E2E8F0',
    divider: '#EDF2F7',

    // ── Text ─────────────────────────────────────────────────────────────────
    text: '#1A202C',
    textSecondary: '#718096',
    textDisabled: '#CBD5E0',
    textOnPrimary: '#FFFFFF',

    // ── Status ───────────────────────────────────────────────────────────────
    error: '#E53E3E',
    success: '#38A169',
    warning: '#D69E2E',
    info: '#3182CE',

    // ── Banking-specific ──────────────────────────────────────────────────────
    credit: '#38A169',
    debit: '#E53E3E',
    pending: '#D69E2E',
    reversed: '#718096',
  },

  typography: {
    fontFamily: {
      // ← Replace with your bank's licensed fonts (add to assets/fonts/)
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 22,
      display: 28,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  branding: {
    splashBackgroundColor: '#003087',
    // logoSource: require('./assets/images/logo.png'),  ← uncomment & add logo
  },
};
