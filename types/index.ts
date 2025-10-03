export type TransactionType = 'entrada' | 'saida';

export interface Category {
  type: string;
  id: string;
  name: string;
  icon: string;
}

export interface TransactionItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  category: Category;
  items?: TransactionItem[];
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