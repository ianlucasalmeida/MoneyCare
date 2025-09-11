import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // MUDANÇA: Usando a cor de fundo diretamente para garantir
        contentStyle: {
          backgroundColor: '#121212', // Cor de fundo escura do nosso tema
        },
      }}
    />
  );
}