import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Divider, IconButton, List, Text } from 'react-native-paper';
import { Transaction } from '../../../types'; // Ajuste o caminho para seus tipos

interface RecentTransactionsListProps {
  transactions: Transaction[];
  transactionCount: number;
  period: string;
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({ transactions, transactionCount, period }) => {
  const periodLabels = { '7d': 'nos últimos 7 dias', '30d': 'nos últimos 30 dias', '3m': 'nos últimos 3 meses', '1y': 'no último ano' };

  return (
    <Card style={styles.card}>
      <Card.Title title="Transações Recentes" subtitle={`${transactionCount} transações ${periodLabels[period]}`} right={(props) => <IconButton {...props} icon="history" />} />
      <Card.Content>
        {transactions.length > 0 ? (
          transactions.map((item, index) => (
            <React.Fragment key={item.id}>
              <List.Item
                title={item.description}
                description={`${item.category?.name || 'Sem categoria'} • ${new Date(item.date).toLocaleDateString('pt-BR')}`}
                left={() => (
                  <Avatar.Icon 
                    size={40} 
                    icon={item.category?.icon || 'help-circle'} 
                    color={item.type === 'entrada' ? '#4CAF50' : '#F44336'}
                    style={{ backgroundColor: item.type === 'entrada' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }}
                  />
                )}
                right={() => (
                  <Text style={[styles.amount, { color: item.type === 'entrada' ? '#4CAF50' : '#F44336' }]}>
                    {item.type === 'saida' ? '- ' : '+ '}R$ {item.amount.toFixed(2)}
                  </Text>
                )}
              />
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text>Nenhuma transação recente encontrada.</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { elevation: 2 },
  amount: { alignSelf: 'center', fontWeight: 'bold' },
  emptyState: { height: 100, justifyContent: 'center', alignItems: 'center' },
});