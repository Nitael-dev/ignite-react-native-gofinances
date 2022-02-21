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
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { AppRoutes } from './src/routes/app.routes';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { SignIn } from './src/screens/SignIn';
import { AuthProvider } from './src/hooks/AuthContext';

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
        <StatusBar barStyle='light-content'/>
        {/* <AppRoutes/> */}
        <AuthProvider>
          <SignIn/>
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  )
})