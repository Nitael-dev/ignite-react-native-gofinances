import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useAuth } from "../hooks/AuthContext";
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export const Routes = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user.id ? <AppRoutes/> :<AuthRoutes/>}
    </NavigationContainer>
  );
}