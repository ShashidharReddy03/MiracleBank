import React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  MFScreenWrapper, MFAccountCard, MFCard,
  MFText, MFHeading, MFSkeletonCard, useTheme,
} from '../../ui-kit/index';
import { RootState } from '../../store/store';
import { Transaction } from '../../types/banking';
import { CIBSDK } from './../../sdk/CIBSDK';

export function DashboardScreen() {
  const t          = useTheme();
  const { t: tr }  = useTranslation();
  const { accounts, selectedAccountId, loading } = useSelector((s: RootState) => s.accounts);
  const { transactions } = useSelector((s: RootState) => s.transactions);
  const selectedAccount  = accounts.find(a => a.id === selectedAccountId) ?? accounts[0];
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => { setRefreshing(true); setRefreshing(false); };

  const QUICK_ACTIONS = [
    { key: 'transfer', icon: '↗' },
    { key: 'pay',      icon: '🧾' },
    { key: 'topUp',    icon: '+' },
    { key: 'more',     icon: '⋯' },
  ] as const;
const testCIBSDK = async () => {
  try {
    console.log('--- Testing buildRequest ---');

    const buildResult = await CIBSDK.buildRequest(
      '{}',
      '{}',
    );

    console.log('buildRequest:', buildResult);

    console.log('--- Testing mergeTpin ---');

    const tpinResult = await CIBSDK.mergeTpin(
      '1234',
      '{}',
    );

    console.log('mergeTpin:', tpinResult);

    console.log('--- Testing ownAccountConfirm ---');

    const confirmResult = await CIBSDK.ownAccountConfirm({
      sourceAccount: '1234567890',
      toAccount: '9876543210',
      amount: '500',
      remarks: 'Test transfer',
      exchangeAmount: '',
      exchangeRate: '',
      ticketNumber: '',
      isAutoDebit: 'N',
      debitDate: '',
      fromCurrency: 'USD',
      fromCurrencyCode: 'USD',
      toCurrency: 'USD',
      toCurrencyCode: 'USD',
    });

    console.log(
      'ownAccountConfirm:',
      confirmResult,
    );

  } catch (error) {
    console.error('CIB SDK TEST ERROR:', error);
  }
};

const onBuildRequest = async () => {
  try {
    const metadata = JSON.stringify({
      requestId: 'build-request-test',
      channel: 'MOBILE',
      timestamp: new Date().toISOString(),
    });

    const request = JSON.stringify({
      sourceAccount: '1234567890',
      toAccount: '9876543210',
      amount: '500',
      currency: 'USD',
      remarks: 'Build request test',
    });

    const built = await CIBSDK.buildRequest(metadata, request);
    console.log('buildRequest payload:', built);
    Alert.alert('buildRequest', String(built));
  } catch (e) {
    Alert.alert('buildRequest error', String(e));
  }
};

const onMergeTpin = async () => {
  try {
    const res = await CIBSDK.mergeTpin('1234', '{}');
    console.log('mergeTpin:', res);
    Alert.alert('mergeTpin', String(res));
  } catch (e) {
    Alert.alert('mergeTpin error', String(e));
  }
};

const onOwnAccountConfirm = async () => {
  try {
    const res = await CIBSDK.ownAccountConfirm({
      sourceAccount: '1234567890',
      toAccount: '9876543210',
      amount: '500',
      remarks: 'Test transfer',
      exchangeAmount: '',
      exchangeRate: '',
      ticketNumber: '',
      isAutoDebit: 'N',
      debitDate: '',
      fromCurrency: 'USD',
      fromCurrencyCode: 'USD',
      toCurrency: 'USD',
      toCurrencyCode: 'USD',
    });
    console.log('ownAccountConfirm:', res);
    Alert.alert('ownAccountConfirm', String(res));
  } catch (e) {
    Alert.alert('ownAccountConfirm error', String(e));
  }
};

const checkTheCode = async () => {
  // 1. Build the request — ReqService is baked in by the SDK
const body = await CIBSDK.ownAccountConfirm({
  sourceAccount: '0011223344',
  toAccount:     '0055667788',
  amount:        '500',
  remarks:       'August rent',
});
console.log('Request body:', body);
console.log('Request body in 144:',typeof body);
// 2. Merge device/session metadata (your app composes metadataJson)
const payload = await CIBSDK.buildRequest({}, body);
console.log('Payload to send to server:', payload);
// 3. Encrypt → POST → decrypt — your network layer
// const confirmation = JSON.parse(await api.send(payload));

// 4. If the server asks for auth, merge the T-PIN into the execute call
// if (confirmation.isAuthentication === 'Y') {
//   const executeBody = await CIBSDK.mergeTpin(tpin, executeRequestJson);
//   // buildRequest → encrypt → send, as above
// }
}
  return (
    <MFScreenWrapper scrollable={false} keyboardAvoiding={false} statusBarStyle="dark-content" contentStyle={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[t.colors.primary]} />}>

        {/* Header */}
        <View style={{ paddingHorizontal: t.spacing.md, paddingTop: t.spacing.lg, paddingBottom: t.spacing.sm }}>
          <MFText variant="sm" color="secondary">{tr('dashboard.greeting')}</MFText>
          <MFHeading level={3}>{tr('dashboard.myAccounts')}</MFHeading>
        </View>

        {/* Account Card */}
        <View style={{ paddingHorizontal: t.spacing.md, marginBottom: t.spacing.lg }}>
          {loading ? <MFSkeletonCard /> : selectedAccount ? <MFAccountCard account={selectedAccount} /> : null}
        </View>

        {/* Quick Actions */}
        <MFCard style={{ marginHorizontal: t.spacing.md, marginBottom: t.spacing.lg }}>
          <MFText variant="xs" weight="semiBold" color="secondary"
            style={{ marginBottom: t.spacing.md, letterSpacing: 0.8 }}>
            {tr('dashboard.quickActions')}
          </MFText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity key={action.key} style={{ alignItems: 'center', gap: 6 }} activeOpacity={0.7}>
                <View style={{ width: 52, height: 52, borderRadius: t.radius.lg, backgroundColor: t.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <MFText variant="xl">{action.icon}</MFText>
                </View>
                <MFText variant="xs" color="secondary" weight="medium">
                  {tr(`dashboard.actions.${action.key}`)}
                </MFText>
              </TouchableOpacity>
            ))}
          </View>
        </MFCard>

        {/* CIB SDK Test Buttons */}
        <MFCard style={{ marginHorizontal: t.spacing.md, marginBottom: t.spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={onBuildRequest} style={{ padding: 12, borderRadius: t.radius.md, backgroundColor: t.colors.primaryLight }}>
              <MFText variant="sm" weight="semiBold">Test buildRequest</MFText>
            </TouchableOpacity>
            <TouchableOpacity onPress={checkTheCode} style={{ padding: 12, borderRadius: t.radius.md, backgroundColor: t.colors.primaryLight }}>
              <MFText variant="sm" weight="semiBold">Test mergeTpin</MFText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onOwnAccountConfirm} style={{ padding: 12, borderRadius: t.radius.md, backgroundColor: t.colors.primaryLight }}>
              <MFText variant="sm" weight="semiBold">Test ownConfirm</MFText>
            </TouchableOpacity>
          </View>
        </MFCard>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: t.spacing.md, marginBottom: t.spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.spacing.md }}>
            <MFText variant="lg" weight="semiBold">{tr('dashboard.recentTransactions')}</MFText>
            <TouchableOpacity>
              <MFText variant="sm" color="primary" weight="medium">{tr('common.seeAll')}</MFText>
            </TouchableOpacity>
          </View>
          {loading
            ? [1, 2, 3].map(i => <MFSkeletonCard key={i} />)
            : transactions.length === 0
              ? <EmptyTransactions />
              : transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)
          }
        </View>
      </ScrollView>
    </MFScreenWrapper>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const t = useTheme();
  const isCredit = transaction.type === 'CREDIT';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.colors.card, borderRadius: t.radius.lg, padding: t.spacing.md, marginBottom: t.spacing.sm, ...(t.shadows.sm as any) }}>
      <View style={{ width: 44, height: 44, borderRadius: t.radius.full, backgroundColor: isCredit ? '#E8F5E9' : '#FFEBEE', alignItems: 'center', justifyContent: 'center', marginRight: t.spacing.md }}>
        <MFText variant="lg">{isCredit ? '↓' : '↑'}</MFText>
      </View>
      <View style={{ flex: 1 }}>
        <MFText variant="md" weight="medium" numberOfLines={1}>{transaction.narration}</MFText>
        <MFText variant="sm" color="secondary">{new Date(transaction.createdAt).toLocaleDateString()}</MFText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <MFText variant="md" weight="semiBold" style={{ color: isCredit ? t.colors.credit : t.colors.debit }}>
          {isCredit ? '+' : '-'}{transaction.amount.currency} {transaction.amount.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </MFText>
        <View style={{ backgroundColor: '#eee', borderRadius: t.radius.full, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 }}>
          <MFText variant="xs" color="secondary">{transaction.status}</MFText>
        </View>
      </View>
    </View>
  );
}

function EmptyTransactions() {
  const t      = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ alignItems: 'center', paddingVertical: t.spacing.xxl }}>
      <MFText variant="xxl" style={{ marginBottom: t.spacing.sm }}>💳</MFText>
      <MFText variant="md" color="secondary">{tr('dashboard.noTransactions')}</MFText>
    </View>
  );
}
