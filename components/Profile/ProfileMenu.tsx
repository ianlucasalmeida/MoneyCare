import { router } from 'expo-router'; // MUDANÇA: Importamos o router
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, List, Surface, Text, TouchableRipple } from 'react-native-paper';

const MENU_ITEMS = [
  { id: 'edit', title: 'Editar Perfil', description: 'Altere suas informações', icon: 'account-edit', href: '/profile/edit', color: '#2196F3' },
  { id: 'settings', title: 'Configurações', description: 'Preferências e notificações', icon: 'cog', href: '/profile/settings', color: '#FF9800' },
  { id: 'security', title: 'Segurança', description: 'Senha e autenticação', icon: 'shield-account', href: '/profile/security', color: '#4CAF50' },
  { id: 'help', title: 'Ajuda & Suporte', description: 'Fale conosco', icon: 'help-circle', href: '/soon', color: '#9C27B0' },
];

export const ProfileMenu: React.FC = () => {
  return (
    <View style={styles.menuSection}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Configurações da Conta
      </Text>
      <View style={styles.menuContainer}>
        {MENU_ITEMS.map(item => (
          // MUDANÇA: Removemos o <Link> daqui
          <Surface style={styles.menuItem} elevation={2} key={item.id}>
            <TouchableRipple onPress={() => router.push(item.href as any)}>
              <List.Item
                // MUDANÇA: Adicionamos a navegação diretamente no onPress
                // A linha acima com TouchableRipple já cuida do clique, mas deixamos aqui como alternativa
                // onPress={() => router.push(item.href as any)}
                title={item.title}
                description={item.description}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
                left={() => (
                  <Surface style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]} elevation={0}>
                    <List.Icon icon={item.icon} color={item.color} />
                  </Surface>
                )}
                right={() => <IconButton icon="chevron-right" size={24} />}
              />
            </TouchableRipple>
          </Surface>
        ))}
      </View>
    </View>
  );
};

// Os estilos permanecem os mesmos
const styles = StyleSheet.create({
  menuSection: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { marginBottom: 16, fontWeight: '600', opacity: 0.9 },
  menuContainer: { gap: 12 },
  menuItem: { borderRadius: 16, overflow: 'hidden' }, // overflow: 'hidden' para o ripple effect
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuTitle: { fontWeight: 'bold' },
  menuDescription: { fontSize: 13, opacity: 0.7, marginTop: 2 },
});