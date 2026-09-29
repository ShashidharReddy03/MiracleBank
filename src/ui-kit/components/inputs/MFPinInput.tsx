import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Animated, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MFPinInputProps {
  length?:      number;
  onComplete:   (pin: string) => void;
  autoFocus?:   boolean;  // auto-focus first cell on mount (default true)
  resetOnMount?: boolean; // clear pin when component mounts (default false)
}

export function MFPinInput({
  length     = 4,
  onComplete,
  autoFocus  = true,   // ← auto-focus first input by default
  resetOnMount = false,
}: MFPinInputProps) {
  const t    = useTheme();
  const [pin, setPin] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(TextInput | null)[]>([]);

  // ── Auto-focus first cell on mount ───────────────────────────────────────
  useEffect(() => {
    if (!autoFocus) return;

    // Small delay needed on Android — keyboard won't open if focused before
    // the component is fully laid out in the view hierarchy
    const timer = setTimeout(() => {
      refs.current[0]?.focus();
    }, Platform.OS === 'android' ? 200 : 100);

    return () => clearTimeout(timer);
  }, []); // empty deps — runs once on mount only

  // ── Reset pin when resetOnMount is true ──────────────────────────────────
  useEffect(() => {
    if (resetOnMount) {
      setPin(Array(length).fill(''));
      // Re-focus first cell after reset
      setTimeout(() => refs.current[0]?.focus(), 100);
    }
  }, [resetOnMount]);

  // ── Expose reset via ref if needed ───────────────────────────────────────
  const resetPin = () => {
    setPin(Array(length).fill(''));
    setTimeout(() => refs.current[0]?.focus(), 50);
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next  = [...pin];
    next[index] = digit;
    setPin(next);

    // Move to next cell
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }

    // All cells filled — call onComplete
    const full = next.join('');
    if (full.length === length && !next.includes('')) {
      onComplete(full);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      const next = [...pin];
      if (next[index]) {
        // Clear current cell
        next[index] = '';
        setPin(next);
      } else if (index > 0) {
        // Move back and clear previous cell
        next[index - 1] = '';
        setPin(next);
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: t.spacing.lg }}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={{
            width:           56,
            height:          56,
            borderRadius:    t.radius.full,
            borderWidth:     2,
            borderColor:     pin[i] ? t.colors.primary : t.colors.border,
            alignItems:      'center',
            justifyContent:  'center',
            backgroundColor: pin[i] ? t.colors.primaryLight : t.colors.surface,
          }}
        >
          {/* Hidden TextInput — sits over the circle, captures input */}
          <TextInput
            ref={(r) => { refs.current[i] = r; }}
            onChangeText={(txt) => handleChange(txt, i)}
            onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden={true}        // hide cursor — looks cleaner
            contextMenuHidden={true}  // disable copy/paste menu
            selectTextOnFocus={true}  // select text so typing replaces it
            style={{
              position: 'absolute',
              width:    '100%',
              height:   '100%',
              opacity:  0,            // invisible — circle above is the visual
            }}
          />

          {/* Visual dot when digit entered */}
          {pin[i] ? (
            <View style={{
              width:           14,
              height:          14,
              borderRadius:    7,
              backgroundColor: t.colors.primary,
            }} />
          ) : null}
        </View>
      ))}
    </View>
  );
}
