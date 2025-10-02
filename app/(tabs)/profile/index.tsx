import React, { useMemo } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Surface, Text, useTheme } from 'react-native-paper';
import { ProfileHeader } from '../../../components/Profile/ProfileHeader';
import { ProfileMenu } from '../../../components/Profile/ProfileMenu';
import { useAuth } from '../../../contexts/AuthContext';
import { useTransactions } from '../../../contexts/TransactionContext';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  
  const { user, signOut } = useAuth();
  const { transactions } = useTransactions();

  const stats = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'saida');
    const uniqueCategories = new Set(transactions.map(t => t.category.name));
    const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactionCount: transactions.length,
      categoryCount: uniqueCategories.size,
      totalSpent: totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    };
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        
        {/* Header fixo no topo */}
        <View style={styles.headerContainer}>
          <ProfileHeader user={user} />
        </View>

        {/* Conteúdo scrollável */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          
          {/* Card de Estatísticas - agora com espaçamento adequado */}
          <View style={styles.statsSection}>
            <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.statsContent}>
                
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
                    {stats.transactionCount}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Transações
                  </Text>
                </View>

                <Divider style={[styles.statDivider, { backgroundColor: theme.colors.outline }]} />

                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
                    {stats.categoryCount}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Categorias
                  </Text>
                </View>

                <Divider style={[styles.statDivider, { backgroundColor: theme.colors.outline }]} />

                <View style={styles.statItem}>
                  <Text 
                    variant="titleMedium" 
                    style={[styles.statValue, { color: theme.colors.primary }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {stats.totalSpent}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Total Gasto
                  </Text>
                </View>

              </Card.Content>
            </Card>
          </View>

          {/* Menu de perfil */}
          <View style={styles.menuSection}>
            <ProfileMenu />
          </View>

          {/* Espaçador flexível para empurrar o botão para baixo quando necessário */}
          <View style={styles.flexSpacer} />

        </ScrollView>

        {/* Botão de logout fixo na parte inferior */}
        <View style={styles.logoutSection}>
          <Surface 
            style={[styles.logoutContainer, { backgroundColor: theme.colors.surface }]} 
            elevation={4}
          >
            <Button 
              mode="contained"
              icon="logout"
              onPress={signOut}
              style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
              contentStyle={styles.logoutButtonContent}
              labelStyle={styles.logoutButtonLabel}
            >
              Sair da Conta
            </Button>
          </Surface>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Seção de estatísticas
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statsCard: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
    minHeight: 80,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  statValue: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.8,
  },
  statDivider: {
    height: 40,
    width: 1,
    marginHorizontal: 8,
  },

  // Seção do menu
  menuSection: {
    paddingTop: 0,
  },

  // Espaçador flexível
  flexSpacer: {
    minHeight: 20,
  },

  // Seção do logout
  logoutSection: {
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 90,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  logoutContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutButton: {
    borderRadius: 16,
    minHeight: 48,
  },
  logoutButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;