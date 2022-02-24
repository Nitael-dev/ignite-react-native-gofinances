import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from '../screens/SignIn';

const { Navigator, Screen } = createStackNavigator();

export const AuthRoutes = () => {
  
  return (
    <Navigator screenOptions={{headerMode: ''}}>
      <Screen
        name='SignIn'
        component={SignIn}
      />
    </Navigator>
  );
}