import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';

const EditProfileScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    if (password && password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    
    // Lógica futura para salvar as alterações via API
    console.log('Salvar alterações:', { name, password });
    Alert.alert("Sucesso", "Perfil atualizado!");
    router.back();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="bodyLarge" style={styles.label}>Nome Completo</Text>
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text variant="bodyLarge" style={styles.label}>E-mail</Text>
      <TextInput
        mode="outlined"
        value={user?.email || ''}
        style={styles.input}
        disabled 
      />

      <Text variant="bodyLarge" style={styles.label}>Nova Senha</Text>
      <TextInput
        mode="outlined"
        placeholder="Deixe em branco para não alterar"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <Text variant="bodyLarge" style={styles.label}>Confirmar Nova Senha</Text>
       <TextInput
        mode="outlined"
        placeholder="Repita a nova senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <Button 
        mode="contained" 
        onPress={handleSaveChanges} 
        style={styles.button}
      >
        Salvar Alterações
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  label: { marginBottom: 5, marginLeft: 5 },
  input: { marginBottom: 20 },
  button: { marginTop: 10, paddingVertical: 6 },
});

// CERTIFIQUE-SE DE QUE ESTA LINHA EXISTE NO FINAL DO ARQUIVO
export default EditProfileScreen;