import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Button, Card, ProgressBar, Text, useTheme } from 'react-native-paper';

// Dados de exemplo para as caixinhas
const mockWallets = [
  { id: 1, name: 'Viagem para o Japão 🎌', icon: 'airplane', currentAmount: 4500, goalAmount: 15000 },
  { id: 2, name: 'Reserva de Emergência 🛡️', icon: 'shield-check', currentAmount: 2500, goalAmount: 6000 },
  { id: 3, name: 'Playstation 5 🎮', icon: 'gamepad-variant', currentAmount: 1800, goalAmount: 4500 },
];

const WalletsScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Minhas Caixinhas" subtitle="Organize seus sonhos e despesas" />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.content}>
        {mockWallets.map(wallet => (
          <Card key={wallet.id} style={styles.card} onPress={() => { /* Navegar para detalhes da caixinha */ }}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Avatar.Icon size={40} icon={wallet.icon} style={{backgroundColor: 'transparent'}} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.title}>{wallet.name}</Text>
              </View>
              <Text style={styles.progressText}>
                {`R$ ${wallet.currentAmount.toFixed(2)} de R$ ${wallet.goalAmount.toFixed(2)}`}
              </Text>
              <ProgressBar 
                progress={wallet.currentAmount / wallet.goalAmount} 
                color={theme.colors.primary} 
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        ))}

        <Button 
          mode="contained-tonal" 
          icon="plus" 
          style={styles.button}
          onPress={() => { /* Navegar para a tela de criar caixinha */ }}
        >
          Criar Nova Caixinha
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { marginLeft: 12, flex: 1 },
  progressText: { textAlign: 'right', marginBottom: 4, opacity: 0.8 },
  progressBar: { height: 8, borderRadius: 4 },
  button: { marginTop: 8, paddingVertical: 8 },
});

export default WalletsScreen;