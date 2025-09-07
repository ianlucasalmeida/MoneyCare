import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Text, Divider, useTheme } from 'react-native-paper';

const SettingsScreen = () => {
  const theme = useTheme();
  const [isNotificationsOn, setIsNotificationsOn] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Notificações</List.Subheader>
        <List.Item
          title="Receber notificações"
          right={() => <Switch value={isNotificationsOn} onValueChange={setIsNotificationsOn} />}
        />
        <Divider />
        <List.Subheader>Aparência</List.Subheader>
        <List.Item
          title="Tema Escuro"
          right={() => <Switch value={true} disabled />} // Apenas demonstrativo
        />
        <Divider />
        <List.Subheader>Sobre</List.Subheader>
        <List.Item title="Versão do App" description="1.0.0" />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default SettingsScreen;