import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  ViewStyle, TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface MFButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function MFButton({
  label, onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  style, textStyle, testID,
}: MFButtonProps) {
  const t = useTheme();

  const heights = { sm: 40, md: 52, lg: 60 };
  const fontSizes = { sm: t.typography.fontSize.sm, md: t.typography.fontSize.md, lg: t.typography.fontSize.lg };
  const bgColors = { primary: t.colors.primary, secondary: t.colors.secondary, outline: 'transparent', ghost: 'transparent', danger: t.colors.error };
  const textColors = { primary: t.colors.textOnPrimary, secondary: t.colors.textOnPrimary, outline: t.colors.primary, ghost: t.colors.primary, danger: t.colors.textOnPrimary };
  const borders = { primary: 'transparent', secondary: 'transparent', outline: t.colors.primary, ghost: 'transparent', danger: 'transparent' };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[{
        height: heights[size],
        backgroundColor: isDisabled ? t.colors.textDisabled : bgColors[variant],
        borderRadius: t.radius.md,
        borderWidth: variant === 'outline' ? 1.5 : 0,
        borderColor: isDisabled ? t.colors.textDisabled : borders[variant],
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: t.spacing.lg,
        width: fullWidth ? '100%' : undefined,
      }, style]}
    >
      {loading
        ? <ActivityIndicator color={textColors[variant]} size="small" />
        : <Text style={[{
          color: isDisabled ? '#fff' : textColors[variant],
          fontSize: fontSizes[size],
          fontFamily: t.typography.fontFamily.semiBold,
          letterSpacing: 0.3,
        }, textStyle]}>
          {label}
        </Text>
      }
    </TouchableOpacity>
  );
}
