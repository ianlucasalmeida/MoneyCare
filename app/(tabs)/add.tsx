// app/(tabs)/add.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, ToggleButton, Chip, Text, useTheme } from 'react-native-paper';
import { useTransactions } from '../../contexts/TransactionContext';
import { expenseCategories } from '../../constants/categories';
import { Category } from '../../types';

const AddTransactionScreen: React.FC = () => {
  const theme = useTheme();
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'entrada' | 'saida'>('saida');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSave = () => {
    if (!amount || !description || !selectedCategory) {
      // Adicionar alerta para o usuário
      return;
    }
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
    });
    // Limpar campos e talvez navegar para a dashboard
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header><Appbar.Content title="Adicionar Transação" /></Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <ToggleButton.Row onValueChange={value => value && setType(value as any)} value={type}>
          <ToggleButton icon="arrow-down-bold-box" value="saida">Saída</ToggleButton>
          <ToggleButton icon="arrow-up-bold-box" value="entrada">Entrada</ToggleButton>
        </ToggleButton.Row>
        <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} />
        <TextInput label="Valor (R$)" value={amount} onChangeText={setAmount} mode="outlined" keyboardType="numeric" style={styles.input} />
        
        <Text variant="titleMedium" style={styles.categoryTitle}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {expenseCategories.map(cat => (
            <Chip 
              key={cat.id} 
              icon={cat.icon} 
              style={styles.chip}
              selected={selectedCategory?.id === cat.id}
              onPress={() => setSelectedCategory(cat)}
            >
              {cat.name}
            </Chip>
          ))}
        </View>

        <Button mode="contained" style={styles.button} onPress={handleSave}>Salvar</Button>
      </ScrollView>
    </View>
  );
};
// Adicionar novos estilos
const styles = StyleSheet.create({
  content: { padding: 20 },
  input: { marginTop: 15 },
  categoryTitle: { marginTop: 20, marginBottom: 10 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { },
  button: { paddingVertical: 8, marginTop: 30 }
});


export default AddTransactionScreen;