// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

// Este é o layout para o fluxo de autenticação.
// Usamos uma Stack para navegar entre a tela inicial, login e cadastro.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}