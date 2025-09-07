import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, Card, Divider, useTheme, List } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Icon size={80} icon="account-circle" style={{ backgroundColor: theme.colors.primaryContainer }} />
          <Text variant="titleLarge" style={styles.userName}>{user?.name}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{user?.email}</Text>
        </Card.Content>
      </Card>

      <List.Section style={styles.listSection}>
        <Link href="/profile/edit" asChild>
          <List.Item
            title="Editar Perfil"
            left={() => <List.Icon icon="pencil" />}
            right={() => <List.Icon icon="chevron-right" />}
          />
        </Link>
        <Link href="/profile/settings" asChild>
          <List.Item
            title="Configurações"
            left={() => <List.Icon icon="cog" />}
            right={() => <List.Icon icon="chevron-right" />}
          />
        </Link>
      </List.Section>

      <Button mode="contained" icon="logout" onPress={signOut} style={styles.logoutButton}>
        Sair
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between' },
  profileCard: { },
  profileContent: { alignItems: 'center', padding: 16 },
  userName: { marginTop: 15 },
  listSection: { flex: 1, marginTop: 20 },
  logoutButton: { margin: 20, paddingVertical: 5, backgroundColor: '#B00020' }
});

export default ProfileScreen;