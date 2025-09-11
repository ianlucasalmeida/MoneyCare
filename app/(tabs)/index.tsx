import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';

// Hooks personalizados que contêm toda a lógica complexa
import { useAuth } from '../../contexts/AuthContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useDashboardAnalytics } from '../../hooks/useDashboardAnalytics';

// Componentes filhos que agora cuidam da renderização
import { BalanceEvolutionChart } from '../../components/Dashboard/BalanceEvolutionChart';
import { CategoryExpensesChart } from '../../components/Dashboard/CategoryExpensesChart';
import { CurrencyRatesCard } from '../../components/Dashboard/CurrencyRatesCard';
import { PeriodFilter } from '../../components/Dashboard/PeriodFilter';
import { RecentTransactionsList } from '../../components/Dashboard/RecentTransactionsList';
import { SummaryCards } from '../../components/Dashboard/SummaryCards';

const DashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { transactions, loading: loadingTransactions } = useTransactions();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userName = user?.name ? user.name.split(' ')[0] : 'Usuário';
  
  // A mágica acontece aqui: toda a lógica de cálculo é encapsulada neste hook.
  const analytics = useDashboardAnalytics(transactions, selectedPeriod);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // No futuro, você pode adicionar aqui a lógica para recarregar as transações da API
    // ex: await refetchTransactions(); 
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula o tempo de recarga
    setIsRefreshing(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title={`Olá, ${userName}!`} subtitle="Seu resumo financeiro" />
        <Avatar.Icon size={40} icon="account-circle" style={styles.avatar} />
      </Appbar.Header>

      {loadingTransactions ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={onRefresh} 
              tintColor={theme.colors.primary} 
            />
          }
        >
          {/* O corpo da tela agora é apenas uma composição de componentes limpos */}
          <PeriodFilter selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} />
          
          <SummaryCards 
            balance={analytics.balance}
            income={analytics.totalIncome}
            expenses={analytics.totalExpenses}
          />

          <BalanceEvolutionChart data={analytics.lineChartData} />

          <CategoryExpensesChart data={analytics.pieChartData} period={selectedPeriod} />

          <CurrencyRatesCard />

          <RecentTransactionsList 
            transactions={analytics.recentTransactions} 
            transactionCount={analytics.transactionCount}
            period={selectedPeriod}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  avatar: { 
    marginRight: 10 
  },
  content: { 
    padding: 16, 
    paddingBottom: 100 // Espaço extra para a barra de navegação flutuante
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;