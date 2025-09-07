import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, Text, useTheme, Card, Searchbar } from 'react-native-paper';

interface Rate {
  code: string;
  value: number;
}

const CurrenciesScreen: React.FC = () => {
  const theme = useTheme();
  const [rates, setRates] = useState<Rate[]>([]);
  const [filteredRates, setFilteredRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=BRL')
      .then(response => response.json())
      .then(data => {
        const rateList: Rate[] = Object.keys(data.rates).map(key => ({
          code: key,
          value: 1 / data.rates[key], // Invertido para mostrar quanto 1 BRL vale na moeda
        }));
        setRates(rateList);
        setFilteredRates(rateList);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = rates.filter(rate => 
        rate.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRates(filtered);
    } else {
      setFilteredRates(rates);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Cotação de Moedas" subtitle="Base: Real Brasileiro (BRL)" />
      </Appbar.Header>
      <Searchbar
        placeholder="Buscar moeda (ex: USD)"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredRates}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium">{item.code}</Text>
              <Text variant="bodyLarge">R$ {item.value.toFixed(4)}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchbar: { margin: 10 },
  list: { paddingHorizontal: 10, paddingBottom: 100 }, // Padding para a barra flutuante
  card: { marginVertical: 5 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default CurrenciesScreen;