import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card, IconButton, Text } from 'react-native-paper';

const chartWidth = Dimensions.get('window').width;

interface CategoryExpensesChartProps {
  data: { name: string; value: number; color: string; legendFontColor: string; legendFontSize: number }[];
  period: string;
}

export const CategoryExpensesChart: React.FC<CategoryExpensesChartProps> = ({ data, period }) => {
  // const theme = useTheme(); // Removed unused variable
  
  const chartConfig = {
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const periodLabels: Record<'7d' | '30d' | '3m' | '1y', string> = { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '3m': 'Últimos 3 meses', '1y': 'Último ano' };

  return (
    <Card style={styles.card}>
      <Card.Title title="Gastos por Categoria" subtitle={periodLabels[period as keyof typeof periodLabels]} right={(props) => <IconButton {...props} icon="chart-pie" />} />
      <Card.Content>
        {data.length > 0 ? (
            <PieChart
                data={data}
                width={chartWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        ) : (
            <View style={styles.emptyState}>
                <Text>Sem despesas no período para exibir o gráfico.</Text>
            </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, elevation: 2 },
  emptyState: { height: 220, justifyContent: 'center', alignItems: 'center' },
});