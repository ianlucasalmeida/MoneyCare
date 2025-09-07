import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Avatar, Text, Button, Card, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  // Define um usuário padrão para evitar erros caso `user` seja null
  const userName = user && 'name' in user ? user.name as string : 'Usuário';
  const userEmail = user && 'email' in user ? user.email as string : 'email@exemplo.com';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Perfil e Configurações" />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
                <Avatar.Icon size={80} icon="account-circle" />
                <Text variant="titleLarge" style={styles.userName}>
                  {userName}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {userEmail}
                </Text>
            </Card.Content>
        </Card>

        <Button 
            mode="contained-tonal" 
            icon="pencil" 
            style={styles.button}
            onPress={() => console.log('Editar perfil')}
        >
            Editar Perfil
        </Button>

        <Button 
            mode="contained-tonal" 
            icon="cog" 
            style={styles.button}
            onPress={() => console.log('Configurações')}
        >
            Configurações
        </Button>

        <Divider style={styles.divider} />

        <Button 
            mode="outlined" 
            icon="logout" 
            style={styles.logoutButton}
            textColor="#F44336"
            onPress={signOut} // Chama a função de logout do AuthContext
        >
            Sair
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
  },
  profileContent: {
      alignItems: 'center',
      padding: 16
  },
  userName: {
    marginTop: 15,
  },
  button: {
    width: '100%',
    marginTop: 15,
    paddingVertical: 5,
  },
  divider: {
    width: '100%',
    marginVertical: 30,
    height: 1
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 5,
    borderColor: '#F44336',
  }
});

export default ProfileScreen;