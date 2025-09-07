import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const RegisterScreen = () => {
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
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Criar Conta</Text>
      <TextInput label="Nome Completo" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
      <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" mode="outlined" style={styles.input} />
      <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
      
      <HelperText type="error" visible={!!error}>{error}</HelperText>

      <Button mode="contained" onPress={handleSignUp} style={styles.button} loading={loading} disabled={loading}>
        Criar Conta
      </Button>
      <Link href="/login" style={styles.link}>
        Já tem uma conta? <Text style={styles.linkAction}>Faça Login</Text>
      </Link>
    </View>
  );
};

// ... estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { alignSelf: 'center', marginBottom: 30, fontWeight: 'bold' },
  input: { marginBottom: 10 },
  button: { marginTop: 10, paddingVertical: 5 },
  link: { marginTop: 20, textAlign: 'center' },
  linkAction: { color: '#FACC15', fontWeight: 'bold' }
});

export default RegisterScreen;