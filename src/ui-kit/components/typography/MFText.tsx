import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../../../src/ui-kit/theme/ThemeProvider';
import { MFTheme } from '../../../../src/ui-kit/theme/MFTheme';

type FontSize   = keyof MFTheme['typography']['fontSize'];
type FontWeight = keyof MFTheme['typography']['fontFamily'];
type TextColorKey = 'default' | 'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning' | 'onPrimary';

interface MFTextProps extends TextProps {
  variant?: FontSize;
  weight?:  FontWeight;
  color?:   TextColorKey;
}

export function MFText({ variant = 'md', weight = 'regular', color = 'default', style, ...props }: MFTextProps) {
  const t = useTheme();
  const colorMap: Record<TextColorKey, string> = {
    default:   t.colors.text,
    primary:   t.colors.primary,
    secondary: t.colors.textSecondary,
    disabled:  t.colors.textDisabled,
    error:     t.colors.error,
    success:   t.colors.success,
    warning:   t.colors.warning,
    onPrimary: t.colors.textOnPrimary,
  };
  return (
    <Text
      style={[{
        fontSize:   t.typography.fontSize[variant],
        fontFamily: t.typography.fontFamily[weight],
        color: colorMap[color],
      }, style]}
      {...props}
    />
  );
}

interface MFHeadingProps extends TextProps {
  level?: 1 | 2 | 3;
  color?: TextColorKey;
}

export function MFHeading({ level = 1, color = 'default', ...props }: MFHeadingProps) {
  const sizeMap: Record<1 | 2 | 3, FontSize> = { 1: 'display', 2: 'xxl', 3: 'xl' };
  return <MFText variant={sizeMap[level]} weight="bold" color={color} {...props} />;
}
