import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Avatar, Divider, List, Text, useTheme } from 'react-native-paper';
import { useTransactions } from '../../contexts/TransactionContext';
import { Transaction } from '../../types';

const TransactionListComponent: React.FC = () => {
  const theme = useTheme();
  const { transactions, loading } = useTransactions();

  if(loading && transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    const color = isIncome ? '#4CAF50' : '#F44336';
    const backgroundColor = isIncome ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';

    // Se a transação não tiver itens detalhados, renderiza um item simples
    if (!item.items || item.items.length === 0) {
      return (
        <List.Item
          title={item.description}
          description={`${item.category?.name || 'Sem categoria'} • ${new Date(item.date).toLocaleDateString('pt-BR')}`}
          left={() => <Avatar.Icon size={40} icon={item.category?.icon || 'help-circle'} color={color} style={{ backgroundColor }} />}
          right={() => (
            <Text style={[styles.amount, { color }]}>
              {isIncome ? '+ ' : '- '}R$ {item.amount.toFixed(2)}
            </Text>
          )}
        />
      );
    }
    
    // Se tiver itens, renderiza um Accordion expansível
    return (
      <List.Accordion
        id={item.id.toString()}
        title={item.description}
        description={`${item.category?.name || 'Sem categoria'} • ${new Date(item.date).toLocaleDateString('pt-BR')}`}
        left={() => <Avatar.Icon size={40} icon={item.category?.icon || 'receipt-text-outline'} color={color} style={{ backgroundColor }} />}
        right={() => (
          <Text style={[styles.amount, { color }]}>
            {isIncome ? '+ ' : '- '}R$ {item.amount.toFixed(2)}
          </Text>
        )}
      >
        {item.items.map(product => (
          <List.Item
            key={product.id}
            title={product.description}
            description={`Qtd: ${product.quantity} • Vl. Unit.: R$ ${product.unitPrice.toFixed(2)}`}
            titleStyle={styles.itemTitle}
            descriptionStyle={styles.itemDescription}
            style={styles.innerItem}
            right={() => <Text style={styles.itemTotal}>R$ {product.totalPrice.toFixed(2)}</Text>}
          />
        ))}
      </List.Accordion>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Todas as Transações" />
      </Appbar.Header>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text variant='titleMedium'>Nenhuma transação encontrada.</Text>
            <Text variant='bodySmall'>Adicione sua primeira transação!</Text>
          </View>
        )}
        renderItem={renderTransaction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { flexGrow: 1, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  amount: { alignSelf: 'center', fontWeight: 'bold', fontSize: 16 },
  innerItem: { paddingLeft: 60 }, // Adiciona um recuo para os itens da nota
  itemTitle: { fontSize: 14 },
  itemDescription: { fontSize: 12, opacity: 0.7 },
  itemTotal: { alignSelf: 'center', fontSize: 14, fontWeight: '500' },
});

export default TransactionListComponent;