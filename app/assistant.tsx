import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Text, useTheme } from 'react-native-paper';

const AssistantScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Assistente MoneyCare" />
      </Appbar.Header>
      <View style={styles.content}>
        <Avatar.Icon icon="robot-outline" size={80} />
        <Text variant="titleLarge" style={styles.title}>Em breve!</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Estou aprendendo sobre suas finanças para te dar as melhores dicas.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  subtitle: { textAlign: 'center', opacity: 0.7 },
});

export default AssistantScreen;