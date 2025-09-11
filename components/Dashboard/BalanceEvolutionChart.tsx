import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

const chartWidth = Dimensions.get('window').width - 64; // Subtrai o padding do container

interface BalanceEvolutionChartProps {
  data: {
    labels: string[];
    datasets: { data: number[]; color: (opacity: number) => string; strokeWidth: number }[];
  };
}

export const BalanceEvolutionChart: React.FC<BalanceEvolutionChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.onSurface,
    strokeWidth: 2,
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.colors.primary },
  };
  
  const hasData = data?.datasets?.[0]?.data.some(v => v !== 0);

  return (
    <Card style={styles.card}>
      <Card.Title title="Evolução (últimos 7 dias)" right={(props) => <IconButton {...props} icon="chart-line" />} />
      <Card.Content>
        {hasData ? (
            <LineChart
                data={data}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                formatYLabel={(y) => `R$ ${Math.round(parseFloat(y))}`}
            />
        ) : (
            <View style={styles.emptyState}>
                <Text>Sem dados suficientes para exibir o gráfico.</Text>
            </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, elevation: 2 },
  chart: { borderRadius: 12, marginVertical: 8 },
  emptyState: { height: 220, justifyContent: 'center', alignItems: 'center' },
});