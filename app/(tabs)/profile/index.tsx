import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Surface, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { useTransactions } from '../../../contexts/TransactionContext'; // <<-- 1. ACESSANDO OS DADOS REAIS
import { ProfileHeader } from '../../../components/Profile/ProfileHeader';
import { ProfileMenu } from '../../../components/Profile/ProfileMenu';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  
  // 1. ACESSANDO OS DADOS REAIS dos nossos contextos
  const { user, signOut } = useAuth();
  const { transactions } = useTransactions();

  // 2. CALCULANDO ESTATÍSTICAS DINÂMICAS com base nos dados reais
  const stats = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'saida');
    const uniqueCategories = new Set(transactions.map(t => t.category.name));
    
    // Métrica mais útil do que "dias ativo"
    const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactionCount: transactions.length,
      categoryCount: uniqueCategories.size,
      totalSpent: totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    };
  }, [transactions]); // Recalcula apenas quando as transações mudam

  return (
    // MUDANÇA DE LAYOUT: A View principal agora tem flex: 1 e não é mais rolável
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      {/* O cabeçalho fica aqui, fixo no topo */}
      <ProfileHeader user={user} />

      {/* MUDANÇA DE LAYOUT: A ScrollView agora envolve apenas o conteúdo que deve rolar */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Card de Estatísticas Rápidas */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            
            {/* 3. EXIBINDO OS DADOS DINÂMICOS */}
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.transactionCount}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Transações</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.categoryCount}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Categorias</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.totalSpent}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Total Gasto</Text>
            </View>

          </Card.Content>
        </Card>

        {/* Componente de Menu Abstraído */}
        <ProfileMenu />

        {/* Botão de Logout */}
        <Surface style={styles.logoutContainer} elevation={4}>
          <Button 
            mode="contained"
            icon="logout"
            onPress={signOut}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            labelStyle={styles.logoutButtonLabel}
            buttonColor={theme.colors.error}
          >
            Sair da Conta
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 // Garante que o contêiner principal ocupe toda a tela
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: 20 
  },
  statsCard: { 
    marginHorizontal: 20, 
    marginTop: -40, // Efeito de sobreposição sobre o header
    borderRadius: 16, 
    elevation: 8 
  },
  statsContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  statItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  statValue: { 
    fontWeight: 'bold' 
  },
  statLabel: { 
    opacity: 0.7, 
    marginTop: 2 
  },
  statDivider: { 
    height: 30, 
    width: 1 
  },
  logoutContainer: { 
    margin: 20, 
    marginTop: 30, 
    borderRadius: 16 
  },
  logoutButton: { 
    borderRadius: 16 
  },
  logoutButtonContent: { 
    paddingVertical: 8 
  },
  logoutButtonLabel: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
});

export default ProfileScreen;