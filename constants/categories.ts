import { Category } from "../types";

// MUDANÇA: Adicionamos a propriedade "type" para filtrar
export const categories: Category[] = [
  // Entradas
  { id: '1', name: 'Salário', icon: 'cash', type: 'income' },
  { id: '2', name: 'Freelance', icon: 'briefcase-outline', type: 'income' },
  { id: '3', name: 'Investimentos', icon: 'chart-line', type: 'income' },
  { id: '4', name: 'Venda', icon: 'label-sale-outline', type: 'income' },
  { id: '5', name: 'Outras Receitas', icon: 'plus-circle-outline', type: 'income' },
  
  // Saídas
  { id: '10', name: 'Moradia', icon: 'home', type: 'expense' },
  { id: '11', name: 'Alimentação', icon: 'food-fork-drink', type: 'expense' },
  { id: '12', name: 'Transporte', icon: 'car', type: 'expense' },
  { id: '13', name: 'Saúde', icon: 'hospital-box-outline', type: 'expense' },
  { id: '14', name: 'Lazer', icon: 'ferris-wheel', type: 'expense' },
  { id: '15', name: 'Educação', icon: 'school', type: 'expense' },
  { id: '16', name: 'Compras', icon: 'cart-outline', type: 'expense' },
  { id: '17', name: 'Impostos', icon: 'bank', type: 'expense' },
  { id: '18', name: 'Outras Despesas', icon: 'shape-outline', type: 'expense' },
];