import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Divider, IconButton, Text } from 'react-native-paper';

interface Rates { [key: string]: number }

const currencyInfo: Record<string, { name: string; flag: string }> = {
  USD: { name: 'Dólar', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  GBP: { name: 'Libra', flag: '🇬🇧' },
  JPY: { name: 'Iene', flag: '🇯🇵' },
};

export const CurrencyRatesCard = () => {
  const [rates, setRates] = useState<Rates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.frankfurter.app/latest?from=BRL&to=USD,EUR,GBP,JPY');
      const data = await response.json();
      if (data.rates) {
        setRates({
          USD: 1 / data.rates.USD, EUR: 1 / data.rates.EUR,
          GBP: 1 / data.rates.GBP, JPY: 1 / data.rates.JPY,
        });
      }
    } catch (error) { console.error('Erro ao buscar cotações:', error); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchRates() }, [fetchRates]);

  return (
    <Card style={styles.card}>
      <Card.Title 
        title="Cotações" 
        right={() => isLoading ? <ActivityIndicator style={{marginRight: 12}} /> : <IconButton icon="refresh" onPress={fetchRates} />} 
      />
      <Card.Content>
        {rates && Object.entries(rates).map(([currency, rate], index) => (
          <React.Fragment key={currency}>
            <View style={styles.rateItem}>
              <View>
                <Text variant="titleMedium">{currencyInfo[currency].flag} {currency}</Text>
                <Text variant="bodySmall" style={styles.currencyName}>{currencyInfo[currency].name}</Text>
              </View>
              <Text variant="titleMedium" style={styles.rateValue}>R$ {rate.toFixed(2)}</Text>
            </View>
            {index < Object.keys(rates).length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, elevation: 2 },
  rateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  currencyName: { opacity: 0.7 },
  rateValue: { fontWeight: 'bold' },
});