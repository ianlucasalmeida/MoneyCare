// theme.js
import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 10, // Arredondamento dos cantos
  colors: {
    ...DefaultTheme.colors,
    primary: '#FACC15', // Seu amarelo principal
    background: '#121212', // Fundo escuro
    surface: '#1E1E1E', // Cor de cartões e inputs
    onSurface: '#FFFFFF', // Texto sobre a superfície
    text: '#FFFFFF',
    placeholder: '#A9A9A9',
    primaryContainer: '#FACC15',
    onPrimaryContainer: '#000000',
  },
};