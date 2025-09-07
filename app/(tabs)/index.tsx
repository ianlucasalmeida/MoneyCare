import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Avatar, useTheme, List, Divider } from 'react-native-paper';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';

const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const [mainRates, setMainRates] = useState({ USD: 0, EUR: 0 });

  const userName = user?.name ? user.name.split(' ')[0] : 'Usuário';

  useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=BRL&to=USD,EUR')
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          setMainRates({
            USD: 1 / data.rates.USD,
            EUR: 1 / data.rates.EUR,
          });
        }
      }).catch(console.error);
  }, []);

  const { totalIncome, totalExpenses, balance, recentTransactions } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      recentTransactions: recent,
    };
  }, [transactions]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.Content title={`Olá, ${userName}!`} subtitle="Aqui está o seu resumo financeiro." />
        <Avatar.Icon size={40} icon="account-circle" style={{ marginRight: 10 }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Resumo Financeiro */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Saldo Atual</Text>
            <Text style={[styles.balanceValue, { color: balance >= 0 ? '#4CAF50' : '#F44336' }]}>
              R$ {balance.toFixed(2)}
            </Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Avatar.Icon size={40} icon="arrow-up-bold-box" color="#4CAF50" style={styles.summaryIcon} />
                <View>
                  <Text>Entradas</Text>
                  <Text style={styles.summaryValue}>R$ {totalIncome.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.summaryItem}>
                <Avatar.Icon size={40} icon="arrow-down-bold-box" color="#F44336" style={styles.summaryIcon} />
                <View>
                  <Text>Saídas</Text>
                  <Text style={styles.summaryValue}>R$ {totalExpenses.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Card de Cotações */}
        <Card style={styles.card}>
            <Card.Title title="Moedas em Destaque" />
            <Card.Content>
                <View style={styles.rateItem}>
                    <Text variant="titleMedium">🇺🇸 Dólar (USD)</Text>
                    <Text variant="titleMedium">R$ {mainRates.USD.toFixed(2)}</Text>
                </View>
                <Divider style={{ marginVertical: 10 }}/>
                <View style={styles.rateItem}>
                    <Text variant="titleMedium">🇪🇺 Euro (EUR)</Text>
                    <Text variant="titleMedium">R$ {mainRates.EUR.toFixed(2)}</Text>
                </View>
            </Card.Content>
        </Card>

        {/* Card de Transações Recentes */}
        <Card style={styles.card}>
          <Card.Title title="Transações Recentes" />
          <Card.Content>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((item, index) => (
                <React.Fragment key={item.id}>
                  <List.Item
                    title={item.description}
                    description={item.category.name}
                    left={() => <List.Icon icon={item.category.icon} />}
                    right={() => (
                      <Text style={{ color: item.type === 'entrada' ? '#4CAF50' : '#F44336', alignSelf: 'center' }}>
                        {item.type === 'saida' ? '-' : '+'} R$ {item.amount.toFixed(2)}
                      </Text>
                    )}
                  />
                  {index < recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Text style={{ padding: 10, textAlign: 'center' }}>Nenhuma transação recente.</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 15,
    gap: 15,
    paddingBottom: 100, // Espaço para a barra de navegação flutuante
  },
  card: {},
  balanceLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    backgroundColor: 'transparent',
    marginRight: 5,
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default DashboardScreen;