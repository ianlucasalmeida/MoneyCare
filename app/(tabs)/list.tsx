import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text, useTheme, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useTransactions } from '../../contexts/TransactionContext';

const TransactionsListScreen: React.FC = () => {
  const theme = useTheme();
  const { transactions, loading } = useTransactions();
  
  // Ordena as transações da mais recente para a mais antiga
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Todas as Transações" />
      </Appbar.Header>
      
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text variant='titleMedium'>Nenhuma transação encontrada.</Text>
            <Text variant='bodySmall'>Adicione sua primeira transação!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <List.Item
            title={item.description}
            description={`${item.category.name} - ${new Date(item.date).toLocaleDateString('pt-BR')}`}
            left={() => <List.Icon icon={item.category.icon} />}
            right={() => (
              <Text style={{ 
                color: item.type === 'entrada' ? '#4CAF50' : '#F44336', 
                alignSelf: 'center',
                fontWeight: 'bold',
              }}>
                {item.type === 'saida' ? '- ' : '+ '}R$ {item.amount.toFixed(2)}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { flexGrow: 1, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default TransactionsListScreen;