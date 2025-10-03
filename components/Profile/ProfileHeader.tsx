import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Avatar, Surface, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '../../../types'; 


interface ProfileHeaderProps {
  user: User | null;
}

// Função auxiliar para pegar as iniciais
const getInitials = (name: string | undefined) => 
  name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U';

// MUDANÇA: O componente agora recebe 'user' como uma prop
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={[theme.colors.primaryContainer, theme.colors.surface]}
      style={styles.headerGradient}
    >
      <Animated.View style={[styles.profileHeader, { opacity: fadeAnim }]}>
        <View style={styles.avatarContainer}>
          <Avatar.Text 
            size={100}
            // MUDANÇA: Usa os dados da prop 'user'
            label={getInitials(user?.name)}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.onlineIndicator} />
        </View>
        <Text variant="headlineSmall" style={styles.userName}>
          {/* MUDANÇA: Usa os dados da prop 'user' com um fallback */}
          {user?.name || 'Usuário'}
        </Text>
        <Text variant="bodyLarge" style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
          {/* MUDANÇA: Usa os dados da prop 'user' com um fallback */}
          {user?.email || 'email@exemplo.com'}
        </Text>
        <Surface style={styles.statusBadge} elevation={1}>
          <Text variant="labelSmall" style={styles.statusText}>Conta Verificada</Text>
        </Surface>
      </Animated.View>
    </LinearGradient>
  );
};

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: { alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  avatarLabel: { fontSize: 32, fontWeight: 'bold' },
  onlineIndicator: { position: 'absolute', bottom: 5, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#4CAF50', borderWidth: 3, borderColor: '#fff' },
  userName: { fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  userEmail: { marginBottom: 12, opacity: 0.8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  statusText: { color: '#4CAF50', fontWeight: '600' },
});