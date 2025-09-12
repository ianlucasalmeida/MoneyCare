import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Text, TextInput, ToggleButton, useTheme } from 'react-native-paper';
import { CategorySelector } from '../../components/AddTransaction/CategorySelector';
import { useTransactionForm } from '../../hooks/useTransactionForm';

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
        {/* Seção 1: Tipo de Transação */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Tipo</Text>
            <ToggleButton.Row
              onValueChange={(value) => value && setField('type', value)}
              value={state.type}
              style={styles.toggleRow}
            >
              <ToggleButton icon="arrow-down-bold-box" value="saida" style={styles.toggleButton}>Despesa</ToggleButton>
              <ToggleButton icon="arrow-up-bold-box" value="entrada" style={styles.toggleButton}>Receita</ToggleButton>
            </ToggleButton.Row>
          </Card.Content>
        </Card>

        {/* Seção 2: Detalhes Principais */}
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>Detalhes</Text>
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
            </Card.Content>
        </Card>

        {/* Seção 3: Categoria */}
        <CategorySelector 
          selectedCategory={state.category}
          onSelect={(category) => setField('category', category)}
          type={state.type}
          error={state.errors.category}
        />
        
        {/* Seção 4: Detalhes Adicionais */}
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>Adicionais</Text>
                <TextInput
                    label="Observações (opcional)"
                    value={state.notes}
                    onChangeText={(text) => setField('notes', text)}
                    mode="outlined"
                    style={styles.input}
                    multiline
                    numberOfLines={3}
                />
            </Card.Content>
        </Card>

        {/* Ações */}
        <Button
          mode="contained"
          onPress={saveTransaction}
          style={styles.saveButton}
          loading={state.isLoading}
          disabled={state.isLoading}
          icon="check-circle-outline"
          contentStyle={{ height: 50 }}
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
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  toggleRow: {
    width: '100%',
  },
  toggleButton: { 
    flex: 1 
  },
  input: { 
    marginBottom: 0 // Removido para que o HelperText do CategorySelector funcione
  },
  saveButton: { 
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default AddTransactionScreen;