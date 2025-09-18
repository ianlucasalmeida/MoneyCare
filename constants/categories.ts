import { Category } from "../types";

export const categories: Category[] = [
  // Entradas (income)
  { id: 1, name: 'Salário', icon: 'cash', type: 'income' },
  { id: 2, name: 'Freelance', icon: 'briefcase-outline', type: 'income' },
  { id: 3, name: 'Investimentos', icon: 'chart-line', type: 'income' },
  // MUDANÇA: Ícone corrigido de 'label-sale-outline' para 'cash-plus'
  { id: 4, name: 'Venda', icon: 'cash-plus', type: 'income' },
  { id: 5, name: 'Outras Receitas', icon: 'plus-circle-outline', type: 'income' },
  
  // Saídas (expense)
  { id: 10, name: 'Moradia', icon: 'home', type: 'expense' },
  { id: 11, name: 'Alimentação', icon: 'food-fork-drink', type: 'expense' },
  { id: 12, name: 'Transporte', icon: 'car', type: 'expense' },
  { id: 13, name: 'Saúde', icon: 'hospital-box-outline', type: 'expense' },
  { id: 14, name: 'Lazer', icon: 'ferris-wheel', type: 'expense' },
  { id: 15, name: 'Educação', icon: 'school', type: 'expense' },
  { id: 16, name: 'Compras', icon: 'cart-outline', type: 'expense' },
  { id: 17, name: 'Impostos', icon: 'bank', type: 'expense' },
  { id: 18, name: 'Outras Despesas', icon: 'shape-outline', type: 'expense' },
];