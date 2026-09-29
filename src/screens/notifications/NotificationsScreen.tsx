import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation }            from '@react-navigation/native';
import { DrawerActions }            from '@react-navigation/native';
import { useTranslation }           from 'react-i18next';
import { MFScreenWrapper } from '../../ui-kit/layouts/MFScreenWrapper';
import { MFText }          from '../../ui-kit/components/typography/MFText';
import { MFHeading }       from '../../ui-kit/components/typography/MFText';
import { MFCard }          from '../../ui-kit/components/cards/MFCard';
import { useTheme }        from '../../ui-kit/theme/ThemeProvider';
import { RootState }       from '../../store/store';
import { markAllRead }     from '../../store/slices/notificationSlice';
import { MFNotification }  from '../../notifications/NotificationManager';

const CATEGORY_ICONS: Record<string, string> = {
  TRANSACTION_ALERT: '💳', TRANSFER_STATUS: '↗', OTP: '🔑',
  SECURITY_ALERT: '🔒', PROMOTIONAL: '🎁', SYSTEM: 'ℹ',
};

export function NotificationsScreen() {
  const t          = useTheme();
  const { t: tr }  = useTranslation();
  const dispatch   = useDispatch();
  const navigation = useNavigation();
  const { notifications, unreadCount } = useSelector((s: RootState) => s.notifications);

  return (
    <MFScreenWrapper scrollable={false} keyboardAvoiding={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <View style={styles.hamburgerWrap}>
            {[26, 20, 26].map((w, i) => (
              <View key={i} style={[styles.hamburgerLine, { backgroundColor: t.colors.text, width: w }]} />
            ))}
          </View>
        </TouchableOpacity>

        <MFHeading level={3} style={{ flex: 1, marginLeft: 16 }}>{tr('notifications.title')}</MFHeading>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => dispatch(markAllRead())}>
            <MFText variant="sm" color="primary" weight="medium">{tr('common.markAllRead')}</MFText>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <MFText variant="display">🔔</MFText>
          <MFText variant="lg" color="secondary" style={{ marginTop: 16 }}>{tr('notifications.empty')}</MFText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: t.spacing.md }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <NotificationRow notification={item} />}
        />
      )}
    </MFScreenWrapper>
  );
}

function NotificationRow({ notification }: { notification: MFNotification }) {
  const t = useTheme();
  return (
    <MFCard style={{ marginBottom: t.spacing.sm, flexDirection: 'row', gap: t.spacing.md }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
        <MFText variant="lg">{CATEGORY_ICONS[notification.category] ?? 'ℹ'}</MFText>
      </View>
      <View style={{ flex: 1 }}>
        <MFText variant="md" weight="semiBold" numberOfLines={1}>{notification.title}</MFText>
        <MFText variant="sm" color="secondary" numberOfLines={2} style={{ marginTop: 2 }}>{notification.body}</MFText>
        <MFText variant="xs" color="secondary" style={{ marginTop: 4 }}>
          {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : ''}
        </MFText>
      </View>
    </MFCard>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  hamburgerWrap: { gap: 5, padding: 4, marginRight: 4 },
  hamburgerLine: { height: 2, borderRadius: 2 },
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
