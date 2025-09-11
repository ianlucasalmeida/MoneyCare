import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const RegisterScreen = () => {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signUp({ name, email, password });
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso!', result.message, [
        { text: 'Ir para Login', onPress: () => router.push('/login') }
      ]);
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
              <Text variant="headlineLarge" style={styles.title}>Crie sua Conta</Text>
              <Text variant="titleMedium" style={styles.subtitle}>
                Comece a organizar suas finanças hoje.
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="Nome Completo"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
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
                onPress={handleSignUp}
                style={styles.button}
                loading={loading}
                disabled={loading}
                labelStyle={styles.buttonLabel}
              >
                Criar Conta
              </Button>
              <Link href="/login" style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Já tem uma conta? <Text style={[styles.linkAction, { color: theme.colors.primary }]}>Faça Login</Text>
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// MUDANÇA: Estilos atualizados para centralização e melhores espaçamentos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centraliza o bloco de conteúdo verticalmente
    padding: 20,
  },
  contentContainer: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    minHeight: 20,
  },
  footer: {
    width: '100%',
    paddingTop: 10,
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 24,
  },
  linkText: {
    textAlign: 'center',
    color: '#A9A9A9',
  },
  linkAction: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;