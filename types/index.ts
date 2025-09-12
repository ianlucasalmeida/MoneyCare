export type TransactionType = 'entrada' | 'saida';

export interface Category {
  type: string;
  id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  category: Category;
}

export interface User {
  name: string;
  email: string;
  password?: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}