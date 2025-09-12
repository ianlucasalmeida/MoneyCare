import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Transaction } from '../types'; // Certifique-se que o caminho para seus tipos está correto

interface TransactionContextData {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega as transações salvas quando o app inicia
  useEffect(() => {
    async function loadTransactions() {
      try {
        const storedTransactions = await AsyncStorage.getItem('@MoneyCare:transactions');
        if (storedTransactions) {
          // Converte as datas de string de volta para objetos Date
          const parsedTransactions = JSON.parse(storedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date),
          }));
          setTransactions(parsedTransactions);
        }
      } catch (e) {
        console.error("Failed to load transactions.", e);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  async function addTransaction(transaction: Omit<Transaction, 'id' | 'date'>) {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: new Date().toISOString() + Math.random(),
        date: new Date(),
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      
      await AsyncStorage.setItem('@MoneyCare:transactions', JSON.stringify(updatedTransactions));
    } catch (e) {
      console.error("Failed to save transaction.", e);
    }
  }
  
  // O provider apenas envolve os componentes filhos, sem renderizar nada visual.
  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  return useContext(TransactionContext);
}