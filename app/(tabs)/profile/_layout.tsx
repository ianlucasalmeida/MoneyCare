import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Editar Perfil', headerBackTitle: 'Voltar' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações', headerBackTitle: 'Voltar' }} />
    </Stack>
  );
}