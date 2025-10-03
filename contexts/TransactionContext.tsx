import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// MUDANÇA: A chave base agora é uma constante
const TRANSACTIONS_STORAGE_KEY_BASE = '@MoneyCare:transactions';

interface TransactionContextData {
  transactions: Transaction[];
  loading: boolean;
  syncTransactions: () => Promise<void>;
  addTransaction: (data: any) => Promise<boolean>;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, signed, user } = useAuth(); // MUDANÇA: Obtemos o objeto 'user'

  // MUDANÇA: A chave de armazenamento agora inclui o ID do usuário
  const getStorageKey = useCallback(() => {
    if (!user?.id) return null;
    return `${TRANSACTIONS_STORAGE_KEY_BASE}_${user.id}`;
  }, [user]);


  // Função para carregar transações do AsyncStorage
  const loadFromStorage = useCallback(async () => {
    const key = getStorageKey();
    if (!key) return;

    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        const parsed = JSON.parse(storedData).map((t: any) => ({ ...t, date: new Date(t.date) }));
        setTransactions(parsed);
      } else {
        // Se não houver dados para este usuário, garanta que o estado esteja vazio
        setTransactions([]);
      }
    } catch (e) {
      console.error("Falha ao carregar transações do AsyncStorage.", e);
    }
  }, [getStorageKey]);

  // Função para buscar da API e atualizar o AsyncStorage
  const syncTransactions = useCallback(async () => {
    const key = getStorageKey();
    if (!signed || !token || !API_URL || !key) {
      console.log("Usuário não logado ou API indisponível. Usando dados locais.");
      return;
    }
    
    console.log("Sincronizando com a API...");
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const apiTransactions = await response.json();
        const parsedTransactions = apiTransactions.map((t: any) => ({ ...t, date: new Date(t.date) }));
        
        await AsyncStorage.setItem(key, JSON.stringify(parsedTransactions));
        setTransactions(parsedTransactions);
        console.log(`${parsedTransactions.length} transações sincronizadas da API para o usuário ${user?.id}.`);
      }
    } catch (e) {
      console.error("Falha ao sincronizar com a API. Os dados locais serão mantidos.", e);
    }
  }, [signed, token, getStorageKey, user]);
  
  // MUDANÇA: O efeito agora depende do status de login e do usuário
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      await loadFromStorage(); // Carrega dados locais do usuário logado
      await syncTransactions(); // Sincroniza os dados do usuário logado
      setLoading(false);
    }

    if (signed && user?.id) {
      initialize();
    } else {
      // Se o usuário deslogou, limpa o estado em memória
      setTransactions([]);
      setLoading(false);
    }
  }, [signed, user, syncTransactions, loadFromStorage]);

  const addTransaction = useCallback(async (transactionData: any): Promise<boolean> => {
    const key = getStorageKey();
    if (!key) return false;

    // 1. Cria a transação com um ID local temporário
    const newTransaction: Transaction = {
      ...transactionData,
      id: `local_${Date.now()}`,
      date: new Date(transactionData.date),
      category: transactionData.category,
    };

    try {
      // 2. Atualiza o estado da UI e o AsyncStorage imediatamente
      const currentTransactions = [...transactions, newTransaction];
      setTransactions(currentTransactions);
      await AsyncStorage.setItem(key, JSON.stringify(currentTransactions));
      
      // 3. Tenta enviar para a API em segundo plano
      if (token && signed && API_URL) {
        // Prepara o payload para a API (com categoryId)
        const apiPayload = {
          ...transactionData,
          categoryId: transactionData.category.id
        };
        delete apiPayload.category;

        await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(apiPayload),
        });
        
        // Sincroniza para obter o ID real e garantir consistência
        await syncTransactions(); 
      }
      return true;
    } catch (err) {
      console.log('Erro ao salvar transação:', err);
      return false;
    }
  }, [token, signed, transactions, syncTransactions, getStorageKey]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, syncTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  return useContext(TransactionContext);
}