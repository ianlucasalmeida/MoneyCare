import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Text, TextInput, ToggleButton, useTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { CategorySelector } from '../../components/AddTransaction/CategorySelector';
import { useTransactionForm } from '../../hooks/useTransactionForm';

const AddTransactionScreen = () => {
  const theme = useTheme();
  const { state, setField, saveTransaction, resetForm } = useTransactionForm();
  
  // Hook para pegar parâmetros passados pela navegação (do scanner)
  const params = useLocalSearchParams();

  // Efeito que roda sempre que os parâmetros de navegação mudam
  useEffect(() => {
    // Verifica se recebemos dados do scanner
    if (params.scannedData) {
      try {
        const data = JSON.parse(params.scannedData as string);
        
        // Preenche os campos do formulário com os dados recebidos
        setField('description', data.description || '');
        setField('amount', data.amount ? data.amount.toString().replace('.', ',') : '');
        setField('date', data.date ? new Date(data.date) : new Date());
        setField('category', data.category || null);
        setField('type', data.type || 'saida');
        setField('items', data.items || null);

      } catch (e) {
        console.error("Erro ao processar dados escaneados:", e);
      }
    }
  }, [params.scannedData, setField]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Nova Transação" />
        <Appbar.Action icon="delete-sweep-outline" onPress={() => {
            resetForm();
            // Limpa os parâmetros da rota para não preencher de novo
            router.setParams({ scannedData: undefined });
        }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Botão de Scanner */}
        <Button 
            icon="qrcode-scan" 
            mode="contained-tonal" 
            onPress={() => router.push({ pathname: '/scan' })}
            style={styles.scanButton}
            contentStyle={{ height: 50 }}
        >
            Escanear Nota Fiscal (QR Code)
        </Button>

        {/* Seção 1: Tipo de Transação */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Tipo</Text>
            <ToggleButton.Row
              onValueChange={(value: "saida" | "entrada") => value && setField('type', value)}
              value={state.type}
              style={styles.toggleRow}
            >
              <ToggleButton icon="arrow-down-bold-box" value="saida" style={styles.toggleButton} label="Despesa" />
              <ToggleButton icon="arrow-up-bold-box" value="entrada" style={styles.toggleButton} label="Receita" />
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
  scanButton: {
    marginBottom: 20,
    justifyContent: 'center',
  },
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
    marginBottom: 4
  },
  saveButton: { 
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default AddTransactionScreen;