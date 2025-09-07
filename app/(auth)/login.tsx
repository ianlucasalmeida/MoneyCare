import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { Link, router } from 'expo-router';
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineLarge" style={styles.title}>MoneyCare</Text>
      <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" mode="outlined" style={styles.input} />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
      
      <HelperText type="error" visible={!!error}>{error}</HelperText>

      <Button mode="contained" onPress={handleSignIn} style={styles.button} loading={loading} disabled={loading}>
        Entrar
      </Button>
      <Button mode="outlined" icon="google" style={styles.button} onPress={() => { /* Lógica futura */ }}>
        Entrar com Google
      </Button>
      <Link href="/register" style={styles.link}>
        Não tem uma conta? <Text style={[styles.linkAction, { color: theme.colors.primary }]}>Cadastre-se</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { alignSelf: 'center', marginBottom: 30, fontWeight: 'bold' },
  input: { marginBottom: 10 },
  button: { marginTop: 10, paddingVertical: 5 },
  link: { marginTop: 20, textAlign: 'center' },
  linkAction: { fontWeight: 'bold' }
});

export default LoginScreen;