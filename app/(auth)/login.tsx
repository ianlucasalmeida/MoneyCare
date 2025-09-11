import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = () => {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('E-mail e senha são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signIn({ email, password });
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* MUDANÇA: Um único <View> para agrupar todo o conteúdo */}
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.title}>MoneyCare</Text>
              <Text variant="titleMedium" style={styles.subtitle}>Bem-vindo de volta!</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
              />
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleSignIn}
                style={styles.button}
                loading={loading}
                disabled={loading}
                labelStyle={styles.buttonLabel}
              >
                Entrar
              </Button>
              <Button
                mode="outlined"
                icon="google"
                style={styles.button}
                onPress={() => { /* Lógica futura */ }}
                labelStyle={styles.buttonLabel}
              >
                Entrar com Google
              </Button>
              <Link href="/register" style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Não tem uma conta? <Text style={[styles.linkAction, { color: theme.colors.primary }]}>Cadastre-se</Text>
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  // MUDANÇA: Agora o scrollViewContent vai centralizar o conteúdo
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centraliza o bloco de conteúdo verticalmente
    padding: 20,
  },
  // NOVO: Contêiner para manter os elementos juntos
  contentContainer: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // Aumenta o espaçamento
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    color: '#A9A9A9',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 12, // Aumenta o espaçamento
  },
  errorText: {
    fontSize: 14,
    minHeight: 20, // Garante espaço mesmo quando não há erro
  },
  footer: {
    width: '100%',
    paddingTop: 10,
  },
  button: {
    marginTop: 12, // Aumenta o espaçamento
    paddingVertical: 6, // Aumenta a altura do botão
  },
  buttonLabel: {
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 24, // Aumenta o espaçamento
  },
  linkText: {
    textAlign: 'center',
    color: '#A9A9A9',
  },
  linkAction: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;