import React from 'react';
import theme from './src/global/styles/theme';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { AppRoutes } from './src/routes/app.routes';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

export const App = gestureHandlerRootHOC(() => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if(!fontsLoaded) {
    return <AppLoading/>
  }
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer >
        <AppRoutes/>
      </NavigationContainer>
    </ThemeProvider>
  )
})