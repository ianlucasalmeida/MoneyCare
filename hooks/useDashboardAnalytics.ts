// hooks/useDashboardAnalytics.ts
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { Transaction } from '../types'; // Importe seus tipos

const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export const useDashboardAnalytics = (transactions: Transaction[], period: '7d' | '30d' | '3m' | '1y') => {
  const theme = useTheme();

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case '30d': startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
      case '3m': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
      case '1y': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
      default: return transactions;
    }
    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, period]);

  const analytics = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
    
    // Gráfico de Pizza
    const categoryData: { [key: string]: number } = {};
    filteredTransactions
      .filter(t => t.type === 'saida')
      .forEach(t => {
        const categoryName = t.category?.name || 'Outros';
        categoryData[categoryName] = (categoryData[categoryName] || 0) + t.amount;
      });

    const pieChartData = Object.entries(categoryData)
      .map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
        legendFontColor: theme.colors.onSurface,
        legendFontSize: 12,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5

    // Gráfico de Linha (sempre últimos 7 dias, independente do filtro)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const lineChartLabels = last7Days.map(d => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`);
    const lineChartValues = last7Days.map(date => {
        const dailyBalance = transactions
            .filter(t => new Date(t.date).toDateString() === date.toDateString())
            .reduce((balance, t) => balance + (t.type === 'entrada' ? t.amount : -t.amount), 0);
        return dailyBalance;
    });

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      pieChartData,
      lineChartData: {
          labels: lineChartLabels,
          datasets: [{ data: lineChartValues, color: () => theme.colors.primary, strokeWidth: 3 }],
      },
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, theme.colors.onSurface, theme.colors.primary, transactions]);

  // Transações recentes não dependem do filtro de período
  const recentTransactions = useMemo(() => 
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  [transactions]);

  return { ...analytics, recentTransactions };
};