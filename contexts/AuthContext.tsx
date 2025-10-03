import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@MoneyCare:auth_token');
        const storedUser = await AsyncStorage.getItem('@MoneyCare:user_data');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar dados da sessão", e);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signIn(credentials: AuthCredentials) {
    if (!API_URL) return { success: false, message: 'API_URL não configurada no .env' };
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
      if (data.access_token && data.user) {
        setToken(data.access_token);
        setUser(data.user);
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
    await AsyncStorage.removeItem('@MoneyCare:auth_token');
    await AsyncStorage.removeItem('@MoneyCare:user_data');
    setUser(null);
    setToken(null);
  }

  async function signUp(userData: Omit<User, 'id'>) {
    if (!API_URL) return { success: false, message: 'API_URL não configurada no .env' };
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

  return (
    <AuthContext.Provider value={{ signed: !!token, user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}