import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TRANSACTIONS_STORAGE_KEY = '@MoneyCare:transactions';

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
  const { token, signed } = useAuth();

  // Função para carregar transações do AsyncStorage
  const loadFromStorage = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData).map((t: any) => ({ ...t, date: new Date(t.date) }));
        setTransactions(parsed);
      }
    } catch (e) {
      console.error("Falha ao carregar transações do AsyncStorage.", e);
    }
  }, []);

  // Função para buscar da API e atualizar o AsyncStorage
  const syncTransactions = useCallback(async () => {
    if (!signed || !token || !API_URL) {
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
        
        await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(parsedTransactions));
        setTransactions(parsedTransactions);
        console.log(`${parsedTransactions.length} transações sincronizadas da API.`);
      }
    } catch (e) {
      console.error("Falha ao sincronizar com a API. Os dados locais serão mantidos.", e);
    }
  }, [signed, token]);
  
  // Efeito de inicialização
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      await loadFromStorage(); // Carrega dados locais primeiro
      await syncTransactions(); // Depois tenta sincronizar
      setLoading(false);
    }
    initialize();
  }, [syncTransactions, loadFromStorage]);

  const addTransaction = useCallback(async (transactionData: any): Promise<boolean> => {
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
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(currentTransactions));
      
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
  }, [token, signed, transactions, syncTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, syncTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  return useContext(TransactionContext);
}