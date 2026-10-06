import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  ChevronLeft,
  LogOut,
  User,
  Shield,
  KeyRound,
  Camera,
  Eye,
  EyeOff,
  Phone,
  Mail,
  CircleCheck,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { confirmLogout } from '../../utils/logout';

const PRIMARY = '#14B8A6';
const BG = '#EEF3F4';
const DARK_TEAL = '#0E8F86';

type ProfileTab = 'edit' | 'security' | 'mpin';

export function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useSelector((s: RootState) => s.auth.user);

  const [activeTab, setActiveTab] = useState<ProfileTab>('edit');
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [userName, setUserName] = useState(
    user ? `${user.firstName} ${user.lastName}` : 'Shashidhar Reddy',
  );
  const [mobile, setMobile] = useState(user?.phone ?? '917981976686');
  const [email, setEmail] = useState(user?.email ?? 'shashidharre...7@gmail.com');

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Shashidhar Reddy';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Dashboard' as never)}
        >
          <ChevronLeft size={22} color="#ffffff" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => confirmLogout(navigation)}
        >
          <LogOut size={18} color="#ffffff" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <User size={42} color="#ffffff" strokeWidth={1.8} />
              </View>
              <TouchableOpacity style={styles.cameraBadge}>
                <Camera size={12} color="#ffffff" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroName}>{displayName}</Text>
              <Text style={styles.heroSub}>Welcome to Miracle Banking</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statLabel}>HOLD BALANCE</Text>
                {balanceVisible ? (
                  <Text style={styles.statValue}>$1,250.00</Text>
                ) : (
                  <View style={styles.maskSquares}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View key={i} style={styles.maskSquare} />
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.eyeCircle}
                onPress={() => setBalanceVisible((v) => !v)}
              >
                {balanceVisible ? (
                  <EyeOff size={16} color={PRIMARY} strokeWidth={2.2} />
                ) : (
                  <Eye size={16} color={PRIMARY} strokeWidth={2.2} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>LOYALTY POINTS</Text>
              <View style={styles.loyaltyBadge}>
                <Text style={styles.loyaltyText}>0</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionTabs}>
          <TouchableOpacity
            style={[styles.actionTab, activeTab === 'edit' && styles.actionTabActive]}
            onPress={() => setActiveTab('edit')}
          >
            <User
              size={20}
              color={activeTab === 'edit' ? '#fff' : '#9CA3AF'}
              strokeWidth={2.2}
            />
            <Text style={[styles.actionTabText, activeTab === 'edit' && styles.actionTabTextActive]}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTab, activeTab === 'security' && styles.actionTabActive]}
            onPress={() => setActiveTab('security')}
          >
            <Shield
              size={20}
              color={activeTab === 'security' ? '#fff' : '#9CA3AF'}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.actionTabText,
                activeTab === 'security' && styles.actionTabTextActive,
              ]}
            >
              Security Questions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTab, activeTab === 'mpin' && styles.actionTabActive]}
            onPress={() => setActiveTab('mpin')}
          >
            <KeyRound
              size={20}
              color={activeTab === 'mpin' ? '#fff' : '#9CA3AF'}
              strokeWidth={2.2}
            />
            <Text style={[styles.actionTabText, activeTab === 'mpin' && styles.actionTabTextActive]}>
              Change M-PIN
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'edit' && (
          <View style={styles.formCard}>
            <Field
              label="User Name"
              icon={<User size={18} color={PRIMARY} strokeWidth={2.2} />}
              value={userName}
              onChangeText={setUserName}
            />
            <Field
              label="Mobile Number"
              icon={<Phone size={18} color={PRIMARY} strokeWidth={2.2} />}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <Field
              label="Email ID"
              icon={<Mail size={18} color={PRIMARY} strokeWidth={2.2} />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        )}

        {activeTab === 'security' && (
          <View style={styles.formCard}>
            <Text style={styles.placeholderTitle}>Security Questions</Text>
            <Text style={styles.placeholderBody}>
              Update your security questions to help recover your account securely.
            </Text>
          </View>
        )}

        {activeTab === 'mpin' && (
          <View style={styles.formCard}>
            <Text style={styles.placeholderTitle}>Change M-PIN</Text>
            <Text style={styles.placeholderBody}>
              Set a new 4-digit M-PIN to protect your banking transactions.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  icon,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="#9CA3AF"
        />
        <CircleCheck size={20} color={PRIMARY} strokeWidth={2.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PRIMARY },
  headerBar: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  scroll: { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: DARK_TEAL,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrap: { marginRight: 14 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DARK_TEAL,
  },
  heroText: { flex: 1 },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: -56,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  maskSquares: {
    flexDirection: 'row',
    gap: 6,
  },
  maskSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  eyeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  loyaltyBadge: {
    backgroundColor: '#FBBF77',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  loyaltyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  actionTabs: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 68,
    marginBottom: 16,
  },
  actionTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 6,
    minHeight: 84,
    gap: 8,
  },
  actionTabActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  actionTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  actionTabTextActive: { color: '#fff' },
  formCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: { color: '#EF4444' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  inputIcon: {
    width: 28,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 12,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderBody: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
