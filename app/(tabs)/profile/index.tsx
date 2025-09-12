import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Surface, Text, useTheme } from 'react-native-paper';
import { ProfileHeader } from '../../../components/Profile/ProfileHeader'; // Importa o novo componente
import { ProfileMenu } from '../../../components/Profile/ProfileMenu'; // Importa o novo componente
import { useAuth } from '../../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  // Dados para o card de estatísticas. No futuro, podem vir dos seus hooks.
  const stats = { transactions: 12, categories: 3, daysActive: '30d' };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Componente de Cabeçalho Abstraído */}
        <ProfileHeader user={user} />

        {/* Card de Estatísticas Rápidas */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.transactions}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Transações</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.categories}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Categorias</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statValue}>{stats.daysActive}</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Ativo</Text>
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
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  statsCard: { marginHorizontal: 20, marginTop: -40, borderRadius: 16, elevation: 8 },
  statsContent: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontWeight: 'bold' },
  statLabel: { opacity: 0.7, marginTop: 2 },
  statDivider: { height: 30, width: 1 },
  logoutContainer: { margin: 20, marginTop: 30, borderRadius: 16 },
  logoutButton: { borderRadius: 16 },
  logoutButtonContent: { paddingVertical: 8 },
  logoutButtonLabel: { fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;