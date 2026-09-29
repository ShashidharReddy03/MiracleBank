import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

import {
  useLanguage,
} from '../../../localization/LanguageContext';

interface MFInputProps
  extends TextInputProps {
  label?: string;

  error?: string;

  hint?: string;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;

  containerStyle?: ViewStyle;

  secure?: boolean;

  forceLTR?: boolean;
}

export function MFInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  secure = false,
  forceLTR = false,
  style,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}: MFInputProps) {
  const t =
    useTheme();

  const {
    isRTL,
  } =
    useLanguage();

  const [
    focused,
    setFocused,
  ] =
    useState(
      false
    );

  const [
    hidden,
    setHidden,
  ] =
    useState(
      secure
    );

  const borderColor =
    error
      ? t.colors.error
      : focused
      ? t.colors.primary
      : t.colors.border;

  const textAlign =
    forceLTR
      ? 'left'
      : isRTL
      ? 'right'
      : 'left';

  const writingDirection =
    forceLTR
      ? 'ltr'
      : isRTL
      ? 'rtl'
      : 'ltr';

  return (
    <View
      style={[
        {
          marginBottom:
            t.spacing.md,
        },

        containerStyle,
      ]}
    >
      {/* LABEL → KEEP OLD */}
      {label && (
        <Text
          style={{
            fontSize:
              t.typography
                .fontSize
                .sm,

            color:
              t.colors
                .textSecondary,

            fontFamily:
              t.typography
                .fontFamily
                .medium,

            marginBottom:
              t.spacing
                .xs,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection:
            isRTL
              ? 'row-reverse'
              : 'row',

          alignItems:
            'center',

          height:
            52,

          borderRadius:
            t.radius.md,

          borderWidth:
            1.5,

          borderColor,

          backgroundColor:
            t.colors.surface,

          paddingHorizontal:
            t.spacing.md,
        }}
      >
        {leftIcon && (
          <View
            style={{
              marginRight:
                t.spacing
                  .sm,
            }}
          >
            {leftIcon}
          </View>
        )}

        {/* INPUT → FIX ONLY HERE */}
        <TextInput
          key={
            writingDirection
          }
          {...rest}
          style={[
            {
              flex: 1,

              fontSize:
                t.typography
                  .fontSize
                  .md,

              color:
                t.colors
                  .text,

              fontFamily:
                t.typography
                  .fontFamily
                  .regular,

              paddingVertical:
                0,

              textAlign,
            },

            style,
          ]}
          value={
            value ??
            ''
          }

          editable={
            rest.editable !==
            false
          }

          placeholderTextColor={
            t.colors
              .textDisabled
          }

          secureTextEntry={
            hidden
          }

          underlineColorAndroid="transparent"

          onChangeText={
            onChangeText
          }

          onFocus={e => {
            setFocused(
              true
            );

            onFocus?.(
              e
            );
          }}

          onBlur={e => {
            setFocused(
              false
            );

            onBlur?.(
              e
            );
          }}
        />

        {secure && (
          <TouchableOpacity
            onPress={() =>
              setHidden(
                !hidden
              )
            }
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Text
              style={{
                color:
                  t.colors
                    .textSecondary,

                fontSize:
                  t.typography
                    .fontSize
                    .xs,

                fontFamily:
                  t.typography
                    .fontFamily
                    .medium,
              }}
            >
              {hidden
                ? 'SHOW'
                : 'HIDE'}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon &&
          !secure && (
            <View
              style={{
                marginLeft:
                  t.spacing
                    .sm,
              }}
            >
              {rightIcon}
            </View>
          )}
      </View>

      {(error ||
        hint) && (
        <Text
          style={{
            fontSize:
              t.typography
                .fontSize
                .xs,

            color:
              error
                ? t.colors
                    .error
                : t.colors
                    .textSecondary,

            marginTop:
              4,
          }}
        >
          {error ??
            hint}
        </Text>
      )}
    </View>
  );
}