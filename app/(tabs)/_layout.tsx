import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TransactionProvider } from '../../contexts/TransactionContext';

const TABS_CONFIG = [
  { name: 'index', icon: 'view-dashboard-outline', activeIcon: 'view-dashboard', label: 'Dashboard' },
  { name: 'list', icon: 'format-list-bulleted', activeIcon: 'format-list-bulleted', label: 'Lista de Transações' },
  { name: 'add', icon: 'plus-circle-outline', activeIcon: 'plus-circle', label: 'Adicionar Transação', isCentral: true },
  { name: 'currencies', icon: 'currency-usd', activeIcon: 'currency-usd', label: 'Moedas' },
  { name: 'soon', icon: 'bullseye-arrow', activeIcon: 'bullseye-arrow', label: 'Metas' },
  { name: 'profile', icon: 'account-circle-outline', activeIcon: 'account-circle', label: 'Perfil' },
];

const TAB_BAR_STYLE = {
  height: 55,
  borderRadius: 30,
  bottomOffset: Platform.OS === 'ios' ? 34 : 20,
  iconSize: {
    default: 29,
    central: 30,
  },
  colors: {
    active: '#FFFFFF',
    inactive: 'rgba(255, 255, 255, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.25)',
  }
};

export default function TabLayout() {
  const theme = useTheme();

  return (
    <TransactionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: TAB_BAR_STYLE.colors.active,
          tabBarInactiveTintColor: TAB_BAR_STYLE.colors.inactive,
          
          // MUDANÇA CRÍTICA: Removemos completamente o label da renderização
          tabBarShowLabel: false,
          tabBarLabel: () => null,

          tabBarItemStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 0, // Garante que não haja espaçamento vertical extra
          },
          
          tabBarStyle: {
            position: 'absolute',
            bottom: TAB_BAR_STYLE.bottomOffset,
            left: 20,
            right: 20,
            height: TAB_BAR_STYLE.height,
            borderRadius: TAB_BAR_STYLE.borderRadius,
            backgroundColor: theme.colors.primary,
            shadowColor: TAB_BAR_STYLE.colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 12,
            borderTopWidth: 0,
          },
        }}
      >
        {TABS_CONFIG.map(tab => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarAccessibilityLabel: tab.label,
              tabBarIcon: ({ focused, color }) => {
                const iconName = focused ? tab.activeIcon : tab.icon;
                const iconSize = tab.isCentral
                  ? TAB_BAR_STYLE.iconSize.central
                  : focused ? TAB_BAR_STYLE.iconSize.default + 2 : TAB_BAR_STYLE.iconSize.default;
                
                return (
                  <MaterialCommunityIcons
                    name={iconName as any}
                    color={color}
                    size={iconSize}
                  />
                );
              },
            }}
          />
        ))}
      </Tabs>
    </TransactionProvider>
  );
}