import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { Transaction } from '../types';

const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export const useDashboardAnalytics = (transactions: Transaction[], period: string) => {
  const theme = useTheme();

  // 1. Filtra as transações com base no período selecionado
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '3m': startDate.setMonth(now.getMonth() - 3); break;
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
      default: return transactions;
    }
    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, period]);

  // 2. Calcula todas as métricas e dados para os gráficos
  const analytics = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    // Dados para Gráfico de Pizza (Gastos por Categoria)
    const categoryData: { [key: string]: number } = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const categoryName = t.category?.name || 'Outros';
        categoryData[categoryName] = (categoryData[categoryName] || 0) + t.amount;
      });

    const pieChartData = Object.entries(categoryData)
      .map(([name, value], index) => ({
        name: `${name} (${((value / expenses) * 100).toFixed(0)}%)`, // Adiciona porcentagem
        value: Number(value.toFixed(2)),
        color: CHART_COLORS[index % CHART_COLORS.length],
        legendFontColor: theme.colors.onSurface,
        legendFontSize: 12,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Dados para Gráfico de Linha (sempre últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const lineChartLabels = last7Days.map(d => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`);
    const lineChartValues = last7Days.map(date => {
        return transactions
            .filter(t => new Date(t.date).toDateString() === date.toDateString())
            .reduce((dailyBalance, t) => dailyBalance + (t.type === 'income' ? t.amount : -t.amount), 0);
    });

    // LOGS DE DEPURAÇÃO: Verifique o que está sendo gerado
    console.log('--- ANÁLISE DA DASHBOARD ---');
    console.log('Período:', period, '| Transações Filtradas:', filteredTransactions.length);
    console.log('Saldo:', balance, '| Entradas:', income, '| Saídas:', expenses);
    console.log('Dados do Gráfico de Pizza:', JSON.stringify(pieChartData, null, 2));
    console.log('----------------------------');


    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: balance,
      pieChartData,
      lineChartData: {
          labels: lineChartLabels,
          datasets: [{ data: lineChartValues, color: () => theme.colors.primary, strokeWidth: 3 }],
      },
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, theme.colors.onSurface, theme.colors.primary, transactions]);

  const recentTransactions = useMemo(() => 
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  [transactions]);

  return { ...analytics, recentTransactions };
};