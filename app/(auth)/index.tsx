import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native'; // MUDANÇA: Adicionado SafeAreaView
import { Button, Text, useTheme } from 'react-native-paper';

const StartScreen = () => {
  const theme = useTheme();

  return (
    // MUDANÇA: A tela agora é envolvida por um SafeAreaView, assim como as outras
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // MUDANÇA: Adicionado estilo para o SafeAreaView
  safeArea: {
    flex: 1,
  },
  // MUDANÇA: O container agora é uma View normal dentro do SafeAreaView
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