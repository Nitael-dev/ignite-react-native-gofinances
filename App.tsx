import React from 'react';
import theme from './src/global/styles/theme';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider } from 'styled-components/native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import AppLoading from 'expo-app-loading';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/AuthContext';
import { Routes } from './src/routes';

export const App = gestureHandlerRootHOC(() => {
  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if(!fontsLoaded || userStorageLoading) {
    return <AppLoading/>
  }
  return (
    <ThemeProvider theme={theme}>
        <StatusBar barStyle='light-content'/>
        <AuthProvider>
          <Routes/>
        </AuthProvider>
    </ThemeProvider>
  )
})