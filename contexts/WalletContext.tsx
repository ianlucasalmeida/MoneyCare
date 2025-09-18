import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Wallet } from '../types';
import { useAuth } from './AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const WALLETS_STORAGE_KEY = '@MoneyCare:wallets';

interface WalletContextData {
  wallets: Wallet[];
  loading: boolean;
  createWallet: (data: Omit<Wallet, 'id' | 'currentAmount'>) => Promise<boolean>;
  syncWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, signed } = useAuth();

  const syncWallets = useCallback(async () => {
    if (!signed || !token || !API_URL) return;
    
    try {
      const response = await fetch(`${API_URL}/wallets`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const apiWallets = await response.json();
        await AsyncStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(apiWallets));
        setWallets(apiWallets);
      }
    } catch (e) {
      console.error("Falha ao sincronizar caixinhas:", e);
    }
  }, [signed, token]);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(WALLETS_STORAGE_KEY);
        if (stored) setWallets(JSON.parse(stored));
      } catch (e) { 
        console.error("Falha ao carregar caixinhas do AsyncStorage.", e);
      } finally {
        setLoading(false);
        // Tenta sincronizar com a API após carregar os dados locais
        await syncWallets();
      }
    }
    loadInitialData();
  }, [syncWallets]);

  const createWallet = useCallback(async (data: Omit<Wallet, 'id' | 'currentAmount'>): Promise<boolean> => {
    if (!token || !API_URL) return false;
    
    try {
      const response = await fetch(`${API_URL}/wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await syncWallets(); // Sincroniza para obter a lista atualizada
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro de rede ao criar caixinha:", e);
      return false;
    }
  }, [token, syncWallets]);

  return (
    <WalletContext.Provider value={{ wallets, loading, createWallet, syncWallets }}>
      {children}
    </WalletContext.Provider>
  );
};

export function useWallets() {
  return useContext(WalletContext);
}