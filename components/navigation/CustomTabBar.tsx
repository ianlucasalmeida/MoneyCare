import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TABS_CONFIG, TAB_BAR_STYLE } from '../../constants/navigation';

// O componente recebe as props de navegação automaticamente
export function CustomTabBar({ state, descriptors, navigation }) {
  const theme = useTheme();

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.colors.primary }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        // Pega a configuração do nosso array
        const tabConfig = TABS_CONFIG.find(tab => tab.name === route.name);
        if (!tabConfig) return null;

        const iconName = (isFocused ? tabConfig.activeIcon : tabConfig.icon) as any;
        const color = isFocused ? theme.colors.surface : 'rgba(255, 255, 255, 0.7)';
        const iconSize = tabConfig.isCentral 
          ? TAB_BAR_STYLE.iconSize.central
          : TAB_BAR_STYLE.iconSize.default;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };
        
        // Renderização especial para o botão central
        if (tabConfig.isCentral) {
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.centralButtonWrapper}
            >
              <View style={[styles.centralIconContainer, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons name={iconName} color={theme.colors.primary} size={iconSize} />
              </View>
            </Pressable>
          );
        }

        // Renderização para os botões normais
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: TAB_BAR_STYLE.height,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralButtonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  centralIconContainer: {
    width: 60,
    height: 60,
    borderRadius: ,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -20 }],
    elevation: 8,
  },
});