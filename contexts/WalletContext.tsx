import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Wallet } from '../types';
import { useAuth } from './AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// MUDANÇA: A chave base agora é uma constante
const WALLETS_STORAGE_KEY_BASE = '@MoneyCare:wallets';

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
  const { token, signed, user } = useAuth(); // MUDANÇA: Obtemos o objeto 'user'

  // MUDANÇA: A chave de armazenamento agora inclui o ID do usuário
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null;
    return `${WALLETS_STORAGE_KEY_BASE}_${user.id}`;
  }, [user]);

  const syncWallets = useCallback(async () => {
    const key = getStorageKey();
    if (!signed || !token || !API_URL || !key) return;
    
    try {
      const response = await fetch(`${API_URL}/wallets`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const apiWallets = await response.json();
        await AsyncStorage.setItem(key, JSON.stringify(apiWallets));
        setWallets(apiWallets);
        console.log(`Caixinhas sincronizadas para o usuário ${user?.id}.`);
      }
    } catch (e) {
      console.error("Falha ao sincronizar caixinhas:", e);
    }
  }, [signed, token, getStorageKey, user]);

  // MUDANÇA: O efeito agora depende do status de login e do usuário
  useEffect(() => {
    async function loadInitialData() {
      const key = getStorageKey();
      if (!key) return;
      
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
            setWallets(JSON.parse(stored));
        } else {
            // Se não houver dados para este usuário, garanta que o estado esteja vazio
            setWallets([]);
        }
      } catch (e) { 
        console.error("Falha ao carregar caixinhas do AsyncStorage.", e);
      } finally {
        setLoading(false);
        // Tenta sincronizar com a API após carregar os dados locais
        await syncWallets();
      }
    }

    if (signed && user?.id) { 
        loadInitialData();
    } else {
        // Se o usuário deslogou, limpa o estado em memória
        setWallets([]);
        setLoading(false);
    }
  }, [signed, user, syncWallets, getStorageKey]);

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