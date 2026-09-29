import React from 'react';
import { Modal, View, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { useTheme } from '../../../../src/ui-kit/theme/ThemeProvider';
import { MFText } from '../../../../src/ui-kit/components/typography/MFText';
import { MFButton } from '../../../../src/ui-kit/components/buttons/MFButton';

// ── MFBottomSheet ─────────────────────────────────────────────────────────────

interface MFBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoint?: number; // height % of screen, unused by default
}

export function MFBottomSheet({ visible, onClose, title, children }: MFBottomSheetProps) {
  const t = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: t.colors.surface,
              borderTopLeftRadius: t.radius.xl, borderTopRightRadius: t.radius.xl,
              padding: t.spacing.lg, paddingBottom: t.spacing.xxl,
            }}>
              <View style={{ width: 40, height: 4, backgroundColor: t.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: t.spacing.md }} />
              {title && <MFText variant="xl" weight="bold" style={{ marginBottom: t.spacing.md }}>{title}</MFText>}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ── MFDialog ──────────────────────────────────────────────────────────────────

interface MFDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}

export function MFDialog({
  visible, title, message,
  onConfirm, onCancel,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = false, loading = false,
}: MFDialogProps) {
  const t = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: t.spacing.lg }}>
        <View style={{ backgroundColor: t.colors.surface, borderRadius: t.radius.xl, padding: t.spacing.lg, width: '100%', ...(t.shadows.lg as ViewStyle) }}>
          <MFText variant="xl" weight="bold" style={{ marginBottom: t.spacing.sm }}>{title}</MFText>
          <MFText variant="md" color="secondary" style={{ marginBottom: t.spacing.lg, lineHeight: 22 }}>{message}</MFText>
          <View style={{ flexDirection: 'row', gap: t.spacing.sm }}>
            {onCancel && (
              <MFButton label={cancelLabel} variant="outline" onPress={onCancel} style={{ flex: 1 }} />
            )}
            <MFButton
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
