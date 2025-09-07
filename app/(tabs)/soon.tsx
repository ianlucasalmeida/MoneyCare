import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Card, Text, useTheme, Avatar } from 'react-native-paper';

const SoonScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Metas" />
      </Appbar.Header>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon icon="rocket-launch-outline" size={64} style={styles.icon} />
            <Text variant="titleLarge" style={styles.title}>Em breve!</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Estamos trabalhando nesta funcionalidade para te ajudar a alcançar suas metas financeiras.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
  },
});

export default SoonScreen;