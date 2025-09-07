// app/(auth)/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StartScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="finance" size={120} color={theme.colors.primary} />
        <Text variant="headlineLarge" style={styles.title}>MoneyCare</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Seu assistente financeiro pessoal.
        </Text>
      </View>
      <Link href="/login" asChild>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Organizar minhas finanças
        </Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#A9A9A9',
  },
  button: {
    borderRadius: 50,
    paddingVertical: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default StartScreen;