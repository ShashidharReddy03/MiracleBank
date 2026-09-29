import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../../../src/ui-kit/theme/ThemeProvider';
import { MFText } from '../../../../src/ui-kit/components/typography/MFText';

export function MFLoader({ message, fullScreen = true }: { message?: string; fullScreen?: boolean }) {
  const t = useTheme();
  return (
    <View style={{ flex: fullScreen ? 1 : undefined, alignItems: 'center', justifyContent: 'center', padding: t.spacing.lg, gap: t.spacing.md, backgroundColor: fullScreen ? t.colors.background : undefined }}>
      <ActivityIndicator size="large" color={t.colors.primary} />
      {message && <MFText variant="md" color="secondary">{message}</MFText>}
    </View>
  );
}

interface MFSkeletonProps {
  height?: number;
  width?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export function MFSkeleton({ height = 20, width = '100%', borderRadius = 8, style }: MFSkeletonProps) {
  const t = useTheme();
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{
        height, width: width as any, borderRadius,
        backgroundColor: t.colors.border,
        opacity: anim,
      }, style]}
    />
  );
}

export function MFSkeletonCard() {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.colors.card, borderRadius: t.radius.lg, padding: t.spacing.md, marginBottom: t.spacing.sm, ...(t.shadows.sm as ViewStyle) }}>
      <MFSkeleton height={14} width="60%" borderRadius={7} style={{ marginBottom: 10 }} />
      <MFSkeleton height={12} width="40%" borderRadius={6} />
    </View>
  );
}
