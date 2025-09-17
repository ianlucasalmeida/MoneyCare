import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Transaction } from '../types';
import { initDatabase, fetchTransactions, insertTransaction } from '../src/db'; // Importamos nossas funções

// A API e o useAuth continuam importantes para a sincronização
import { useAuth } from './AuthContext';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface TransactionContextData {
  transactions: Transaction[];
  loading: boolean;
  createTransaction: (data: any) => Promise<void>;
  // Adicionaremos a sincronização depois
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, signed } = useAuth();

  // Função para carregar transações do banco de dados local
  const loadLocalTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const dbResult = await fetchTransactions();
      setTransactions(dbResult);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicializa o banco de dados e carrega os dados na primeira vez
  useEffect(() => {
    initDatabase().then(() => {
      loadLocalTransactions();
    }).catch(err => {
      console.log("Erro ao inicializar o DB:", err);
    });
  }, [loadLocalTransactions]);
  
  const createTransaction = useCallback(async (data: any) => {
    try {
      // 1. Salva a transação PRIMEIRO no banco de dados local
      await insertTransaction({
        description: data.description,
        amount: data.amount,
        type: data.type, // Assume que data.type já é do tipo TransactionType
        date: new Date(data.date),
        notes: data.notes,
        category: data.category,
      });

      // 2. Atualiza a lista na tela
      await loadLocalTransactions();
      
      // 3. Tenta enviar para a API em segundo plano (se online)
      if (token && signed) {
        fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        }).then(() => console.log("Nova transação sincronizada com a API."))
          .catch(err => console.log("Falha ao sincronizar nova transação.", err));
      }
    } catch (err) {
      console.log('Erro ao salvar transação:', err);
      throw err;
    }
  }, [token, signed, loadLocalTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, createTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactions() {
  return useContext(TransactionContext);
}