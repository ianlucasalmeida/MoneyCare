import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials } from '../types';

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<{ success: boolean; message: string }>;
  signUp: (userData: User) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = await AsyncStorage.getItem('@MoneyCare:user_session');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signUp(userData: User): Promise<{ success: boolean; message: string }> {
    try {
      const storedUsers = await AsyncStorage.getItem('@MoneyCare:users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'Este e-mail já está em uso.' };
      }

      users.push(userData);
      await AsyncStorage.setItem('@MoneyCare:users', JSON.stringify(users));
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Ocorreu um erro ao criar a conta.' };
    }
  }

  async function signIn(credentials: AuthCredentials): Promise<{ success: boolean; message: string }> {
    try {
      const storedUsers = await AsyncStorage.getItem('@MoneyCare:users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
      );

      if (foundUser) {
        // Não armazenamos a senha na sessão por segurança
        const userSession = { name: foundUser.name, email: foundUser.email };
        setUser(userSession);
        await AsyncStorage.setItem('@MoneyCare:user_session', JSON.stringify(userSession));
        return { success: true, message: 'Login bem-sucedido!' };
      }

      return { success: false, message: 'E-mail ou senha inválidos.' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Ocorreu um erro ao fazer login.' };
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@MoneyCare:user_session');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}