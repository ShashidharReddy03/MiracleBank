export interface MFTheme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    border: string;
    divider: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    textOnPrimary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    credit: string;
    debit: string;
    pending: string;
    reversed: string;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      display: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
  branding: {
    splashBackgroundColor: string;
    logoSource?: any;
  };
}
