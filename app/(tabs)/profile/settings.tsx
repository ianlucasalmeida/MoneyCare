import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';

// MUDANÇA: A definição de tipo foi movida para o topo do arquivo,
// fora de qualquer componente ou objeto.
type SettingItem = {
  title: string;
  description?: string;
  hasSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

const SettingsScreen = () => {
  const theme = useTheme();
  const [isNotificationsOn, setIsNotificationsOn] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(true); // Supondo que o tema escuro está ativo

  const settings: SettingItem[] = [
    {
      title: 'Receber notificações',
      hasSwitch: true,
      value: isNotificationsOn,
      onValueChange: setIsNotificationsOn,
    },
    {
      title: 'Tema Escuro',
      hasSwitch: true,
      value: isDarkTheme,
      onValueChange: setIsDarkTheme, // Lógica futura para trocar tema
    },
    {
      title: 'Versão do App',
      description: '1.0.0',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Preferências</List.Subheader>
        {settings.map((item, index) => (
          <React.Fragment key={item.title}>
            <List.Item
              title={item.title}
              description={item.description}
              right={() => 
                item.hasSwitch ? (
                  <Switch value={item.value} onValueChange={item.onValueChange} />
                ) : null
              }
            />
            {index < settings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default SettingsScreen;