import * as SQLite from 'expo-sqlite';
import { Transaction } from '../../types'; // Ajuste o caminho se necessário

// Abre o banco de dados usando o método padrão e mais compatível
const db = SQLite.openDatabase('moneycare.db');

export const initDatabase = () => {
  const promise = new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY NOT NULL,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          notes TEXT,
          category_name TEXT,
          category_icon TEXT
        );`,
        [],
        () => { resolve(); },
        (_, error): boolean => { reject(error); return false; }
      );
    });
  });
  return promise;
};

export const insertTransaction = (txData: Omit<Transaction, 'id'>) => {
  const promise = new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (description, amount, type, date, notes, category_name, category_icon) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          txData.description,
          txData.amount,
          txData.type,
          txData.date.toISOString(),
          txData.notes ?? null,
          txData.category.name,
          txData.category.icon,
        ],
        (_, result) => { resolve(result); },
        (_, error): boolean => { reject(error); return false; }
      );
    });
  });
  return promise;
};

export const fetchTransactions = () => {
  const promise = new Promise<Transaction[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM transactions ORDER BY date DESC;',
        [],
        (_, result) => {
          const transactions: Transaction[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const item = result.rows.item(i);
            // Garante que o ID seja um número, pois o tipo Transaction espera 'number'
            transactions.push({ ...item, id: Number(item.id), date: new Date(item.date) });
          }
          resolve(transactions);
        },
        (_, error): boolean => { reject(error); return false; }
      );
    });
  });
  return promise;
};