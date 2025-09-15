import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials } from '../types';

// Lembre-se de configurar sua API_URL corretamente
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.106:3000';

interface AuthContextData {
  signed: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<{ success: boolean; message: string }>;
  signUp: (userData: Omit<User, 'id'>) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados do dispositivo ao iniciar o app
  useEffect(() => {
    async function loadStorageData() {
      try {
        // Tenta carregar tanto o token quanto os dados do usuário
        const storedToken = await AsyncStorage.getItem('@MoneyCare:auth_token');
        const storedUser = await AsyncStorage.getItem('@MoneyCare:user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar dados do AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signUp(userData: Omit<User, 'id'>) {
    // ... (função signUp continua a mesma)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return { success: response.ok, message: data.message || 'Erro ao criar conta.' };
    } catch (e) {
      return { success: false, message: 'Não foi possível conectar ao servidor.' };
    }
  }

  async function signIn(credentials: AuthCredentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Erro ao fazer login.' };
      }

      // MUDANÇA CRÍTICA: Agora salvamos tanto o token quanto os dados do usuário
      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser(data.user);
        
        // Salva ambos no dispositivo para a próxima vez que o app abrir
        await AsyncStorage.setItem('@MoneyCare:auth_token', data.access_token);
        await AsyncStorage.setItem('@MoneyCare:user_data', JSON.stringify(data.user));

        return { success: true, message: 'Login bem-sucedido!' };
      } else {
         return { success: false, message: 'Resposta da API inválida.' };
      }
    } catch (e) {
      return { success: false, message: 'Não foi possível conectar ao servidor.' };
    }
  }

  async function signOut() {
    // Limpa tudo relacionado à sessão
    await AsyncStorage.removeItem('@MoneyCare:auth_token');
    await AsyncStorage.removeItem('@MoneyCare:user_data');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!token, user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}