import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function ProfileStackLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        // Define um estilo padrão para os cabeçalhos das telas internas
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      
      {/* MUDANÇA: Adicionamos a nova tela de segurança ao navegador */}
      <Stack.Screen name="security" options={{ title: 'Segurança' }} />

    </Stack>
  );
}