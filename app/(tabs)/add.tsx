import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, TextInput, ToggleButton, useTheme } from 'react-native-paper';
import { CategorySelector } from '../../components/AddTransaction/CategorySelector'; // Nosso novo componente
import { useTransactionForm } from '../../hooks/useTransactionForm'; // Nosso novo hook

const AddTransactionScreen = () => {
  const theme = useTheme();
  const { state, setField, saveTransaction, resetForm } = useTransactionForm();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Nova Transação" />
        <Appbar.Action icon="delete-sweep-outline" onPress={resetForm} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Seletor de Tipo */}
        <ToggleButton.Row
          onValueChange={(value) => value && setField('type', value)}
          value={state.type}
          style={styles.toggleRow}
        >
          <ToggleButton icon="arrow-down-bold-box" value="saida" style={styles.toggleButton}>Despesa</ToggleButton>
          <ToggleButton icon="arrow-up-bold-box" value="entrada" style={styles.toggleButton}>Receita</ToggleButton>
        </ToggleButton.Row>

        {/* Formulário */}
        <TextInput
          label="Descrição *"
          value={state.description}
          onChangeText={(text) => setField('description', text)}
          mode="outlined"
          style={styles.input}
          error={!!state.errors.description}
        />
        
        <TextInput
          label="Valor (R$) *"
          value={state.amount}
          onChangeText={(text) => setField('amount', text.replace(/[^0-9,]/g, ''))}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          error={!!state.errors.amount}
        />
        
        <CategorySelector 
          selectedCategory={state.category}
          onSelect={(category) => setField('category', category)}
          type={state.type}
          error={state.errors.category}
        />
        
        <TextInput
          label="Observações (opcional)"
          value={state.notes}
          onChangeText={(text) => setField('notes', text)}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        {/* Ações */}
        <Button
          mode="contained"
          onPress={saveTransaction}
          style={styles.saveButton}
          loading={state.isLoading}
          disabled={state.isLoading}
          icon="check"
        >
          Salvar Transação
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  toggleRow: { marginBottom: 16, width: '100%' },
  toggleButton: { flex: 1 },
  input: { marginBottom: 16 },
  saveButton: { paddingVertical: 8, marginTop: 16 },
});

export default AddTransactionScreen;