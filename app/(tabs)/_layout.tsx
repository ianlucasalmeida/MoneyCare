import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { TransactionProvider } from '../../contexts/TransactionContext';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const iconSize = 26; // Tamanho padrão para todos os ícones

  return (
    <TransactionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#FFFFFF',
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 30 : 20,
            marginHorizontal: 20,
            backgroundColor: theme.colors.primary,
            borderRadius: 30,
            height: 60, // Altura ajustada
            paddingBottom: Platform.OS === 'ios' ? 0 : 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus-circle" color={color} size={iconSize + 10} /> // Ícone central maior
            ),
          }}
        />
        <Tabs.Screen
          name="currencies"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="currency-usd" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={iconSize} />
            ),
          }}
        />
      </Tabs>
    </TransactionProvider>
  );
}