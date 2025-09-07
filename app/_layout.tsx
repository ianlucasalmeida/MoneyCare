import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack, useRouter, useSegments } from 'expo-router';
import { theme } from '../constants/theme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { signed, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (signed && inAuthGroup) {
      // Se o usuário está logado e na tela de auth, manda para o app principal
      router.replace('/(tabs)');
    } else if (!signed) {
      // Se não está logado, manda para o fluxo de auth
      router.replace('/(auth)');
    }
  }, [signed, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
        {/* Nossas duas principais seções do app */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}