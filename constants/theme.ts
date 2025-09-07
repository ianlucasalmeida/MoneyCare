import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FACC15',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#A9A9A9', // Cor para textos secundários e placeholders
    primaryContainer: '#FACC15',
    onPrimaryContainer: '#1E1E1E', // Texto/ícone sobre o botão amarelo
  },
};