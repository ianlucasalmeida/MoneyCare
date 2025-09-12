import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';

const SecurityScreen = () => {
  const theme = useTheme();
  const [twoFactor, setTwoFactor] = React.useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Autenticação</List.Subheader>
        <List.Item
          title="Alterar Senha"
          description="Recomendado fazer a cada 6 meses"
          left={() => <List.Icon icon="lock-reset" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => console.log('Navegar para alterar senha')}
        />
        <Divider />
        <List.Item
          title="Autenticação de Dois Fatores"
          left={() => <List.Icon icon="two-factor-authentication" />}
          right={() => <Switch value={twoFactor} onValueChange={setTwoFactor} />}
        />
        <Divider />
        <List.Subheader>Sessões Ativas</List.Subheader>
        <List.Item
          title="Gerenciar Dispositivos"
          description="Ver onde sua conta está conectada"
          left={() => <List.Icon icon="cellphone-link" />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => console.log('Navegar para gerenciar dispositivos')}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SecurityScreen;