import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip, Surface } from 'react-native-paper';


// ... (estilos necessários)

const styles = StyleSheet.create({
  periodFilter: {
    padding: 8,
    elevation: 2,
    marginVertical: 8,
    borderRadius: 8,
  },
});

const periods = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '3m', label: '3 meses' },
  { key: '1y', label: '1 ano' }
];

type PeriodFilterProps = {
  selectedPeriod: string;
  onSelectPeriod: (periodKey: string) => void;
};

export const PeriodFilter: React.FC<PeriodFilterProps> = ({ selectedPeriod, onSelectPeriod }) => (
  <Surface style={styles.periodFilter}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {periods.map((period) => (
        <Chip
          key={period.key}
          mode={selectedPeriod === period.key ? 'flat' : 'outlined'}
          onPress={() => onSelectPeriod(period.key)}
          // ... (outras props)
        >
          {period.label}
        </Chip>
      ))}
    </ScrollView>
  </Surface>
);