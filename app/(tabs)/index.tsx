import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper'; // FAB foi removido dos imports

// Hooks
import { useAuth } from '../../contexts/AuthContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useWallets } from '../../contexts/WalletContext';
import { useDashboardAnalytics } from '../../hooks/useDashboardAnalytics';

// Componentes
import { BalanceEvolutionChart } from '../../components/Dashboard/BalanceEvolutionChart';
import { CategoryExpensesChart } from '../../components/Dashboard/CategoryExpensesChart';
import { CurrencyRatesCard } from '../../components/Dashboard/CurrencyRatesCard';
import { PeriodFilter } from '../../components/Dashboard/PeriodFilter';
import { RecentTransactionsList } from '../../components/Dashboard/RecentTransactionsList';
import { SummaryCards } from '../../components/Dashboard/SummaryCards';

const DashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { transactions, loading: loadingTransactions, syncTransactions } = useTransactions();
  const { syncWallets } = useWallets();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userName = user?.name ? user.name.split(' ')[0] : 'Usuário';
  const analytics = useDashboardAnalytics(transactions, selectedPeriod);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([syncTransactions(), syncWallets()]);
    setIsRefreshing(false);
  }, [syncTransactions, syncWallets]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        syncTransactions();
        syncWallets();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [syncTransactions, syncWallets]);

  return (
    // MUDANÇA: A View não precisa mais do Portal.Host
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title={`Olá, ${userName}!`} subtitle="Seu resumo financeiro" />
        <Avatar.Icon size={40} icon="account-circle" style={styles.avatar} />
      </Appbar.Header>

      {loadingTransactions && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
          }
        >
          <PeriodFilter selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} />
          <SummaryCards 
            balance={analytics.balance}
            income={analytics.totalIncome}
            expenses={analytics.totalExpenses}
          />
          <BalanceEvolutionChart data={analytics.lineChartData} />
          <CategoryExpensesChart data={analytics.pieChartData} period={selectedPeriod} />
          <CurrencyRatesCard />
          <RecentTransactionsList transactions={analytics.recentTransactions} />
        </ScrollView>
      )}
      
      {/* MUDANÇA: O componente <FAB> foi completamente removido daqui */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  avatar: { 
    marginRight: 10 
  },
  content: { 
    padding: 16, 
    paddingBottom: 100 // Mantemos o padding para a dock não cobrir o último card
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // MUDANÇA: O estilo do 'fab' foi removido
});

export default DashboardScreen;